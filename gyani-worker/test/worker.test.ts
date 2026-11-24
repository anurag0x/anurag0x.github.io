// Unit tests with a fake Gemini (no network, no quota). Run: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { cleanHistory, openVoiceStream, pcmToWav, synthesize, voiceError, type Env } from "../src/index.ts";

const env: Env = { GEMINI_API_KEY: "test" };
const b64 = (bytes: number[]) => btoa(String.fromCharCode(...bytes));
const audio = (bytes: number[]) => ({ candidates: [{ content: { parts: [{ inlineData: { mimeType: "audio/L16;codec=pcm;rate=24000", data: b64(bytes) } }] } }] });
const noAudio = { candidates: [{ finishReason: "OTHER" }] };
const jsonRes = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });
const sse = (events: unknown[]) => new Response(events.map((e) => `data: ${JSON.stringify(e)}\r\n\r\n`).join(""), { status: 200 });

test("cleanHistory keeps valid turns and needs a user message last", () => {
  assert.deepEqual(cleanHistory([{ role: "user", text: " hi " }]), [{ role: "user", parts: [{ text: "hi" }] }]);
  assert.equal(cleanHistory([{ role: "model", text: "hello" }]), null);
  assert.equal(cleanHistory("nope"), null);
  assert.equal(cleanHistory([{ role: "system", text: "x" }, { role: "user", text: "" }]), null);
});

test("voiceError tells the per-minute limit from the daily one", () => {
  assert.equal(voiceError({ status: 429, body: "GenerateRequestsPerMinutePerProject" }), "busy");
  assert.equal(voiceError({ status: 429, body: '"limit": 10' }), "quota");
  assert.equal(voiceError(new Error("no audio")), "upstream");
});

test("pcmToWav writes a 44-byte header", () => {
  const wav = pcmToWav(new Uint8Array([1, 2, 3, 4]));
  assert.equal(wav.length, 48);
  assert.equal(String.fromCharCode(...wav.slice(0, 4)), "RIFF");
});

test("synthesize retries once when Gemini sends no audio", async () => {
  let calls = 0;
  const wav = await synthesize(env, "hello", async () => (++calls === 1 ? jsonRes(noAudio) : jsonRes(audio([1, 2]))));
  assert.equal(calls, 2);
  assert.equal(wav.length, 46);
});

test("synthesize with tries=1 makes a single request", async () => {
  let calls = 0;
  await assert.rejects(synthesize(env, "hello", async () => { calls++; return jsonRes(noAudio); }, 1), /no audio/);
  assert.equal(calls, 1);
});

test("synthesize surfaces 429 with its body", async () => {
  await assert.rejects(synthesize(env, "hi", async () => new Response('{"limit": 10}', { status: 429 })), (e: { status?: number; body?: string }) => e.status === 429 && !!e.body?.includes("limit"));
});

test("openVoiceStream returns the first audio and keeps the rest of the stream", async () => {
  const s = await openVoiceStream(env, "hi", async () => sse([{}, audio([1, 2]), audio([3, 4])]));
  assert.equal(s.rate, 24000);
  assert.deepEqual([...s.first[0]], [1, 2]);
  const rest = await s.events.next();
  assert.equal(rest.done, false);
});

test("openVoiceStream fails fast (one request) when no audio arrives", async () => {
  let calls = 0;
  await assert.rejects(openVoiceStream(env, "hi", async () => { calls++; return sse([noAudio]); }), /no audio/);
  assert.equal(calls, 1);
});

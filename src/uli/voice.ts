// Uli's voice: Gemini's natural female Indian voice ONLY (via the gyani worker's /speak).
// No browser voices and no other recordings, so she always sounds the same. If the voice is
// unavailable (free quota used up, offline), she answers in text and, once per visit, says
// sorry in the same voice from a saved clip.
import { spoken } from "./knowledge";

export type UliState = "idle" | "listening" | "thinking" | "speaking";

export interface VoiceHooks {
  setState: (s: UliState) => void;
  show: (text: string) => void;
  /** true while a spoken conversation is running (decides the reading pause) */
  isActive: () => boolean;
}

const VOICE_PAUSE_MS = 15 * 60 * 1000; // after a "quota" answer, don't ask again for a while
const SORRY =
  "Sorry for the inconvenience! My voice runs on a free tier, and I've used up today's limit, so I can't speak out loud right now. But I can still answer everything. Just read my replies on the screen.";
const SORRY_CLIP = "/voice/quota-sorry.m4a";

const store = {
  get: (k: string) => { try { return sessionStorage.getItem(k); } catch { return null; } },
  set: (k: string, v: string) => { try { sessionStorage.setItem(k, v); } catch { /* private mode */ } },
};
const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

type AudioCtor = typeof AudioContext;
const AudioCtx = (): AudioCtor | undefined =>
  window.AudioContext ?? (window as unknown as { webkitAudioContext?: AudioCtor }).webkitAudioContext;

export class Voice {
  private audio: HTMLAudioElement | null = null;
  private token = 0;
  private stopStream: (() => void) | null = null;
  private ctx: AudioContext | null = null;
  private voiceDownUntil = Number(store.get("owl-voice-down")) || 0;
  private apologized = store.get("owl-sorry") === "1";

  constructor(private readonly speakUrl: string, private readonly hooks: VoiceHooks) {}

  /** Browsers only allow audio after a tap/click: call this from the first one. */
  unlock(): AudioContext | null {
    const AC = AudioCtx();
    if (!AC) return null;
    this.ctx ??= new AC();
    if (this.ctx.state === "suspended") this.ctx.resume().catch(() => {});
    return this.ctx;
  }

  stop(): void {
    this.token++;
    if (this.audio) { this.audio.pause(); this.audio = null; }
    if (this.stopStream) { this.stopStream(); this.stopStream = null; }
  }

  async speak(text: string): Promise<void> {
    const clean = spoken(text);
    const token = ++this.token;
    if (this.audio) { this.audio.pause(); this.audio = null; }
    const voice = await this.fetchVoice(clean);
    if (token !== this.token) return;
    if (voice instanceof Response) {
      if (await this.playStream(voice, token)) return;
    } else if (voice) {
      const src = URL.createObjectURL(voice);
      const ok = await this.playUrl(src, token);
      URL.revokeObjectURL(src);
      if (ok) return;
    }
    if (token !== this.token) return;
    if (!this.apologized && Date.now() < this.voiceDownUntil) await this.apologize(token, text); // only when the quota is really used up
    if (token !== this.token) return;
    // voice unavailable: give the visitor time to read before the mic opens again
    if (this.hooks.isActive()) await wait(Math.min(9000, 1500 + clean.length * 45));
  }

  private markVoiceDown() {
    this.voiceDownUntil = Date.now() + VOICE_PAUSE_MS;
    store.set("owl-voice-down", String(this.voiceDownUntil));
  }

  // One request per reply (not per sentence) so the small free quota lasts longer.
  // The worker caches each line at the edge, so repeated lines cost nothing.
  private async fetchVoice(text: string): Promise<Response | Blob | null> {
    if (!this.speakUrl || Date.now() < this.voiceDownUntil) return null;
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 15000);
    try {
      const r = await fetch(this.speakUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, stream: !!AudioCtx() }),
        signal: ctrl.signal,
      });
      if (r.ok) {
        clearTimeout(t); // the voice may stream for longer than the timeout
        return /audio\/L16/i.test(r.headers.get("Content-Type") || "") ? r : await r.blob();
      }
      // pause the voice only when the daily quota is really used up, not on a one-off hiccup
      const err = (await r.json().catch(() => ({}))) as { error?: string };
      if (err.error === "quota") this.markVoiceDown();
      return null;
    } catch {
      return null;
    } finally {
      clearTimeout(t);
    }
  }

  // Streamed voice: raw 16-bit PCM from the worker, played with Web Audio as it arrives.
  private playStream(res: Response, token: number): Promise<boolean> {
    return new Promise((resolve) => {
      const ctx = this.unlock();
      if (!ctx || !res.body) return resolve(false);
      const rate = Number((res.headers.get("Content-Type") || "").match(/rate=(\d+)/)?.[1]) || 24000;
      const reader = res.body.getReader();
      const sources: AudioBufferSourceNode[] = [];
      let nextT = 0, played = false, stopped = false, carry: Uint8Array | null = null, pending: Float32Array[] = [], pendingLen = 0;
      const finish = (ok: boolean) => { if (this.stopStream === stop) this.stopStream = null; resolve(ok); };
      const stop = () => {
        stopped = true;
        reader.cancel().catch(() => {});
        sources.forEach((s) => { try { s.stop(); } catch { /* not started */ } });
        finish(true);
      };
      this.stopStream = stop;
      const schedule = (floats: Float32Array) => {
        const buf = ctx.createBuffer(1, floats.length, rate);
        buf.getChannelData(0).set(floats);
        const src = ctx.createBufferSource();
        src.buffer = buf;
        src.connect(ctx.destination);
        const at = Math.max(nextT, ctx.currentTime + 0.06);
        src.start(at);
        nextT = at + buf.duration;
        sources.push(src);
        if (!played) { played = true; this.hooks.setState("speaking"); }
      };
      const flush = () => {
        if (!pendingLen) return;
        const out = new Float32Array(pendingLen);
        let o = 0;
        for (const f of pending) { out.set(f, o); o += f.length; }
        pending = []; pendingLen = 0;
        schedule(out);
      };
      (async () => {
        try {
          for (;;) {
            const { done, value } = await reader.read();
            if (stopped || token !== this.token) return stop();
            if (done) break;
            let bytes: Uint8Array = value;
            if (carry) { const m = new Uint8Array(carry.length + bytes.length); m.set(carry); m.set(bytes, carry.length); bytes = m; carry = null; }
            if (bytes.length % 2) { carry = bytes.slice(-1); bytes = bytes.slice(0, -1); }
            const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
            const f = new Float32Array(bytes.length / 2);
            for (let i = 0; i < f.length; i++) f[i] = view.getInt16(i * 2, true) / 32768;
            pending.push(f); pendingLen += f.length;
            // gather ~0.25 s before the first sound so it doesn't stutter, then play as it comes
            if (played || pendingLen >= rate * 0.25) flush();
          }
          flush();
        } catch {
          if (!played) return finish(false);
        }
        if (!played) return finish(false);
        const tick = () => {
          if (stopped || token !== this.token) return;
          const left = nextT - ctx.currentTime;
          if (left <= 0.02) return finish(true);
          setTimeout(tick, Math.min(250, left * 1000));
        };
        tick();
      })();
    });
  }

  private playUrl(src: string, token: number): Promise<boolean> {
    return new Promise((resolve) => {
      if (token !== this.token) return resolve(true);
      const a = new Audio(src);
      this.audio = a;
      let started = false;
      a.onplaying = () => { started = true; this.hooks.setState("speaking"); };
      a.onended = a.onpause = () => resolve(true);
      a.onerror = () => resolve(started);
      a.play().catch(() => resolve(false));
    });
  }

  private async apologize(token: number, text: string) {
    this.apologized = true;
    store.set("owl-sorry", "1");
    this.hooks.show(SORRY);
    const played = await this.playUrl(SORRY_CLIP, token);
    if (!played && token === this.token) await wait(5000);
    if (token === this.token) { this.hooks.show(text); this.hooks.setState("idle"); }
  }
}

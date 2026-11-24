// Minimal typings for the Web Speech recognition API (Chrome/Edge/Safari ship it, often prefixed).
export interface SpeechAlternative { transcript: string }
export interface SpeechResult { isFinal: boolean; length: number; [i: number]: SpeechAlternative }
export interface SpeechResultEvent { resultIndex: number; results: { length: number; [i: number]: SpeechResult } & Iterable<SpeechResult> }
export interface Recognizer {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onstart: (() => void) | null;
  onresult: ((e: SpeechResultEvent) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  abort(): void;
}
export type RecognizerCtor = new () => Recognizer;

export const getRecognizer = (): RecognizerCtor | undefined => {
  const w = window as unknown as { SpeechRecognition?: RecognizerCtor; webkitSpeechRecognition?: RecognizerCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
};

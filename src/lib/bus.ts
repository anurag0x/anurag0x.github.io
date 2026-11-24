// A tiny typed event bus so the separate client islands (terminal, palette, owl, hero...) can
// talk to each other without prop-drilling or a global store.
import type { ProjectFilter } from "@/data/projects";

export type Overlay = "terminal" | "palette";

export interface BusEvents {
  "overlay:open": Overlay;
  "overlay:close": void;
  toast: string;
  "chaos:toggle": void;
  chaos: boolean; // emitted after the mode changed
  confetti: void;
  matrix: void;
  "owl:open": void;
  "owl:ask": string;
  "work:filter": ProjectFilter;
}

type Handler<K extends keyof BusEvents> = (payload: BusEvents[K]) => void;
const handlers = new Map<keyof BusEvents, Set<Handler<never>>>();

export function on<K extends keyof BusEvents>(event: K, handler: Handler<K>): () => void {
  let set = handlers.get(event);
  if (!set) handlers.set(event, (set = new Set()));
  set.add(handler as Handler<never>);
  return () => { set.delete(handler as Handler<never>); };
}

export function emit<K extends keyof BusEvents>(...[event, payload]: BusEvents[K] extends void ? [K] : [K, BusEvents[K]]): void {
  handlers.get(event)?.forEach((h) => (h as Handler<K>)(payload as BusEvents[K]));
}

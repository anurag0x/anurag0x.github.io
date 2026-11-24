import { EMAIL, RESUME_FILE, RESUME_URL, type SectionId, SECTIONS } from "@/data/site";

export const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

export const hasFinePointer = (): boolean =>
  typeof window !== "undefined" && matchMedia("(pointer: fine)").matches;

export const esc = (s: unknown): string =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

export async function copyText(text: string): Promise<boolean> {
  try { await navigator.clipboard.writeText(text); return true; } catch { return false; }
}
export const copyEmail = () => copyText(EMAIL);

export function downloadResume(): void {
  const a = document.createElement("a");
  a.href = RESUME_URL;
  a.download = RESUME_FILE;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export const openTab = (url: string) => window.open(url, "_blank", "noopener");

export function scrollToSection(id: SectionId): void {
  setTimeout(() => document.querySelector(SECTIONS[id])?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" }), 50);
}

const isPhone = (): boolean =>
  /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || matchMedia("(pointer: coarse)").matches;

// Start an email to Anurag: the mail app on phones (mailto: opens Gmail or the default app),
// Gmail's compose window in a new tab on laptops.
export function draftEmail(subject = "Hi Anurag"): void {
  if (isPhone()) {
    location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}`;
    return;
  }
  const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(EMAIL)}&su=${encodeURIComponent(subject)}`;
  // (window.open returns null when passed "noopener", so clear the opener by hand instead)
  const tab = window.open(url, "_blank");
  if (tab) tab.opener = null;
  else location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}`; // pop-up blocked
}

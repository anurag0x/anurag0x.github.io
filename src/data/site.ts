export const EMAIL = "anuragkushwah134@gmail.com";
export const RESUME_URL = "/Resume/Anurag-Kushwah-Resume.pdf";
export const RESUME_FILE = "Anurag-Kushwah-Resume.pdf";

export const LINKS = {
  github: "https://github.com/anurag0x",
  linkedin: "https://www.linkedin.com/in/anuraagkushwah",
  twitter: "https://twitter.com/anuraag0x",
} as const;

export const SECTIONS = {
  about: "#about",
  trace: "#trace",
  work: "#work",
  stack: "#stack",
  play: "#play",
  contact: "#contact",
} as const;
export type SectionId = keyof typeof SECTIONS;

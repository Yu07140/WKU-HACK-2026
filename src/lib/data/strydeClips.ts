/**
 * STRYDE CLIPS — A–Z personal letter selector data.
 * Each letter has its own high-res product preview:
 * same 14534-H boot, same studio template — only the silver letter charm changes.
 */
export const CLIP_LETTERS = [
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
  "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
] as const;

export type ClipLetter = (typeof CLIP_LETTERS)[number];

export const clipLetterImage = (letter: ClipLetter): string =>
  `/clips/letters/${letter}.png`;

export const isClipLetter = (v: string): v is ClipLetter =>
  (CLIP_LETTERS as readonly string[]).includes(v);

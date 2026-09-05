// Composites the silver letter charm onto the approved 14534-H base photo,
// producing A–Z previews that are identical except for the charm.
// Usage: node scripts/make-letters.mjs A        → single letter (visual check)
//        node scripts/make-letters.mjs ALL      → full alphabet
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";

const BASE = "public/products/14534-h/hero.jpg";
const OUT_DIR = "public/clips/letters";

// --- Crop (fractions of the original photo) → tall portrait template ---
const CROP_LEFT = 0.18;
const CROP_W = 0.8; // → 0.8:1 ≈ 4:5 portrait, boot dominates the frame

// --- Charm placement (fractions of the ORIGINAL photo) — solid shaft panel, right of the whipstitch ladder ---
const FX = 0.745;
const FY = 0.47;
const FS = 0.108; // charm font size relative to original width

const arg = process.argv[2] ?? "A";
const LETTERS =
  arg.toUpperCase() === "ALL"
    ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
    : arg.toUpperCase().split("");

const meta = await sharp(BASE).metadata();
const W = meta.width;
const H = meta.height;
const left = Math.round(W * CROP_LEFT);
const width = Math.round(W * CROP_W);
const height = H;

const CX = Math.round(FX * W - left);
const CY = Math.round(FY * H);
const SIZE = Math.round(FS * W);

const charmSvg = (letter) => {
  const baselineY = CY + Math.round(SIZE * 0.35);
  const ringCy = CY - Math.round(SIZE * 0.62);
  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="silver" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f7f8fa"/>
      <stop offset="0.35" stop-color="#c7cbd3"/>
      <stop offset="0.65" stop-color="#8f96a1"/>
      <stop offset="1" stop-color="#dfe3e9"/>
    </linearGradient>
    <filter id="ds" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000000" flood-opacity="0.45"/>
    </filter>
  </defs>
  <g filter="url(#ds)">
    <circle cx="${CX}" cy="${ringCy}" r="${Math.round(SIZE * 0.09)}" fill="none" stroke="url(#silver)" stroke-width="${Math.round(SIZE * 0.055)}"/>
    <text x="${CX}" y="${baselineY}" text-anchor="middle"
      font-family="Arial Black, Arial, sans-serif" font-weight="900"
      font-size="${SIZE}" fill="url(#silver)" stroke="#6d737d" stroke-width="2">${letter}</text>
  </g>
</svg>`;
};

await mkdir(OUT_DIR, { recursive: true });
for (const L of LETTERS) {
  const out = await sharp(BASE)
    .extract({ left, top: 0, width, height })
    .composite([{ input: Buffer.from(charmSvg(L)) }])
    .png()
    .toBuffer();
  await writeFile(`${OUT_DIR}/${L}.png`, out);
  console.log(`[make-letters] wrote ${OUT_DIR}/${L}.png`);
}
console.log(
  `[make-letters] done (${LETTERS.length}) — crop ${width}x${height}, charm @ ${CX},${CY} size ${SIZE}`
);

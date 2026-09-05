// Polls the text_to_image API until the real boot photo is ready
// (the API returns a light-gray "generating" placeholder until done).
import sharp from "sharp";
import { writeFile } from "node:fs/promises";

const PROMPT =
  "Editorial studio catalog photo, 85mm lens. Professional e-commerce product photograph of a single black leather ankle boot standing upright, tall slim silhouette, rounded toe, low block heel, chunky flat black rubber outsole, concealed back zipper with small black leather pull, warm tan leather lining visible at the collar, decorative off-white horizontal whipstitch loops running in a diagonal line down the front instep, soft matte black leather with subtle sheen, centered vertical composition, full boot visible from collar to sole, seamless warm light gray studio background, soft diffused studio lighting, gentle floor shadow, photorealistic premium product catalog style, no person, no hands, no props, no text, no watermark";
const URL_BASE = "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image";
const OUT = "public/clips/_base.png";
const MAX_TRIES = 30; // ~10 min at 20s interval
const INTERVAL_MS = 20000;

const isPlaceholder = async (buf) => {
  const { data, info } = await sharp(buf)
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });
  let dark = 0;
  for (let i = 0; i < data.length; i++) if (data[i] < 77) dark++;
  const darkFraction = dark / data.length;
  return { placeholder: darkFraction < 0.08, darkFraction };
};

for (let attempt = 1; attempt <= MAX_TRIES; attempt++) {
  try {
    const res = await fetch(`${URL_BASE}?prompt=${encodeURIComponent(PROMPT)}&image_size=portrait_4_3`);
    const buf = Buffer.from(await res.arrayBuffer());
    const { placeholder, darkFraction } = await isPlaceholder(buf);
    console.log(`[poll-base] attempt ${attempt}: darkFraction=${darkFraction.toFixed(4)} -> ${placeholder ? "placeholder" : "REAL"}`);
    if (!placeholder) {
      await writeFile(OUT, buf);
      const meta = await sharp(buf).metadata();
      console.log(`[poll-base] SAVED ${OUT} (${meta.width}x${meta.height})`);
      process.exit(0);
    }
  } catch (e) {
    console.error(`[poll-base] attempt ${attempt} error:`, e.message);
  }
  await new Promise((r) => setTimeout(r, INTERVAL_MS));
}
console.error("[poll-base] TIMED OUT without a real image");
process.exit(1);

// Multiplexed base-image generator: fires one GET per prompt variant (parallel
// server-side jobs), then re-checks each periodically until one returns a real
// photo (not the light-gray "generating" placeholder). Saves the first winner.
import sharp from "sharp";
import { writeFile } from "node:fs/promises";

const API = "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image";
const OUT = "public/clips/_base.png";

const CORE =
  "single black leather ankle boot, tall slim silhouette, rounded toe, low block heel, flat black rubber outsole, back zipper, warm tan leather lining at the collar, off-white whipstitch loop detailing in a diagonal line down the front instep, full boot visible collar to sole, centered, seamless warm light gray studio background, soft diffused lighting, gentle floor shadow, photorealistic product catalog photo, no person, no hands, no text";

const VARIANTS = [
  { name: "medium", prompt: `Studio product photograph of a ${CORE}`, size: "portrait_4_3" },
  { name: "short", prompt: "Black leather ankle boot studio product photo, off-white stitch loops on the instep, light gray background, full boot, no person", size: "portrait_4_3" },
  { name: "square_hd", prompt: `Professional e-commerce photograph of a ${CORE}`, size: "square_hd" },
  { name: "editorial", prompt: `Editorial studio catalog photo, 85mm lens, ${CORE}`, size: "portrait_4_3" },
];

const isPlaceholder = async (buf) => {
  const { data } = await sharp(buf).greyscale().raw().toBuffer({ resolveWithObject: true });
  let dark = 0;
  for (let i = 0; i < data.length; i++) if (data[i] < 77) dark++;
  return dark / data.length < 0.08;
};

const url = (v) => `${API}?prompt=${encodeURIComponent(v.prompt)}&image_size=${v.size}`;

// Fire all jobs once.
for (const v of VARIANTS) {
  try {
    await fetch(url(v));
    console.log(`[gen-base2] kicked ${v.name}`);
  } catch (e) {
    console.error(`[gen-base2] kick ${v.name} failed:`, e.message);
  }
}

const pending = new Map(VARIANTS.map((v) => [v.name, v]));
for (let round = 1; round <= 12 && pending.size > 0; round++) {
  await new Promise((r) => setTimeout(r, 150000)); // 2.5 min between checks
  for (const [name, v] of [...pending]) {
    try {
      const res = await fetch(url(v));
      const buf = Buffer.from(await res.arrayBuffer());
      const ph = await isPlaceholder(buf);
      console.log(`[gen-base2] round ${round} ${name}: ${ph ? "placeholder" : "REAL"}`);
      if (!ph) {
        await writeFile(OUT, buf);
        const meta = await sharp(buf).metadata();
        console.log(`[gen-base2] SAVED ${OUT} from ${name} (${meta.width}x${meta.height})`);
        process.exit(0);
      }
    } catch (e) {
      console.error(`[gen-base2] round ${round} ${name} error:`, e.message);
    }
  }
}
console.error("[gen-base2] all variants timed out");
process.exit(1);

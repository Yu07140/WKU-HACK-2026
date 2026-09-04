import type { Product } from "@/lib/types";

/* ------------------------------------------------------------------
 * AI 视频脚本生成 —— 15 秒 TikTok / Reels 结构化脚本
 * 规则模板引擎，零 API Key 可完整演示（模块 B 可替换为 LLM）
 * ------------------------------------------------------------------ */

export interface ScriptScene {
  /** 时间区间，如 "0–3s" */
  time: string;
  visual: string;
  text: string;
  voiceover: string;
}

export interface VideoScript {
  scenes: ScriptScene[];
}

type ScriptBuilder = (p: Product) => VideoScript;

/** 11295-J：One boot. Three moods.（组委会确认的演示脚本） */
const ATLAS_SCRIPTS: ScriptBuilder[] = [
  (p) => ({
    scenes: [
      {
        time: "0–3s",
        visual: "Real product close-up transitions into styled AI concept.",
        text: "One boot. Three moods.",
        voiceover: `This is ${p.name}.`,
      },
      {
        time: "3–7s",
        visual: "Brown / oxblood styling with loose black trousers.",
        text: "POLISHED.",
        voiceover: "Polished for the evening.",
      },
      {
        time: "7–11s",
        visual: "Patent-style creative with tighter crop on shine and lacing.",
        text: "SHARPER.",
        voiceover: "Sharper when the light hits.",
      },
      {
        time: "11–15s",
        visual: "Real reference lineup + AI campaign hero.",
        text: "PICK YOURS.",
        voiceover: "Explore STRYDE.",
      },
    ],
  }),
  (p) => ({
    scenes: [
      {
        time: "0–3s",
        visual: "Macro shot of glossy patent upper reflecting street light.",
        text: "Gloss after dark.",
        voiceover: `Meet ${p.name}.`,
      },
      {
        time: "3–7s",
        visual: "Low-angle walk shot, tan lug sole hitting pavement.",
        text: "BUILT CHUNKY.",
        voiceover: "Chunky sole, sharp lines.",
      },
      {
        time: "7–11s",
        visual: "Quick color swap montage: oxblood → brown → black → red.",
        text: "FOUR FINISHES.",
        voiceover: "Which one is you?",
      },
      {
        time: "11–15s",
        visual: "Product hero on white background with logo sting.",
        text: "STRYDE / STAND UP. STAND OUT.",
        voiceover: "Shop the drop now.",
      },
    ],
  }),
];

/** 53125-J：Not built to blend in.（组委会确认的演示脚本） */
const FORGE_SCRIPTS: ScriptBuilder[] = [
  (p) => ({
    scenes: [
      {
        time: "0–3s",
        visual: "Boot silhouette under a hard spotlight.",
        text: "Not built to blend in.",
        voiceover: `${p.name}.`,
      },
      {
        time: "3–7s",
        visual: "Close-up of upper texture and lacing.",
        text: "DETAIL.",
        voiceover: "Embossed texture, metal eyelets.",
      },
      {
        time: "7–11s",
        visual: "Low-angle concept shot focusing on the sculptural sole.",
        text: "VOLUME.",
        voiceover: "Sculptural platform volume.",
      },
      {
        time: "11–15s",
        visual: "Full product hero in an industrial chrome concept environment.",
        text: "STRYDE / STAND UP. STAND OUT.",
        voiceover: "See the drop.",
      },
    ],
  }),
  (p) => ({
    scenes: [
      {
        time: "0–3s",
        visual: "Flash-photo style shot in a concrete parking structure.",
        text: "Y2K energy.",
        voiceover: `This is ${p.name}.`,
      },
      {
        time: "3–7s",
        visual: "Pan across the graphic black-and-silver sole details.",
        text: "GRAPHIC SOLE.",
        voiceover: "Every angle is a statement.",
      },
      {
        time: "7–11s",
        visual: "Styled with oversized black trousers, street level.",
        text: "STYLED YOUR WAY.",
        voiceover: "Dress it loud.",
      },
      {
        time: "11–15s",
        visual: "White studio hero with negative space for headline.",
        text: "STRYDE / STAND UP. STAND OUT.",
        voiceover: "See the statement boot.",
      },
    ],
  }),
];

/** 14534-H 与通用兜底模板 */
const GENERIC_SCRIPTS: ScriptBuilder[] = [
  (p) => ({
    scenes: [
      {
        time: "0–3s",
        visual: "Real product close-up on clean background.",
        text: p.tagline,
        voiceover: `This is ${p.name}.`,
      },
      {
        time: "3–7s",
        visual: "Detail crop: stitching, eyelets, outsole.",
        text: "LOOK CLOSER.",
        voiceover: p.features[0] ?? "Built on details.",
      },
      {
        time: "7–11s",
        visual: "On-foot styling shot moving through the city.",
        text: "MADE TO MOVE.",
        voiceover: "From day fit to night fit.",
      },
      {
        time: "11–15s",
        visual: "Product hero with brand sting.",
        text: "STRYDE / STAND UP. STAND OUT.",
        voiceover: "Shop the drop.",
      },
    ],
  }),
  (p) => ({
    scenes: [
      {
        time: "0–3s",
        visual: "Unboxing shot: box opens, tissue folds back.",
        text: "New drop day.",
        voiceover: `Just landed: ${p.name}.`,
      },
      {
        time: "3–7s",
        visual: "Hands lift the shoe, slow rotate.",
        text: p.features[0]?.toUpperCase() ?? "FIRST LOOK.",
        voiceover: "First look, real details.",
      },
      {
        time: "7–11s",
        visual: "UGC-style on-foot clip, natural light.",
        text: "ON FOOT.",
        voiceover: "How they wear, how they move.",
      },
      {
        time: "11–15s",
        visual: "Studio hero + price tag on screen.",
        text: "STRYDE / STAND UP. STAND OUT.",
        voiceover: "Find your size today.",
      },
    ],
  }),
];

const SCRIPT_SETS: Record<string, ScriptBuilder[]> = {
  "boot-11295-j": ATLAS_SCRIPTS,
  "boot-53125-j": FORGE_SCRIPTS,
};

/**
 * 生成 15 秒短视频脚本。
 * variant 用于 Regenerate：同一产品在多套模板间轮换，保证再生成有变化。
 */
export function generateVideoScript(product: Product, variant = 0): VideoScript {
  const set = SCRIPT_SETS[product.id] ?? GENERIC_SCRIPTS;
  return set[variant % set.length](product);
}

/** 把脚本导出为可复制的纯文本 */
export function scriptToText(product: Product, script: VideoScript): string {
  const header = `${product.name}${product.sku ? ` (${product.sku})` : ""} — 15s TikTok/Reels Script\n`;
  const body = script.scenes
    .map(
      (s) =>
        `${s.time}\n  Visual: ${s.visual}\n  On-screen text: ${s.text}\n  Voiceover: ${s.voiceover}`
    )
    .join("\n\n");
  return `${header}\n${body}\n`;
}

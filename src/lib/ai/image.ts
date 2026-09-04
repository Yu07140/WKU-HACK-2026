/* ------------------------------------------------------------------
 * AIGC 出图能力 —— 统一封装文生图接口
 * 模块 B（素材工坊）与前台商品图都走这里，换模型只改这一个文件
 * ------------------------------------------------------------------ */

const IMAGE_API =
  "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image";

export type ImageSize =
  | "square_hd"
  | "square"
  | "portrait_4_3"
  | "portrait_16_9"
  | "landscape_4_3"
  | "landscape_16_9";

/** 由 prompt 直接拼出可 <img src> 使用的图片 URL */
export function aiImageUrl(prompt: string, size: ImageSize = "square"): string {
  return `${IMAGE_API}?prompt=${encodeURIComponent(prompt)}&image_size=${size}`;
}

/** 商品白底/场景图风格预设，素材工坊里直接选用 */
export const IMAGE_STYLES: { id: string; label: string; suffix: string }[] = [
  {
    id: "studio",
    label: "Studio 白底棚拍",
    suffix:
      "professional e-commerce product photography, soft cream studio background, soft diffused lighting, subtle ground shadow, centered composition, ultra detailed, 8k",
  },
  {
    id: "street",
    label: "Street 街头穿搭",
    suffix:
      "lifestyle street style photo, young person wearing the shoes walking on a sunlit city street, shallow depth of field, cinematic color grade, editorial fashion photography",
  },
  {
    id: "nature",
    label: "Outdoor 户外场景",
    suffix:
      "outdoor lifestyle photo on a misty mountain trail at golden hour, dramatic natural light, epic landscape, adventure brand campaign style, photorealistic",
  },
  {
    id: "flatlay",
    label: "Flatlay 创意平铺",
    suffix:
      "minimalist flat lay composition on warm beige linen fabric with dried flowers and coffee cup, soft natural window light, trendy DTC brand aesthetic, top down view",
  },
  {
    id: "ad",
    label: "Ad 广告海报",
    suffix:
      "bold advertising campaign poster, high contrast studio lighting, floating product with dynamic energy waves, vibrant gradient background in orange and cream, premium sportswear ad style",
  },
  {
    id: "ugc",
    label: "UGC On-Foot 上脚实拍",
    suffix:
      "candid user-generated style photo taken on a phone, person wearing the shoes on foot, casual everyday setting, natural lighting, authentic social media look, slightly imperfect framing, realistic",
  },
  {
    id: "unboxing",
    label: "Unboxing 开箱平铺",
    suffix:
      "unboxing flat lay photo, shoes next to an open shoebox with tissue paper, top-down view on a clean table, soft natural window light, cozy DTC ecommerce unboxing aesthetic",
  },
];

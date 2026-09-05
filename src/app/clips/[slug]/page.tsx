import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CLIP_COLLECTIONS, STATUS } from "@/lib/data/brand";

export function generateStaticParams() {
  return CLIP_COLLECTIONS.filter((c) => c.slug !== "personal").map((c) => ({
    slug: c.slug,
  }));
}

export default async function ClipCollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const col = CLIP_COLLECTIONS.find((c) => c.slug === slug);
  if (!col) notFound();

  const others = CLIP_COLLECTIONS.filter((c) => c.slug !== slug && c.slug !== "personal");

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
      {/* ---------- BACK ---------- */}
      <Link
        href="/clips"
        className="inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.2em] text-ink/50 transition hover:text-ink"
      >
        <ArrowLeft size={14} /> ALL CLIPS
      </Link>

      {/* ---------- HERO ---------- */}
      <div className="mt-8 border-b border-ink/10 pb-10">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <div className="text-xs font-bold tracking-[0.3em] text-ink/40">
            FOUR DIRECTIONS · {col.no}
          </div>
          <span className="rounded-full bg-ink/90 px-3 py-1 text-[11px] font-black tracking-wider text-paper">
            {STATUS.comingSoon}
          </span>
          <span className="rounded-full bg-ink/10 px-3 py-1 text-[11px] font-bold tracking-wider text-ink/60">
            {STATUS.inDevelopment}
          </span>
        </div>
        <h1 className="text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
          {col.name}
        </h1>
        <p className="mt-4 max-w-xl text-lg text-ink/60">{col.desc}</p>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink/55">
          STRYDE CLIPS are decorative clip-on details for the front loop of the
          14534-H. This direction is in development — previews below show the
          marks we&apos;re exploring.
        </p>
      </div>

      {/* ---------- MARK PREVIEWS ---------- */}
      <section className="py-12">
        <div className="mb-6">
          <div className="text-xs font-bold tracking-[0.25em] text-ink/40">
            {col.name} MARKS
          </div>
          <h2 className="mt-2 text-2xl font-black md:text-3xl">
            Explore the direction.
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {col.samples.map((s) => {
            const img = (col.images as Record<string, string> | undefined)?.[s];
            return img ? (
              <div
                key={s}
                className="overflow-hidden rounded-3xl border border-ink/10 bg-white"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img}
                  alt={`14534-H with ${col.name} ${s} clip preview`}
                  className="aspect-[4/5] w-full object-cover"
                />
                <div className="border-t border-ink/10 p-3 text-center text-xs font-black tracking-wider text-ink/70">
                  {s}
                </div>
              </div>
            ) : (
              <div
                key={s}
                className="flex aspect-[4/5] flex-col items-center justify-center rounded-3xl border border-dashed border-ink/25 bg-cream/60 p-6 text-center"
              >
                <span className="text-4xl font-black tracking-wider text-ink md:text-5xl">
                  {s}
                </span>
                <span className="mt-4 text-[10px] font-black tracking-[0.2em] text-ink/35">
                  PREVIEW SOON
                </span>
              </div>
            );
          })}
        </div>
        <p className="mt-5 text-xs text-ink/40">
          Final preview renders for these marks are on their way. Personalized
          STRYDE Clips are currently in development and are not available for
          order yet.
        </p>
      </section>

      {/* ---------- A–Z LINK ---------- */}
      <section className="mb-12 rounded-3xl bg-ink p-8 text-paper md:p-10">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="text-xs font-black tracking-[0.3em] text-paper/45">
              PERSONAL LETTERS
            </div>
            <h2 className="mt-2 text-2xl font-black md:text-3xl">
              Try your own initial now.
            </h2>
            <p className="mt-2 max-w-md text-paper/60">
              The A–Z personalization preview is already live — pick any letter
              and see it on the 14534-H.
            </p>
          </div>
          <Link href="/clips#letter-selector">
            <span className="inline-flex items-center gap-2 rounded-full bg-paper px-6 py-3 text-xs font-black tracking-[0.2em] text-ink transition hover:bg-white">
              EXPLORE A–Z SELECTOR <ArrowRight size={15} />
            </span>
          </Link>
        </div>
      </section>

      {/* ---------- OTHER DIRECTIONS ---------- */}
      <section>
        <div className="mb-5 text-xs font-bold tracking-[0.25em] text-ink/40">
          MORE DIRECTIONS
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          {others.map((o) => (
            <Link
              key={o.slug}
              href={`/clips/${o.slug}`}
              className="group rounded-3xl border border-ink/10 bg-white p-6 transition duration-200 hover:border-ink/40 hover:shadow-md"
            >
              <div className="text-xs font-black tracking-[0.25em] text-ink/40">
                {o.no}
              </div>
              <h3 className="mt-2 text-xl font-black tracking-wide group-hover:underline group-hover:underline-offset-4">
                {o.name}
              </h3>
              <p className="mt-1.5 text-sm text-ink/55">{o.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

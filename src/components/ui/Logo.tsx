import { brand } from "@/lib/brand";

/**
 * Brasao Maison Kranich: monograma compacto para renderizar bem em header,
 * sidebar, auth e favicon-like contexts.
 */
export function Crest({ size = 56 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      fill="none"
      aria-hidden
      className="shrink-0 text-dourado drop-shadow-[0_0_10px_rgba(201,163,106,0.22)]"
    >
      <circle cx="48" cy="48" r="43" fill="rgba(201,163,106,0.08)" />
      <ellipse
        cx="48"
        cy="49"
        rx="31"
        ry="37"
        stroke="currentColor"
        strokeWidth="2.4"
      />
      <ellipse
        cx="48"
        cy="49"
        rx="35"
        ry="41"
        stroke="currentColor"
        strokeWidth="0.9"
        opacity="0.36"
      />
      <path
        d="M33 26c4.8-3.1 10.2-4.7 16-4.7 4.5 0 8.7 1 12.5 3.1"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        opacity="0.72"
      />
      <path
        d="M50.5 18c-3.5 2.2-5.3 5.2-5.3 8.9 0 2.4.8 4.4 2.4 6.1 1.4 1.5 3.4 2.4 5.8 2.7-1.2-1.8-1.8-3.7-1.8-5.7 0-3.2 1.8-5.9 5.3-8.1-2.7.4-4.9-.9-6.4-3.9Z"
        fill="currentColor"
      />
      <text
        x="48"
        y="61"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontWeight="700"
        fontSize="31"
        letterSpacing="-1"
        fill="currentColor"
      >
        MK
      </text>
      <path
        d="M24 69c7.7 5 15.7 7.5 24 7.5S64.3 74 72 69"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        opacity="0.72"
      />
    </svg>
  );
}

export function Logo({
  stacked = false,
  size = 48,
  imageUrl,
  name = brand.name,
  tagline = brand.tagline,
}: {
  stacked?: boolean;
  size?: number;
  imageUrl?: string | null;
  name?: string;
  tagline?: string;
}) {
  const cleanImageUrl = imageUrl?.trim() || null;
  const displayName = name?.trim() || brand.name;
  const displayTagline = tagline?.trim() || brand.tagline;

  return (
    <div
      className={
        stacked
          ? "flex flex-col items-center gap-1 text-center"
          : "flex items-center gap-3"
      }
    >
      {cleanImageUrl ? (
        <span
          className="flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-dourado/25 bg-carvao-deep/70 p-1.5"
          style={{ width: size, height: size }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cleanImageUrl}
            alt=""
            className="h-full w-full object-contain"
            loading="eager"
            decoding="async"
          />
        </span>
      ) : (
        <Crest size={size} />
      )}
      <div className={stacked ? "" : "leading-none"}>
        <div className="font-serif text-xl tracking-brand text-marfim">
          {displayName.toUpperCase()}
        </div>
        <div className="mt-1 text-[10px] uppercase tracking-wide2 text-dourado/80">
          {displayTagline}
        </div>
      </div>
    </div>
  );
}

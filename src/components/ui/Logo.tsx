import { brand } from "@/lib/brand";

/**
 * Brasão Maison Kranich — monograma MK em moldura oval,
 * ave (grua) ao topo, ramos botânicos laterais. Tudo em dourado.
 */
export function Crest({ size = 56 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden
      className="text-dourado"
    >
      <ellipse
        cx="50"
        cy="52"
        rx="26"
        ry="33"
        stroke="currentColor"
        strokeWidth="1.4"
        opacity="0.9"
      />
      {/* grua estilizada */}
      <path
        d="M50 16c-2 3-1 6 1 7-3 1-5 3-5 6 2-1 4-1 6 0 1-3 1-5 0-7 2 1 4 0 5-2-3 0-5-2-7-4z"
        fill="currentColor"
        opacity="0.9"
      />
      {/* monograma MK */}
      <text
        x="50"
        y="62"
        textAnchor="middle"
        fontFamily="Playfair Display, serif"
        fontWeight="700"
        fontSize="30"
        fill="currentColor"
      >
        MK
      </text>
      {/* ramos */}
      <path
        d="M24 50c-8 1-13 5-16 9 5-1 9 0 12 2M76 50c8 1 13 5 16 9-5-1-9 0-12 2"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.65"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Logo({
  stacked = false,
  size = 48,
}: {
  stacked?: boolean;
  size?: number;
}) {
  return (
    <div
      className={
        stacked
          ? "flex flex-col items-center gap-1 text-center"
          : "flex items-center gap-3"
      }
    >
      <Crest size={size} />
      <div className={stacked ? "" : "leading-none"}>
        <div className="font-serif text-xl tracking-brand text-marfim">
          {brand.name.toUpperCase()}
        </div>
        <div className="mt-1 text-[10px] uppercase tracking-wide2 text-dourado/80">
          {brand.tagline}
        </div>
      </div>
    </div>
  );
}

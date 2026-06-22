import Link from "next/link";
import { clsx } from "@/lib/cn";

type Variant = "gold" | "outline" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 text-[12px] font-sans uppercase tracking-brand transition-all duration-300 disabled:opacity-50";

const variants: Record<Variant, string> = {
  gold: "bg-gradient-to-b from-dourado to-bronze text-carvao-deep shadow-glow hover:from-dourado-soft hover:to-latao",
  outline:
    "border border-dourado/45 text-marfim hover:border-dourado hover:bg-dourado/10",
  ghost: "text-marfim/80 hover:text-dourado",
};

type Props = {
  variant?: Variant;
  href?: string;
  className?: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  variant = "gold",
  href,
  className,
  children,
  ...rest
}: Props) {
  const cls = clsx(base, variants[variant], className);
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}

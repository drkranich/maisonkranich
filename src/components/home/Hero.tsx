"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { brand, lexicon } from "@/lib/brand";

export function Hero({ aside }: { aside?: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden">
      {/* Fundo cinematográfico — prateleiras, baús, luz âmbar */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1513519245088-0e12902e35ca?q=80&w=2000&auto=format&fit=crop')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-carvao-deep via-carvao-deep/90 to-carvao-deep/60" />
      <div className="absolute inset-0 bg-candle opacity-50" />

      <div className="relative mx-auto grid max-w-[1400px] items-center gap-10 px-6 py-16 lg:grid-cols-[1fr_480px] lg:gap-12 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <span className="mk-kicker">{brand.tagline}</span>
          <h1 className="mt-5 font-serif text-5xl leading-[1.05] text-marfim md:text-6xl xl:text-7xl">
            Onde <em className="text-dourado not-italic">cada história</em>
            <br /> encontra seu <span className="italic">abrigo.</span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-marfim/70">
            {brand.promise}
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Button href="/loja">Conheça a Loja</Button>
            <Button href="/monte-sua-caixa" variant="outline">
              {lexicon.buildStory}
            </Button>
          </div>
        </motion.div>

        {aside && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
            className="w-full justify-self-center lg:justify-self-end"
          >
            {aside}
          </motion.div>
        )}
      </div>
    </section>
  );
}

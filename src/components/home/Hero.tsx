"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { brand, lexicon } from "@/lib/brand";

export function Hero() {
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
      <div className="absolute inset-0 bg-gradient-to-r from-carvao-deep via-carvao-deep/85 to-carvao-deep/30" />
      <div className="absolute inset-0 bg-candle opacity-60" />

      <div className="relative mx-auto flex min-h-[78vh] max-w-[1400px] flex-col justify-center px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <span className="mk-kicker">{brand.tagline}</span>
          <h1 className="mt-5 font-serif text-5xl leading-[1.05] text-marfim md:text-7xl">
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
      </div>
    </section>
  );
}

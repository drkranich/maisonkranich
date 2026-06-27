"use client";

import { useState } from "react";
import { Box } from "lucide-react";

export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="mk-card flex h-[380px] items-center justify-center bg-gradient-to-br from-nogueira to-carvao-deep">
        <Box className="text-dourado/60" size={72} />
      </div>
    );
  }

  return (
    <div>
      <div className="mk-card h-[380px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={images[active]} alt={alt} className="h-full w-full object-cover" />
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex gap-2">
          {images.map((img, i) => (
            <button
              key={img + i}
              onClick={() => setActive(i)}
              className={`h-16 w-16 overflow-hidden rounded-lg border transition ${i === active ? "border-dourado" : "border-dourado/20 opacity-70 hover:opacity-100"}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

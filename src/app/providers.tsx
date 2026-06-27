"use client";

import { CartProvider } from "@/lib/cart/CartContext";
import { CartRecoveryBanner } from "@/components/cart/CartRecoveryBanner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <CartRecoveryBanner />
    </CartProvider>
  );
}

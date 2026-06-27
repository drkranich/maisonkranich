import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = { title: "Recuperar acesso" };

export default function RecuperarPage() {
  return (
    <Suspense>
      <AuthForm mode="recuperar" />
    </Suspense>
  );
}

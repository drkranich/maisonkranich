import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = { title: "Entrar" };

export default function EntrarPage() {
  return (
    <Suspense>
      <AuthForm mode="entrar" />
    </Suspense>
  );
}

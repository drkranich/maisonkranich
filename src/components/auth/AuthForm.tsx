"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, Mail, Lock, User, Instagram } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Mode = "entrar" | "cadastro" | "recuperar";

const copy: Record<Mode, { title: string; subtitle: string; cta: string }> = {
  entrar: {
    title: "Bem-vindo de volta",
    subtitle: "Acesse seu Baú de memórias.",
    cta: "Entrar",
  },
  cadastro: {
    title: "Crie sua conta",
    subtitle: "Comece a guardar histórias na Maison Kranich.",
    cta: "Criar conta",
  },
  recuperar: {
    title: "Recuperar acesso",
    subtitle: "Enviaremos um link para redefinir sua senha.",
    cta: "Enviar link",
  },
};

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/conta";

  const [fullName, setFullName] = useState("");
  const [instagram, setInstagram] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const t = copy[mode];

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    const supabase = createClient();

    try {
      if (mode === "entrar") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push(next);
        router.refresh();
      } else if (mode === "cadastro") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName, instagram: instagram.replace(/^@/, "") },
            emailRedirectTo:
              typeof window !== "undefined"
                ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`
                : undefined,
          },
        });
        if (error) throw error;
        setMessage(
          "Conta criada. Se a confirmação por e-mail estiver ativa, verifique sua caixa de entrada."
        );
        // tenta logar direto (caso confirmação esteja desativada)
        const { error: signErr } = await supabase.auth.signInWithPassword({ email, password });
        if (!signErr) {
          router.push(next);
          router.refresh();
        }
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo:
            typeof window !== "undefined"
              ? `${window.location.origin}/auth/callback?next=/conta`
              : undefined,
        });
        if (error) throw error;
        setMessage("Enviamos um link de recuperação para o seu e-mail.");
      }
    } catch (err) {
      setError(traduzErro((err as Error).message));
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mk-card w-full max-w-md p-8"
    >
      <h1 className="font-serif text-3xl text-marfim">{t.title}</h1>
      <p className="mt-1 text-sm text-marfim/60">{t.subtitle}</p>

      <form onSubmit={onSubmit} className="mt-7 space-y-4">
        {mode === "cadastro" && (
          <Field icon={User} label="Nome completo">
            <input
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Seu nome"
              className="mk-input"
            />
          </Field>
        )}

        {mode === "cadastro" && (
          <Field icon={Instagram} label="Instagram (opcional)">
            <input
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="@seuperfil"
              className="mk-input"
            />
          </Field>
        )}

        <Field icon={Mail} label="E-mail">
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="voce@email.com"
            className="mk-input"
          />
        </Field>

        {mode !== "recuperar" && (
          <Field icon={Lock} label="Senha">
            <input
              required
              type="password"
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mk-input"
            />
          </Field>
        )}

        {error && (
          <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}
        {message && (
          <p className="rounded-md border border-dourado/30 bg-dourado/10 px-3 py-2 text-sm text-dourado-soft">
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-b from-dourado to-bronze py-3 text-[12px] font-sans uppercase tracking-brand text-carvao-deep shadow-glow transition disabled:opacity-50"
        >
          {loading && <Loader2 className="animate-spin" size={16} />}
          {t.cta}
        </button>
      </form>

      <div className="mt-6 space-y-1.5 text-center text-sm text-marfim/55">
        {mode === "entrar" && (
          <>
            <p>
              Não tem conta?{" "}
              <Link href="/cadastro" className="text-dourado hover:underline">
                Criar conta
              </Link>
            </p>
            <p>
              <Link href="/recuperar" className="text-marfim/50 hover:text-dourado">
                Esqueci minha senha
              </Link>
            </p>
          </>
        )}
        {mode === "cadastro" && (
          <p>
            Já tem conta?{" "}
            <Link href="/entrar" className="text-dourado hover:underline">
              Entrar
            </Link>
          </p>
        )}
        {mode === "recuperar" && (
          <p>
            <Link href="/entrar" className="text-dourado hover:underline">
              Voltar ao login
            </Link>
          </p>
        )}
      </div>
    </motion.div>
  );
}

function Field({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] uppercase tracking-brand text-marfim/50">
        {label}
      </span>
      <span className="relative flex items-center">
        <Icon size={16} className="pointer-events-none absolute left-3 text-dourado/60" />
        {children}
      </span>
    </label>
  );
}

function traduzErro(msg: string) {
  const m = msg.toLowerCase();
  if (m.includes("invalid login")) return "E-mail ou senha incorretos.";
  if (m.includes("already registered")) return "Este e-mail já possui conta.";
  if (m.includes("password")) return "Senha inválida (mínimo 6 caracteres).";
  if (m.includes("email")) return "E-mail inválido.";
  return "Algo deu errado. Tente novamente.";
}

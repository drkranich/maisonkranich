import type { Metadata } from "next";
import { Mail, MessageCircle, Clock } from "lucide-react";
import { getSiteSettings } from "@/lib/site";
import { PageShell, PageHero } from "@/components/site/PageShell";

export const metadata: Metadata = { title: "Contato" };
export const dynamic = "force-dynamic";

export default async function ContatoPage() {
  const { contact } = await getSiteSettings();
  const email = contact.email || "contato@maisonkranich.com";
  const whatsapp = contact.whatsapp;

  return (
    <PageShell>
      <PageHero
        kicker="Estamos por perto"
        title="Fale com a Maison"
        subtitle="Adoraríamos ajudar a criar o presente perfeito. Conte com a gente."
      />
      <div className="mx-auto grid max-w-[900px] gap-6 px-6 py-14 sm:grid-cols-3">
        <a href={`mailto:${email}`} className="mk-card flex flex-col items-center gap-3 p-7 text-center transition-transform hover:-translate-y-1">
          <Mail className="text-dourado" size={26} />
          <div className="font-serif text-lg text-marfim">E-mail</div>
          <div className="break-all text-sm text-marfim/55">{email}</div>
        </a>
        <a
          href={whatsapp ? `https://wa.me/${whatsapp.replace(/\D/g, "")}` : "#"}
          className="mk-card flex flex-col items-center gap-3 p-7 text-center transition-transform hover:-translate-y-1"
        >
          <MessageCircle className="text-dourado" size={26} />
          <div className="font-serif text-lg text-marfim">WhatsApp</div>
          <div className="text-sm text-marfim/55">{whatsapp || "Atendimento concierge"}</div>
        </a>
        <div className="mk-card flex flex-col items-center gap-3 p-7 text-center">
          <Clock className="text-dourado" size={26} />
          <div className="font-serif text-lg text-marfim">Horário</div>
          <div className="text-sm text-marfim/55">Seg a Sex · 9h às 18h</div>
        </div>
      </div>
    </PageShell>
  );
}

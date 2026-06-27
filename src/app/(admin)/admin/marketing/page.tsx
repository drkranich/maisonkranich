import { Mail, ShoppingCart, HeartHandshake, Repeat, UserPlus } from "lucide-react";
import { AdminPageHeader, Pill } from "@/components/admin/AdminUI";

export const dynamic = "force-dynamic";

const flows = [
  { icon: ShoppingCart, name: "Recuperação de carrinho", desc: "Lembra o cliente da caixa que ele deixou pela metade." },
  { icon: UserPlus, name: "Boas-vindas", desc: "Sequência de e-mail/WhatsApp para novos cadastros." },
  { icon: HeartHandshake, name: "Pós-compra", desc: "Agradecimento e acompanhamento após a entrega." },
  { icon: Repeat, name: "Renovação de assinatura", desc: "Avisos antes da cobrança e incentivo à continuidade." },
  { icon: Mail, name: "Reativação de clientes", desc: "Reconquista clientes inativos com um mimo." },
];

export default function AdminMarketing() {
  return (
    <>
      <AdminPageHeader title="Marketing & Automações" subtitle="Fluxos de e-mail e WhatsApp" />
      <div className="grid gap-4 md:grid-cols-2">
        {flows.map((f) => (
          <div key={f.name} className="mk-card flex items-start justify-between gap-4 p-5">
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-dourado/20 bg-dourado/5 text-dourado">
                <f.icon size={18} />
              </div>
              <div>
                <div className="font-serif text-lg text-marfim">{f.name}</div>
                <p className="text-sm text-marfim/55">{f.desc}</p>
              </div>
            </div>
            <Pill tone="neutral">Inativo</Pill>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-marfim/40">
        O construtor de fluxos é ativado junto com a integração de e-mail (Resend/SendGrid) e WhatsApp.
      </p>
    </>
  );
}

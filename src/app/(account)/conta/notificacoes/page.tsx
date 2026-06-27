"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { dateBR } from "@/lib/format";

type Notif = {
  id: string;
  title: string;
  body: string | null;
  link: string | null;
  read: boolean;
  created_at: string;
};

export default function NotificacoesPage() {
  const supabase = createClient();
  const [items, setItems] = useState<Notif[]>([]);
  const [uid, setUid] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load(id: string) {
    const { data } = await supabase
      .from("notifications")
      .select("id, title, body, link, read, created_at")
      .eq("user_id", id)
      .order("created_at", { ascending: false })
      .limit(100);
    setItems((data ?? []) as Notif[]);
    setLoading(false);
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const id = data.user?.id ?? null;
      setUid(id);
      if (id) load(id);
      else setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function markAll() {
    if (!uid) return;
    await supabase.from("notifications").update({ read: true }).eq("user_id", uid).eq("read", false);
    setItems((l) => l.map((n) => ({ ...n, read: true })));
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl text-marfim">Notificações</h2>
          <p className="mt-1 text-sm text-marfim/55">Tudo o que acontece com seus pedidos e histórias.</p>
        </div>
        {items.some((n) => !n.read) && (
          <button onClick={markAll} className="flex items-center gap-2 rounded-md border border-dourado/30 px-4 py-2 text-[11px] uppercase tracking-brand text-dourado hover:bg-dourado/10">
            <Check size={14} /> Marcar todas como lidas
          </button>
        )}
      </div>

      {loading ? (
        <p className="py-12 text-center text-marfim/40">Carregando…</p>
      ) : items.length === 0 ? (
        <div className="mk-card flex flex-col items-center gap-3 px-6 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-dourado/25 bg-dourado/5 text-dourado">
            <Bell size={24} />
          </div>
          <p className="font-serif text-lg text-marfim">Nenhuma notificação</p>
          <p className="text-sm text-marfim/55">Quando algo acontecer, você vê aqui primeiro.</p>
        </div>
      ) : (
        <div className="mk-card divide-y divide-dourado/8">
          {items.map((n) => {
            const inner = (
              <div className={`flex items-start gap-3 px-5 py-4 ${!n.read ? "bg-dourado/[0.04]" : ""}`}>
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.read ? "bg-marfim/15" : "bg-dourado"}`} />
                <div>
                  <div className="text-sm text-marfim">{n.title}</div>
                  {n.body && <div className="text-sm text-marfim/55">{n.body}</div>}
                  <div className="mt-0.5 text-[11px] text-marfim/35">{dateBR(n.created_at)}</div>
                </div>
              </div>
            );
            return n.link ? <Link key={n.id} href={n.link}>{inner}</Link> : <div key={n.id}>{inner}</div>;
          })}
        </div>
      )}
    </>
  );
}

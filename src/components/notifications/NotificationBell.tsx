"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { dateBR } from "@/lib/format";

type Notif = {
  id: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  read: boolean;
  created_at: string;
};

export function NotificationBell({ allHref = "/conta/notificacoes" }: { allHref?: string }) {
  const [uid, setUid] = useState<string | null>(null);
  const [items, setItems] = useState<Notif[]>([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const supabase = createClient();

  async function loadCount(id: string) {
    const { count } = await supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", id)
      .eq("read", false);
    setUnread(count ?? 0);
  }

  async function loadList(id: string) {
    const { data } = await supabase
      .from("notifications")
      .select("id, type, title, body, link, read, created_at")
      .eq("user_id", id)
      .order("created_at", { ascending: false })
      .limit(12);
    setItems((data ?? []) as Notif[]);
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const id = data.user?.id ?? null;
      setUid(id);
      if (id) loadCount(id);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  async function toggle() {
    const next = !open;
    setOpen(next);
    if (next && uid) await loadList(uid);
  }

  async function markAll() {
    if (!uid) return;
    await supabase.from("notifications").update({ read: true }).eq("user_id", uid).eq("read", false);
    setItems((l) => l.map((n) => ({ ...n, read: true })));
    setUnread(0);
  }

  return (
    <div ref={ref} className="relative">
      <button onClick={toggle} className="relative text-marfim/60 hover:text-dourado" aria-label="Notificações">
        <Bell size={18} />
        {unread > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-dourado text-[9px] font-semibold text-carvao-deep">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-3 w-80 overflow-hidden rounded-xl border border-dourado/15 bg-panel shadow-atelier">
          <div className="flex items-center justify-between border-b border-dourado/12 px-4 py-3">
            <span className="mk-kicker">Notificações</span>
            {unread > 0 && (
              <button onClick={markAll} className="flex items-center gap-1 text-[10px] uppercase tracking-brand text-dourado/80 hover:text-dourado">
                <Check size={12} /> Marcar lidas
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {items.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-marfim/45">Nenhuma notificação ainda.</p>
            ) : (
              items.map((n) => {
                const inner = (
                  <div className={`border-b border-dourado/8 px-4 py-3 transition-colors hover:bg-marfim/[0.03] ${!n.read ? "bg-dourado/[0.04]" : ""}`}>
                    <div className="flex items-start gap-2">
                      {!n.read && <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-dourado" />}
                      <div className={n.read ? "pl-3.5" : ""}>
                        <div className="text-sm text-marfim">{n.title}</div>
                        {n.body && <div className="text-xs text-marfim/55">{n.body}</div>}
                        <div className="mt-0.5 text-[10px] text-marfim/35">{dateBR(n.created_at)}</div>
                      </div>
                    </div>
                  </div>
                );
                return n.link ? (
                  <Link key={n.id} href={n.link} onClick={() => setOpen(false)}>{inner}</Link>
                ) : (
                  <div key={n.id}>{inner}</div>
                );
              })
            )}
          </div>

          <Link href={allHref} onClick={() => setOpen(false)} className="block border-t border-dourado/12 px-4 py-2.5 text-center text-[11px] uppercase tracking-brand text-dourado/80 hover:text-dourado">
            Ver todas
          </Link>
        </div>
      )}
    </div>
  );
}

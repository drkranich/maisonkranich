"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, UserPlus, Check } from "lucide-react";
import { setUserRole, setRoleByEmail } from "@/lib/admin/settings";

type Member = { id: string; full_name: string | null; email: string | null; role: string };

const ROLES = [
  { value: "owner", label: "Superadmin" },
  { value: "admin", label: "Administrador" },
  { value: "curator", label: "Curador(a)" },
  { value: "support", label: "Atendimento" },
  { value: "customer", label: "Cliente (remover acesso)" },
];

export function PermissionsManager({ initial }: { initial: Member[] }) {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>(initial);
  const [busy, setBusy] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("admin");
  const [adding, setAdding] = useState(false);
  const [msg, setMsg] = useState<{ ok?: string; err?: string } | null>(null);

  async function changeRole(id: string, newRole: string) {
    setBusy(id);
    const res = await setUserRole(id, newRole);
    setBusy(null);
    if (res.error) { setMsg({ err: res.error }); return; }
    if (newRole === "customer") {
      setMembers((m) => m.filter((x) => x.id !== id));
    } else {
      setMembers((m) => m.map((x) => (x.id === id ? { ...x, role: newRole } : x)));
    }
    router.refresh();
  }

  async function invite(e: React.FormEvent) {
    e.preventDefault();
    setAdding(true);
    setMsg(null);
    const res = await setRoleByEmail(email, role);
    setAdding(false);
    if (res.error) { setMsg({ err: res.error }); return; }
    setMsg({ ok: `${email} agora tem acesso como ${role}.` });
    setEmail("");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <form onSubmit={invite} className="mk-card flex flex-wrap items-end gap-3 p-5">
        <label className="flex-1">
          <span className="mb-1.5 block text-[11px] uppercase tracking-brand text-marfim/55">E-mail do membro</span>
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="pessoa@email.com" className="mk-input !pl-3" />
        </label>
        <label>
          <span className="mb-1.5 block text-[11px] uppercase tracking-brand text-marfim/55">Papel</span>
          <select value={role} onChange={(e) => setRole(e.target.value)} className="mk-input !pl-3 appearance-none">
            {ROLES.filter((r) => r.value !== "customer").map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </label>
        <button type="submit" disabled={adding} className="flex items-center gap-2 rounded-md bg-gradient-to-b from-dourado to-bronze px-6 py-2.5 text-[11px] uppercase tracking-brand text-carvao-deep shadow-glow disabled:opacity-50">
          {adding ? <Loader2 size={14} className="animate-spin" /> : <UserPlus size={14} />} Conceder acesso
        </button>
      </form>

      {msg?.err && <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{msg.err}</p>}
      {msg?.ok && <p className="flex items-center gap-2 rounded-md border border-dourado/30 bg-dourado/10 px-3 py-2 text-sm text-dourado-soft"><Check size={14} /> {msg.ok}</p>}

      <div className="mk-card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-dourado/12 text-[10px] uppercase tracking-wide2 text-marfim/45">
              <th className="px-5 py-3">Membro</th>
              <th className="px-5 py-3">E-mail</th>
              <th className="px-5 py-3">Papel</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id} className="border-b border-dourado/8">
                <td className="px-5 py-3 text-marfim">{m.full_name || "—"}</td>
                <td className="px-5 py-3 text-marfim/60">{m.email}</td>
                <td className="px-5 py-3">
                  <span className="flex items-center gap-2">
                    <select
                      value={m.role}
                      disabled={busy === m.id}
                      onChange={(e) => changeRole(m.id, e.target.value)}
                      className="mk-input !w-auto !py-1.5 !pl-3 appearance-none text-xs"
                    >
                      {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                    </select>
                    {busy === m.id && <Loader2 size={14} className="animate-spin text-dourado" />}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import { deleteRecord } from "@/lib/admin/crud";

export function RowActions({
  table,
  id,
  listPath,
  editHref,
}: {
  table: string;
  id: string;
  listPath: string;
  editHref: string;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [confirming, setConfirming] = useState(false);

  function onDelete() {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3000);
      return;
    }
    start(async () => {
      await deleteRecord(table, id, listPath);
      router.refresh();
    });
  }

  return (
    <div className="flex items-center justify-end gap-1.5">
      <Link href={editHref} className="rounded p-1.5 text-marfim/45 hover:bg-marfim/5 hover:text-dourado" title="Editar">
        <Pencil size={15} />
      </Link>
      <button
        onClick={onDelete}
        disabled={pending}
        title={confirming ? "Clique de novo para confirmar" : "Excluir"}
        className={`rounded p-1.5 ${confirming ? "bg-red-500/15 text-red-300" : "text-marfim/45 hover:bg-red-500/10 hover:text-red-300"}`}
      >
        {pending ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
      </button>
    </div>
  );
}

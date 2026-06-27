"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth";

type Result = { ok?: true; error?: string };

/** Cria ou atualiza um registro (somente staff). */
export async function saveRecord(
  table: string,
  values: Record<string, unknown>,
  id: string | null,
  listPath: string
): Promise<Result> {
  await requireStaff();
  const supabase = await createClient();
  const db = supabase.from(table as never);

  if (id) {
    const { error } = await db.update(values as never).eq("id", id);
    if (error) return { error: error.message };
  } else {
    const { error } = await db.insert(values as never);
    if (error) return { error: error.message };
  }

  revalidatePath(listPath);
  return { ok: true };
}

/** Exclui um registro (somente staff). */
export async function deleteRecord(
  table: string,
  id: string,
  listPath: string
): Promise<Result> {
  await requireStaff();
  const supabase = await createClient();
  const { error } = await supabase.from(table as never).delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath(listPath);
  return { ok: true };
}

/** Atualiza o status de um pedido + registra no histórico. */
export async function updateOrderStatus(
  orderId: string,
  status: string,
  listPath: string
): Promise<Result> {
  await requireStaff();
  const supabase = await createClient();
  const { error } = await supabase
    .from("orders")
    .update({ status: status as never })
    .eq("id", orderId);
  if (error) return { error: error.message };
  revalidatePath(listPath);
  return { ok: true };
}

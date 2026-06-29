import { notFound } from "next/navigation";
import { getEntity } from "@/lib/admin/schemas";
import { createClient } from "@/lib/supabase/server";
import { CrudForm } from "@/components/admin/CrudForm";

export async function AdminFormScreen({ entity, id }: { entity: string; id?: string }) {
  const ent = getEntity(entity);
  if (!ent) notFound();

  const supabase = await createClient();

  const dynamicOptions: Record<string, { value: string; label: string }[]> = {};
  if (ent.fields.some((f) => f.optionsFrom === "categories")) {
    const { data } = await supabase
      .from("categories")
      .select("id, name")
      .eq("active", true)
      .order("sort_order");
    dynamicOptions.categories = (data ?? []).map((c) => ({
      value: c.id as string,
      label: c.name as string,
    }));
  }

  let initial: Record<string, unknown> = { ...(ent.defaults ?? {}) };
  if (id) {
    const { data } = await supabase
      .from(ent.table as never)
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (!data) notFound();
    initial = data as Record<string, unknown>;
  }

  return (
    <CrudForm
      fields={ent.fields}
      initial={initial}
      table={ent.table}
      listPath={ent.list}
      id={id ?? null}
      title={ent.singular}
      defaults={ent.defaults}
      dynamicOptions={dynamicOptions}
    />
  );
}

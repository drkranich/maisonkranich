import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";
import { PageTitle } from "@/components/account/AccountUI";
import { AddressManager } from "@/components/account/AddressManager";

export const dynamic = "force-dynamic";

export default async function EnderecosPage() {
  const supabase = await createClient();
  const user = await getUser();
  const { data } = await supabase
    .from("addresses")
    .select("id, label, recipient, line1, line2, district, city, state, zip, country, is_default")
    .eq("user_id", user!.id)
    .order("is_default", { ascending: false });

  return (
    <>
      <PageTitle title="Meus Endereços" subtitle="Para onde enviamos suas memórias." />
      <AddressManager initial={data ?? []} userId={user!.id} />
    </>
  );
}

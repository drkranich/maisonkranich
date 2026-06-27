import { AdminFormScreen } from "@/components/admin/AdminFormScreen";

export const dynamic = "force-dynamic";

export default async function EditarRegraPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminFormScreen entity="regras" id={id} />;
}

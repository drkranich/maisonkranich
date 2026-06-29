import { AdminFormScreen } from "@/components/admin/AdminFormScreen";

export const dynamic = "force-dynamic";

export default async function EditarFornecedorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AdminFormScreen entity="fornecedores" id={id} />;
}

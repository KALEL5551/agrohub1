import BulkOrderForm from "@/components/BulkOrderForm";

export default function BulkOrderPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">Request Bulk Supply</h1>
      <BulkOrderForm />
    </main>
  );
}
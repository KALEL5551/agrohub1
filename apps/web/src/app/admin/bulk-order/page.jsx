import { db } from "@/lib/db";

export default async function AdminBulkOrdersPage() {
  const orders = await db.bulkOrder.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">Bulk Orders</h1>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <p>No bulk orders yet.</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="border rounded p-4">
              <p><strong>Product:</strong> {order.product}</p>
              <p><strong>Quantity:</strong> {order.quantity}</p>
              <p><strong>Grade:</strong> {order.grade}</p>
              <p><strong>Location:</strong> {order.location}</p>
              <p><strong>Deadline:</strong> {new Date(order.deadline).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {order.status}</p>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
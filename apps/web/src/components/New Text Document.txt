"use client";

import { useRouter } from "next/navigation";

export default function BulkOrderButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/bulk-order")}
      className="bg-green-600 text-white px-4 py-2 rounded"
    >
      Request Bulk Supply
    </button>
  );
}
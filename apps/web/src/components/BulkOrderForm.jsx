"use client";

import { useState } from "react";

export default function BulkOrderForm() {
  const [form, setForm] = useState({
    product: "",
    quantity: "",
    grade: "Grade A",
    location: "",
    deadline: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/bulk-orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Request failed");

      alert("Bulk order submitted successfully");
      setForm({
        product: "",
        quantity: "",
        grade: "Grade A",
        location: "",
        deadline: "",
      });
    } catch (error) {
      alert("Could not submit bulk order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <input
        name="product"
        value={form.product}
        onChange={handleChange}
        placeholder="Product e.g. Tomatoes"
        className="w-full border rounded px-3 py-2"
        required
      />

      <input
        name="quantity"
        type="number"
        value={form.quantity}
        onChange={handleChange}
        placeholder="Quantity e.g. 2000"
        className="w-full border rounded px-3 py-2"
        required
      />

      <select
        name="grade"
        value={form.grade}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2"
      >
        <option>Grade A</option>
        <option>Grade B</option>
        <option>Mixed</option>
      </select>

      <input
        name="location"
        value={form.location}
        onChange={handleChange}
        placeholder="Delivery location"
        className="w-full border rounded px-3 py-2"
        required
      />

      <input
        name="deadline"
        type="date"
        value={form.deadline}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Submitting..." : "Submit Request"}
      </button>
    </form>
  );
}
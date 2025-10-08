import { useEffect, useState } from "react";

interface Movement {
  id: number;
  movementType: string; // Purchase, Restock, Sale, Return
  quantityChange: number;
  date: string;
  productName: string;
  supplierName: string;
  note: string;
  customer: string;
  employeeName: string;
}

export default function StockLogPage() {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("All");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchMovements = async () => {
      try {
        const res = await fetch("https://localhost:7186/api/Movement", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data: Movement[] = await res.json();
        setMovements(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovements();
  }, []);

  if (loading) return <p className="p-6">Loading stock log...</p>;

  const filtered = filter === "All" ? movements : movements.filter(m => m.movementType === filter);

  return (
    <div className="flex-1 p-6 space-y-6">
      <h2 className="text-xl font-bold mb-4">Stock Log</h2>

      {/* Filter by type */}
      <div className="mb-4">
        <select
          className="border px-3 py-2 rounded"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Purchase">Purchase</option>
          <option value="Restock">Restock</option>
          <option value="Sale">Sale</option>
          <option value="Return">Return</option>
        </select>
      </div>

      <div className="bg-white p-4 rounded shadow overflow-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Product</th>
              <th className="px-4 py-2 border">Type</th>
              <th className="px-4 py-2 border">Quantity Change</th>
              <th className="px-4 py-2 border">Date</th>
              <th className="px-4 py-2 border">Employee</th>
              <th className="px-4 py-2 border">Supplier</th>
              <th className="px-4 py-2 border">Customer</th>
              <th className="px-4 py-2 border">Note</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(m => (
              <tr key={m.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{m.productName}</td>
                <td className="px-4 py-2 border">{m.movementType}</td>
                <td className="px-4 py-2 border">{m.quantityChange}</td>
                <td className="px-4 py-2 border">{new Date(m.date).toLocaleString()}</td>
                <td className="px-4 py-2 border">{m.employeeName}</td>
                <td className="px-4 py-2 border">{m.supplierName}</td>
                <td className="px-4 py-2 border">{m.customer}</td>
                <td className="px-4 py-2 border">{m.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

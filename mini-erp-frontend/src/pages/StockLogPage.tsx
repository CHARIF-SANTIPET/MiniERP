import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Movement {
  id: number;
  movementType: string;
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
  const [productFilter, setProductFilter] = useState<string>("All");

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
  }, [token]);

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(18);
    doc.text("Stock Movement Report", 14, 20);
    
    // Date range
    doc.setFontSize(11);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28);
    doc.text(`Filter: ${filter}`, 14, 34);
    
    // Table data
    const tableData = filtered.map(m => [
      m.productName,
      m.movementType,
      m.quantityChange.toString(),
      new Date(m.date).toLocaleDateString(),
      m.employeeName || "N/A",
      m.supplierName || "N/A",
      m.customer || "N/A",
      m.note || "N/A"
    ]);
    
    // Generate table
    autoTable(doc, {
      head: [['Product', 'Type', 'Qty Change', 'Date', 'Employee', 'Supplier', 'Customer', 'Note']],
      body: tableData,
      startY: 40,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [59, 130, 246] }, // Blue header
    });
    
    // Save
    doc.save(`stock-movement-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading stock log...</p>
      </div>
    </div>
  );

  const filtered = filter === "All" 
    ? movements 
    : movements.filter(m => m.movementType === filter);

  // Calculate statistics
  const totalIn = filtered
    .filter(m => m.movementType === "Purchase" || m.movementType === "Restock")
    .reduce((sum, m) => sum + m.quantityChange, 0);
  
  const totalOut = filtered
    .filter(m => m.movementType === "Sale" || m.movementType === "Return")
    .reduce((sum, m) => sum + Math.abs(m.quantityChange), 0);

  return (
    <div className="flex-1 p-6 space-y-6">
      

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="text-gray-500 text-sm">Total Records</p>
          <p className="text-3xl font-bold text-gray-800">{filtered.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg shadow-md">
          <p className="text-green-600 text-sm">Total Stock In</p>
          <p className="text-3xl font-bold text-green-700">+{totalIn}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg shadow-md">
          <p className="text-red-600 text-sm">Total Stock Out</p>
          <p className="text-3xl font-bold text-red-700">-{totalOut}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Filter by Type:
        </label>
        <select
          className="border border-gray-300 px-4 py-2 rounded-lg w-full md:w-64 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        >
          <option value="All">All Movements</option>
          <option value="Purchase">📦 Purchase</option>
          <option value="Restock">🔄 Restock</option>
          <option value="Sale">💰 Sale</option>
          <option value="Return">↩️ Return</option>
        </select>
        
      </div>

      {/* Table */} 
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Movement Log</h2>
        <button
          onClick={exportToPDF}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2 transition-colors"
        >
          <span className="text-lg">📄</span>
          Export PDF
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Qty Change
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supplier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Note
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    No movements found
                  </td>
                </tr>
              ) : (
                filtered.map(m => (
                  <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {m.productName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        m.movementType === "Purchase" ? "bg-blue-100 text-blue-800" :
                        m.movementType === "Restock" ? "bg-green-100 text-green-800" :
                        m.movementType === "Sale" ? "bg-purple-100 text-purple-800" :
                        "bg-orange-100 text-orange-800"
                      }`}>
                        {m.movementType}
                      </span>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                      m.quantityChange > 0 ? "text-green-600" : "text-red-600"
                    }`}>
                      {m.quantityChange > 0 ? `+${m.quantityChange}` : m.quantityChange}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(m.date).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {m.employeeName || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {m.supplierName || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {m.customer || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="max-w-xs truncate" title={m.note}>
                        {m.note || "N/A"}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center text-sm text-gray-500">
        Showing {filtered.length} of {movements.length} total movements
      </div>
    </div>
  );
}
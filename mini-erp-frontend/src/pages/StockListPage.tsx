import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

interface Product {
  id: number;
  name: string;
  quantity: number;
  costPrice: number;
  salePrice: number;
  supplierId: number;
  categoryId: number;
  sku: string;
  createAt: Date;
  updateAt: Date;
}

interface Supplier {
  id: number;
  name: string;
}

type ActiveTab = "list" | "stock-in" | "stock-out";
type MovementType = "Purchase" | "Restock" | "Sale" | "Return";

export default function StockListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>("list");
  
  // Form states for stock adjustment
  const [movementType, setMovementType] = useState<MovementType>("Purchase");
  const [selectedProductId, setSelectedProductId] = useState<number | "">("");
  const [quantity, setQuantity] = useState(0);
  const [supplierId, setSupplierId] = useState<number | "">("");
  const [customerName, setCustomerName] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { user } = useUser();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // สถิติ
  const totalProducts = products.length;
  const totalQuantity = products.reduce((acc, p) => acc + p.quantity, 0);
  const totalValue = products.reduce((acc, p) => acc + p.costPrice * p.quantity, 0);
  const isAdminOrInventory = user?.role === 0 || user?.role === 1;
  const canStockIn = user?.role === 0 || user?.role === 1; // Admin, Warehouse
  const canStockOut = user?.role === 0 || user?.role === 1 || user?.role === 2; // Admin, Warehouse, Salesman

  const handleEdit = (id: number) => {
    navigate(`/product/edit/${id}`);
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      await fetch(`https://localhost:7186/api/Product/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(products.filter((p) => p.id !== id));
      alert("Product deleted successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to delete product.");
    }
  };

  const handleAddProduct = () => {
    navigate("/addproduct");
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch("https://localhost:7186/api/Product", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data: Product[] = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchProducts();
      setLoading(false);
    };
    init();
  }, []);

  // Fetch suppliers for stock in
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await fetch("https://localhost:7186/api/Supplier", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data: Supplier[] = await res.json();
        setSuppliers(data);
      } catch (err) {
        console.error(err);
      }
    };
    if (activeTab === "stock-in") {
      fetchSuppliers();
    }
  }, [activeTab, token]);

  const handleStockAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (quantity <= 0) {
      alert("Quantity must be greater than 0");
      return;
    }

    const selectedProduct = products.find((p) => p.id === selectedProductId);
    
    // ตรวจสอบสต็อกสำหรับ Stock Out
    if (activeTab === "stock-out" && selectedProduct && quantity > selectedProduct.quantity) {
      alert(`Insufficient stock! Available: ${selectedProduct.quantity}`);
      return;
    }

    setSubmitting(true);

    try {
      // แปลง MovementType เป็น number
      const movementTypeMap: Record<MovementType, number> = {
        Purchase: 0,
        Sale: 1,
        Restock: 2,
        Return: 3,
      };

      const res = await fetch(`https://localhost:7186/api/Product/${selectedProductId}?quantity=${activeTab === "stock-out" ? -quantity : quantity}&movementType=${movementTypeMap[movementType]}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          movementType: movementTypeMap[movementType],
          quatity_change: activeTab === "stock-out" ? -quantity : quantity,
          productId: selectedProductId,
          supplierId: movementType === "Purchase" ? (supplierId || 0) : 0,
          employeeId: 0, // ต้องดึงจาก JWT token
          note: note || "",
          customer: customerName,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to record movement");
      }

      alert(`${movementType} recorded successfully!`);
      
      // Reset form
      setSelectedProductId("");
      setQuantity(0);
      setSupplierId("");
      setCustomerName("");
      setNote("");
      
      // Refresh products
      await fetchProducts();
      
      // Switch back to list
      setActiveTab("list");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to record movement");
    } finally {
      setSubmitting(false);
    }
  };

  // Get selected product for preview
  const selectedProduct = products.find((p) => p.id === selectedProductId);

  if (loading) return <p className="p-6">Loading products...</p>;

  return (
    <div className="flex-1 p-6 space-y-6">
      {/* บล็อคสถิติ */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow text-center">
          <p className="text-gray-500">Total Products</p>
          <p className="text-2xl font-bold">{totalProducts}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <p className="text-gray-500">Total Quantity</p>
          <p className="text-2xl font-bold">{totalQuantity}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <p className="text-gray-500">Total Value</p>
          <p className="text-2xl font-bold">${totalValue.toFixed(2)}</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded shadow">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("list")}
            className={`flex-1 px-6 py-3 font-semibold transition-colors ${
              activeTab === "list"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            📋 Stock List
          </button>
          {canStockIn && (
            <button
              onClick={() => {
                setActiveTab("stock-in");
                setMovementType("Purchase");
              }}
              className={`flex-1 px-6 py-3 font-semibold transition-colors ${
                activeTab === "stock-in"
                  ? "border-b-2 border-green-500 text-green-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              📥 Stock In
            </button>
          )}
          {canStockOut && (
            <button
              onClick={() => {
                setActiveTab("stock-out");
                setMovementType("Sale");
              }}
              className={`flex-1 px-6 py-3 font-semibold transition-colors ${
                activeTab === "stock-out"
                  ? "border-b-2 border-red-500 text-red-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              📤 Stock Out
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Stock List Tab */}
          {activeTab === "list" && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Stock List</h2>
                {isAdminOrInventory && (
                  <button
                    onClick={handleAddProduct}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow"
                  >
                    + Add Product
                  </button>
                )}
              </div>

              <div className="overflow-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 border">Name</th>
                      <th className="px-4 py-2 border">SKU</th>
                      <th className="px-4 py-2 border">Category</th>
                      <th className="px-4 py-2 border">Quantity</th>
                      <th className="px-4 py-2 border">Cost Price</th>
                      <th className="px-4 py-2 border">Sale Price</th>
                      <th className="px-4 py-2 border">Supplier</th>
                      {isAdminOrInventory && <th className="px-4 py-2 border">Manage</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 border">{product.name}</td>
                        <td className="px-4 py-2 border">{product.sku}</td>
                        <td className="px-4 py-2 border">{product.categoryId}</td>
                        <td className="px-4 py-2 border">{product.quantity}</td>
                        <td className="px-4 py-2 border">${product.costPrice.toFixed(2)}</td>
                        <td className="px-4 py-2 border">${product.salePrice.toFixed(2)}</td>
                        <td className="px-4 py-2 border">{product.supplierId}</td>
                        {isAdminOrInventory && (
                          <td className="px-4 py-2 border text-center">
                            <button
                              onClick={() => handleEdit(product.id)}
                              className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                            >
                              Delete
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Stock In Tab */}
          {activeTab === "stock-in" && (
            <form onSubmit={handleStockAdjustment} className="space-y-4 max-w-2xl">
              <h3 className="text-lg font-bold text-green-600">Stock In</h3>

              {/* Movement Type */}
              <div>
                <label className="block mb-2 font-semibold">Movement Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="Purchase"
                      checked={movementType === "Purchase"}
                      onChange={(e) => setMovementType(e.target.value as MovementType)}
                      className="w-4 h-4"
                    />
                    <span>Purchase</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="Restock"
                      checked={movementType === "Restock"}
                      onChange={(e) => setMovementType(e.target.value as MovementType)}
                      className="w-4 h-4"
                    />
                    <span>Restock</span>
                  </label>
                </div>
              </div>

              {/* Product */}
              <div>
                <label className="block mb-2 font-semibold">Product</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(Number(e.target.value))}
                  required
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="">Select product</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (SKU: {p.sku}) - Stock: {p.quantity}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stock Preview */}
              {selectedProduct && (
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-sm">Current: {selectedProduct.quantity} units</p>
                  <p className="text-sm text-green-600">
                    After: {selectedProduct.quantity + quantity} units
                  </p>
                </div>
              )}

              {/* Quantity */}
              <div>
                <label className="block mb-2 font-semibold">Quantity</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  min="1"
                  required
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              {/* Supplier (for Purchase only) */}
              {movementType === "Purchase" && (
                <div>
                  <label className="block mb-2 font-semibold">Supplier</label>
                  <select
                    value={supplierId}
                    onChange={(e) => setSupplierId(Number(e.target.value))}
                    required
                    className="w-full border px-3 py-2 rounded"
                  >
                    <option value="">Select supplier</option>
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Note */}
              <div>
                <label className="block mb-2 font-semibold">Note (Optional)</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  rows={3}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded shadow disabled:opacity-50"
              >
                {submitting ? "Processing..." : `Record ${movementType}`}
              </button>
            </form>
          )}

          {/* Stock Out Tab */}
          {activeTab === "stock-out" && (
            <form onSubmit={handleStockAdjustment} className="space-y-4 max-w-2xl">
              <h3 className="text-lg font-bold text-red-600">Stock Out</h3>

              {/* Movement Type */}
              <div>
                <label className="block mb-2 font-semibold">Movement Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="Sale"
                      checked={movementType === "Sale"}
                      onChange={(e) => setMovementType(e.target.value as MovementType)}
                      className="w-4 h-4"
                    />
                    <span>Sale</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="Return"
                      checked={movementType === "Return"}
                      onChange={(e) => setMovementType(e.target.value as MovementType)}
                      className="w-4 h-4"
                    />
                    <span>Return</span>
                  </label>
                </div>
              </div>

              {/* Product */}
              <div>
                <label className="block mb-2 font-semibold">Product</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(Number(e.target.value))}
                  required
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="">Select product</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (SKU: {p.sku}) - Available: {p.quantity}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stock Preview */}
              {selectedProduct && (
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-sm">Current: {selectedProduct.quantity} units</p>
                  <p className={`text-sm ${
                    selectedProduct.quantity - quantity >= 0 ? "text-orange-600" : "text-red-600"
                  }`}>
                    After: {selectedProduct.quantity - quantity} units
                    {selectedProduct.quantity - quantity < 0 && " ⚠️ Insufficient!"}
                  </p>
                </div>
              )}

              {/* Quantity */}
              <div>
                <label className="block mb-2 font-semibold">Quantity</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  min="1"
                  max={selectedProduct?.quantity}
                  required
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              {/* Customer Name (for Sale only) */}
              {movementType === "Sale" && (
                <div>
                  <label className="block mb-2 font-semibold">Customer Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                    placeholder="Optional"
                  />
                </div>
              )}

              {/* Note */}
              <div>
                <label className="block mb-2 font-semibold">Note (Optional)</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  rows={3}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded shadow disabled:opacity-50"
              >
                {submitting ? "Processing..." : `Record ${movementType}`}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
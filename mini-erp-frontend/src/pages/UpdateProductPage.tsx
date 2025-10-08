import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

interface Category {
  id: number;
  name: string;
}

interface Supplier {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  costPrice: number;
  salePrice: number;
  categoryId: number;
  supplierId: number;
}

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [supplierId, setSupplierId] = useState<number | "">("");
//   const [quantity, setQuantity] = useState(0);
  const [costPrice, setCostPrice] = useState(0);
  const [salePrice, setSalePrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const { user } = useUser();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://localhost:7186/api/Product/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!res.ok) throw new Error("Failed to fetch product");
        
        const data: Product = await res.json();
        setName(data.name);
        setSku(data.sku);
        // setQuantity(data.quantity);
        setCostPrice(data.costPrice);
        setSalePrice(data.salePrice);
        setCategoryId(data.categoryId);
        setSupplierId(data.supplierId);
      } catch (err) {
        console.error(err);
        alert("Failed to load product data");
        navigate("/stocklist");
      } finally {
        setFetching(false);
      }
    };

    fetchProduct();
  }, [id, token, navigate]);

  // Fetch suppliers
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await fetch("https://localhost:7186/api/Supplier", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data: Supplier[] = await res.json();
        setSuppliers(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSuppliers();
  }, [token]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("https://localhost:7186/api/Category", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data: Category[] = await res.json();
        setCategories(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategories();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`https://localhost:7186/api/Product/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          costPrice,
          salePrice,
          categoryId,
          supplierId,
        }),
      });

      if (!res.ok) throw new Error("Failed to update product");

      alert("Product updated successfully!");
      navigate("/stocklist");
    } catch (err) {
      console.error(err);
      alert("Failed to update product.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center mt-20">
        <p className="text-lg">Loading product data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-6">
      <h2 className="text-2xl font-bold mb-6">Edit Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
            <label className="block mb-1 font-semibold">SKU</label>
            <input
                type="text"
                value={sku}
                disabled
                className="w-full border px-3 py-2 rounded bg-gray-100 cursor-not-allowed text-gray-600"
            />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {/* Category Dropdown */}
          <div>
            <label className="block mb-1 font-semibold">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              required
              className="w-full border px-3 py-2 rounded"
            >
              <option value="" disabled>
                Select category
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-semibold">Supplier</label>
            <select
              value={supplierId}
              onChange={(e) => setSupplierId(Number(e.target.value))}
              required
              className="w-full border px-3 py-2 rounded"
            >
              <option value="" disabled>
                Select supplier
              </option>
              {suppliers.map((sup) => (
                <option key={sup.id} value={sup.id}>
                  {sup.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          
          <div>
            <label className="block mb-1 font-semibold">Cost Price</label>
            <input
              type="number"
              value={costPrice}
              onChange={(e) => setCostPrice(Number(e.target.value))}
              step="0.01"
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Sale Price</label>
            <input
              type="number"
              value={salePrice}
              onChange={(e) => setSalePrice(Number(e.target.value))}
              step="0.01"
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={() => navigate("/stocklist")}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded shadow"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded shadow disabled:opacity-50"
          >
            {loading ? "Saving..." : "Update Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
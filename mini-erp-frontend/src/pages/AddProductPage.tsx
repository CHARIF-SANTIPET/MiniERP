import { useState , useEffect} from "react";
import { useNavigate } from "react-router-dom";
// import { useUser } from "../contexts/UserContext";



interface Category {
  id: number;
  name: string;
}

interface Supplier {
  id: number;
  name: string;
}

export default function AddProductPage() {
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [supplierId, setSupplierId] = useState<number | "">("");
  const [quantity, setQuantity] = useState(0);
  const [costPrice, setCostPrice] = useState(0);
  const [salePrice, setSalePrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

//   const { user } = useUser();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("https://localhost:7186/api/Product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
           product: {
                name,
                costPrice,
                salePrice,  
                categoryId,
                supplierId,
            },
            sku,
            quantity,
        }),
      });

      if (!res.ok) throw new Error("Failed to add product");

      alert("Product added successfully!");
      navigate("/stocklist"); // กลับไปหน้า stock list
    } catch (err) {
      console.error(err);
      alert("Failed to add product.");
    } finally {
      setLoading(false);
    }
  };
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
}, []);

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
  }, []);


  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-6">
      <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
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
            onChange={(e) => setSku(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
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
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block mb-1 font-semibold">Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
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

        <div className="flex justify-end mt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded shadow"
          >
            {loading ? "Saving..." : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
}

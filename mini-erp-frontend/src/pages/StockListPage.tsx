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

export default function StockListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  // สถิติ
  const totalProducts = products.length;
  const totalQuantity = products.reduce((acc, p) => acc + p.quantity, 0);
  const totalValue = products.reduce((acc, p) => acc + p.costPrice * p.quantity, 0);
  const isAdminOrInventory = user?.role === 0 || user?.role === 1;

   const handleEdit = (id: number) => {
    alert(`Edit product ID: ${id}`);
    // TODO: ไปหน้าแก้ไข หรือเปิด modal edit
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
    navigate("/addproduct"); // ไปหน้าเพิ่มสินค้า
  };
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // ดึงข้อมูลสินค้า (ตัวอย่าง API)
        const res = await fetch("https://localhost:7186/api/Product", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const data: Product[] = await res.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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

      {/* ส่วนหัว + ปุ่มเพิ่มสินค้า */}
      <div className="flex justify-between items-center">
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


      {/* บล็อครายการสินค้า */}
      <div className="bg-white p-4 rounded shadow overflow-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              {/* <th className="px-4 py-2 border">ID</th> */}
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">SKU</th>
              <th className="px-4 py-2 border">Category</th>
              <th className="px-4 py-2 border">Quantity</th>
              <th className="px-4 py-2 border">CostPrice</th>
              <th className="px-4 py-2 border">SalePrice</th>
              <th className="px-4 py-2 border">Supplier</th>
              {isAdminOrInventory && <th className="px-4 py-2 border">manage</th>}
              {/* <th className="px-4 py-2 border">Total</th> */}
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                {/* <td className="px-4 py-2 border">{product.id}</td> */}
                <td className="px-4 py-2 border">{product.name}</td>
                <td className="px-4 py-2 border">{product.sku}</td>
                <td className="px-4 py-2 border">{product.categoryId}</td>
                <td className="px-4 py-2 border">{product.quantity}</td>
                <td className="px-4 py-2 border">${product.costPrice.toFixed(2)}</td>
                <td className="px-4 py-2 border">${product.salePrice.toFixed(2)}</td>
                <td className="px-4 py-2 border">{product.supplierId    }</td>
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
                {/* <td className="px-4 py-2 border">${(product.price * product.quantity).toFixed(2)}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

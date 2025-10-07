
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({children} : MainLayoutProps) {
    const navigate = useNavigate();
    const { user, clearUser } = useUser();
     const isAdmin = user?.role === 0;
    const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch("https://localhost:7186/api/User/logout", {
        method: "POST",
        // credentials: "include",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      // // ลบ localStorage เผื่อมี token อยู่
      localStorage.removeItem("token");
      clearUser();

      // ไปหน้า login
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-950 text-white shadow-md flex flex-col">
        <div className="p-6 text-4xl font-bold bg-blue-950">
          Mini ERP
        </div>    
        <nav className="flex-1 p-2 space-y-2 ">
          <Link
            to="/dashboard"
            className="block px-4 py-2 rounded hover:bg-blue-200 hover:text-fuchsia-600  "
          >
            Dashboard
          </Link>
          <Link
            to="/stocklist"
            className="block px-4 py-2 rounded hover:bg-blue-200 hover:text-white  "
          >
            Stock List
          </Link>
          <Link
            to="/stockManage"
            className="block px-4 py-2 rounded hover:bg-blue-200 hover:text-white  "
          >
            Stock Manage
          </Link>
          <Link
            to="/stocklog"
            className="block px-4 py-2 rounded hover:bg-blue-200 hover:text-white"
          >
            Stock Log
          </Link>
          {isAdmin && (
            <Link
              to="/stocklog"
              className="block px-4 py-2 rounded hover:bg-blue-200 hover:text-white"
            >
              Test Admin
            </Link>
          )}
          
        </nav>

        <div className="p-4 mt-auto text-sm text-gray-300 border-gray-700 text-center">
          {user?.role}
          <Link
            to="/profile"
            className="block px-4 py-2 rounded hover:bg-blue-200 hover:text-white  "
          >
            Stock List
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-20  bg-white shadow flex items-center justify-between px-6">
          <div className="text-lg font-semibold">Welcome, User : {user?.username || "ใครวะ"}</div>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={handleLogout}
          >
            Logout
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 p-0 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
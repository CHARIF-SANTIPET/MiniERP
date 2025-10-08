
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

interface MainLayoutProps {
  children: React.ReactNode;
}

 const getPageTitle = () => {
    switch (location.pathname) {
      case "/profile":
        return "Profile";
      case "/stocklist":
        return "Stock";
      case "/stocklog":
        return "Stock Log";
      default:
        return "Dashboard";
    }
  };

export default function MainLayout({children} : MainLayoutProps) {
    const navigate = useNavigate();
    const { user, clearUser } = useUser();
     const isInventory = user?.role === 0 || user?.role === 1;
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
          {/* <Link
            to="/dashboard"
            className="block px-4 py-2 rounded hover:bg-blue-200 hover:text-fuchsia-600  "
          >
            Dashboard
          </Link> */}
          <Link
            to="/stocklist"
            className="block px-4 py-2 rounded hover:bg-blue-200 hover:text-white  "
          >
            Stock
          </Link>
          
          {isInventory && (
            <Link
              to="/stocklog"
              className="block px-4 py-2 rounded hover:bg-blue-200 hover:text-white"
            >
              Stock Log
            </Link>
          )}


          {/* {isAdmin && (
            <Link
              to="/stocklog"
              className="block px-4 py-2 rounded hover:bg-blue-200 hover:text-white"
            >
              Test Admin
            </Link>
          )} */}
          
        </nav>

        <div className="xl p-5 mt-auto text-2xl text-white border-gray-700 text-center">
          {(() => {
            switch (user?.role) {
              case 0:
                return "Admin";
              case 1:
                return "Inventory";
              case 2:
                return "Saleman";
              case 3:
                return "Employee"
              default:
                return "Anonymouse";
            }
          })()}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-20 bg-white shadow flex items-center justify-between px-6">
          {/* Title อยู่ด้านซ้าย */}
          <div className="text-3xl font-bold">{getPageTitle()}</div>

          {/* Username + Logout อยู่ด้านขวา */}
          <div className="flex items-center gap-4">
            <Link
              to="/profile"
              className="block outline outline-blue-500 px-4 py-2 rounded text-lg font-semibold hover:bg-blue-200"
            >
              {user?.username ||"Employee"}
            </Link>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-0 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
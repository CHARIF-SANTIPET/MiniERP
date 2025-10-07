import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({children} : MainLayoutProps) {
    const navigate = useNavigate();
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-950 shadow-md flex flex-col">
        <div className="p-6 text-xl font-bold text-white border-b bg-blue-950">
          Mini ERP
        </div>
        <nav className="flex-1 p-2 space-y-2">
          <Link
            to="/dashboard"
            className="block px-4 py-2 rounded hover:bg-blue-200 hover:text-white"
          >
            Dashboard
          </Link>
          <Link
            to="/profile"
            className="block px-4 py-2 rounded hover:bg-blue-200 hover:text-white"
          >
            Profile
          </Link>
          <Link
            to="/settings"
            className="block px-4 py-2 rounded hover:bg-blue-200 hover:text-white"
          >
            Settings
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-19 bg-white shadow flex items-center justify-between px-6">
          <div className="text-lg font-semibold">Welcome, User</div>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
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
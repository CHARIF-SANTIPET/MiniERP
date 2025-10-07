import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import React from "react";

interface ProtectedRouteProps {
  children: React.ReactElement;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  // const token = localStorage.getItem("token");

  useEffect(() => {
  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    try {
      const res = await fetch("https://localhost:7186/api/User/protected", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsAuthenticated(res.ok);
    } catch {
      setIsAuthenticated(false);
    }
  };
  checkAuth();
}, []);

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     try {
  //       const res = await fetch("https://localhost:7186/api/User/protected", {
  //         method: "GET",
  //         credentials: "include", // ส่ง cookie jwt_token ไปด้วย
  //       });

  //       if (res.ok) {
  //         setIsAuthenticated(true);
  //       } else {
  //         setIsAuthenticated(false);
  //       }
  //     } catch (error) {
  //       setIsAuthenticated(false);
  //     }
  //   };

  //   checkAuth();
  // }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // รอเช็กก่อน
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

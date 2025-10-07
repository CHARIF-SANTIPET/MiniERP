import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import React from "react";

interface ProtectedRouteProps {
  children: React.ReactElement;
}

interface JwtPayload {
  exp?: number; // expiration timestamp (วินาที)
  [key: string]: any;
}
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  // const token = localStorage.getItem("token");

  const parseJwt = (token: string): JwtPayload | null => {
    try {
      const base64Url = token.split('.')[1];
      if (!base64Url) return null;
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  };



  useEffect(() => {
  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    const payload = parseJwt(token);
      if (!payload || !payload.exp) {
        setIsAuthenticated(false); 
        return;
      } 


      const isExpired = payload.exp * 1000 < Date.now();

      if(isExpired) {
          setIsAuthenticated(!isExpired);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        return ;
      }
      
    try {
      const res = await fetch("https://localhost:7186/api/User/protected", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsAuthenticated(res.ok);
      if (!res.ok) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
    } catch {
      setIsAuthenticated(false);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  };
  checkAuth();
}, []);



  if (isAuthenticated === null) {
    return <div>Loading...</div>; // รอเช็กก่อน
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

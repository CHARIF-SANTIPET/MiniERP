`tsx`
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

export default function LoginPage() {
const [userNameInput, setUserNameInput] = useState("");
const [passKeyInput, setPassKeyInput] = useState("");
const [error, setError] = useState("");
const {setUser } = useUser();
  const navigate = useNavigate();

  // useEffect(() => {
  //   const checkToken = async () => {
  //     try {
  //       const res = await fetch("https://localhost:7186/api/User/me", {
  //         credentials: "include",
  //       });
  //       if (res.ok) {
  //         navigate("/profile"); // ถ้า login อยู่แล้ว → redirect
  //       }
  //     } catch (err) {
  //       // ถ้าไม่มี token / cookie → อยู่หน้า login
  //     }
  //   };

  //   checkToken();
  // }, []);
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/profile");
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("https://localhost:7186/api/User/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: userNameInput, password: passKeyInput }),
        // credentials: "include"
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }
      // const data = await res.json();
      localStorage.setItem("token", data.token);
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));

      // redirect to dashboard
      navigate("/stocklist");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-md w-96"
      >
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-700">
          Login
        </h1>

        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded mb-3 text-sm">
            {error}
          </div>
        )}

        <div className="mb-4"> 
          <label className="block text-sm text-gray-600 mb-1">Username</label>
          <input 
            type="text" 
            name="user_name" 
            value={userNameInput} 
            onChange={(e) => setUserNameInput(e.target.value)} 
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" 
            required autoComplete="off" 
          /> 
        </div>

        <div className="mb-6"> 
          <label className="block text-sm text-gray-600 mb-1">Password</label> 
          <input 
            type="password" 
            name="pass_key" 
            value={passKeyInput} 
            onChange={(e) => setPassKeyInput(e.target.value)} 
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" 
            required 
            autoComplete="new-password" 
          /> 
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
} 


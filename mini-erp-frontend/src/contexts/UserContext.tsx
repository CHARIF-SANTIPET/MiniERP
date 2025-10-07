import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

// interface UserProfile { 
//     firstName: string;
//     lastName: string;
//     phoneNumber: string;
//     address: string;
//     salary: number;
//     position: string;
//     department: string;
//     gender: string;
//     birthday: string;
//     description: string;
//     avatarUrl: string;
//     hireDate: string;
//     endDate: string;
// }
interface User { 
    id: number;
    username: string;
    email: string;
    isActive: boolean;
    role: number;
    lastLogin: string;
    // profile: UserProfile;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
}   


export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    // โหลดค่าจาก localStorage เมื่อหน้าเพิ่งโหลดใหม่
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        console.error("Failed to parse user from localStorage");
        localStorage.removeItem("user");
      }
    }
  }, []);

   const saveUser = (data: User | null) => {
    setUser(data);
    if (data) localStorage.setItem("user", JSON.stringify(data));
    else localStorage.removeItem("user");
  };

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <UserContext.Provider value={{ user, setUser: saveUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};

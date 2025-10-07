import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


interface UserProfile {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  salary: number;
  position: string;
  department: string;
  gender: string;
  birthday: string;
  description: string;
  avatarUrl: string;
  hireDate: string;
  endDate: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  isActive: boolean;
  role: number;
  lastLogin: string;
  profile: UserProfile;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();
  
  // const handleLogout = async () => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     await fetch("https://localhost:7186/api/User/logout", {
  //       method: "POST",
  //       // credentials: "include",
  //       headers: {
  //         "Authorization": `Bearer ${token}`,
  //       },
  //     });

  //     // // ลบ localStorage เผื่อมี token อยู่
  //     localStorage.removeItem("token");

  //     // ไปหน้า login
  //     navigate("/login");
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };


  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("https://localhost:7186/api/User/me", {
          method: "GET",
          // credentials: "include", // ส่ง cookie ไปด้วย
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          if (res.status === 401) throw new Error("Unauthorized. Please login.");
          throw new Error("Failed to fetch profile");
        }

        const data: User = await res.json();
        setUser(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchProfile();
  }, []);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!user) return <p>Loading...</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4 text-gray-700">Profile</h1>
        <div className="space-y-2 ">
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Status:</strong> {user.isActive ? "Active" : "Inactive"}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Last Login:</strong> {new Date(user.lastLogin).toLocaleString()}</p>

          <h2 className="text-lg font-semibold mt-4">Profile Details</h2>
          <p><strong>Name:</strong> {user.profile.firstName} {user.profile.lastName}</p>
          <p><strong>Phone:</strong> {user.profile.phoneNumber}</p>
          <p><strong>Address:</strong> {user.profile.address}</p>
          <p><strong>Position:</strong> {user.profile.position}</p>
          <p><strong>Department:</strong> {user.profile.department}</p>
          <p><strong>Salary:</strong> {user.profile.salary}</p>
          <p><strong>Gender:</strong> {user.profile.gender}</p>
          <p><strong>Birthday:</strong> {user.profile.birthday}</p>
          <p><strong>Description:</strong> {user.profile.description}</p>
          <p><strong>Hire Date:</strong> {new Date(user.profile.hireDate).toLocaleDateString()}</p>
          <p><strong>End Date:</strong> {user.profile.endDate !== "0001-01-01T00:00:00" ? new Date(user.profile.endDate).toLocaleDateString() : "N/A"}</p>
        </div>
         {/* <button
          onClick={handleLogout}
          className="mt-6 w-full bg-red-500 hover:bg-red-600 text-black font-semibold py-2 rounded"
        >
          Logout
        </button> */}
      </div>
    </div>
  );
}

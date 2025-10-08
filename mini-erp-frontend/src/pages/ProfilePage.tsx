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

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("https://localhost:7186/api/User/me", {
          method: "GET",
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

  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
        <p className="text-red-600 text-center">{error}</p>
      </div>
    </div>
  );

  if (!user) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );

  const roleMap: Record<number, string> = {
    0: "Admin",
    1: "Warehouse",
    2: "Salesman",
    3: "Employee",
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="px-8 py-10">
            <div className="flex items-center gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-blue-600 text-4xl font-bold shadow-lg">
                {user.profile.firstName.charAt(0).toUpperCase()}
                {user.profile.lastName.charAt(0).toUpperCase()}
              </div>
              
              {/* User Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">
                  {user.profile.firstName} {user.profile.lastName}
                </h1>
                <div className="flex flex-wrap gap-3 text-blue-100">
                  <span className="flex items-center gap-1">
                    <span className="text-lg">💼</span> {user.profile.position}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <span className="text-lg">🏢</span> {user.profile.department}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <span className="text-lg"></span> {roleMap[user.role]}
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="text-right">
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                  user.isActive 
                    ? "bg-green-100 text-green-700" 
                    : "bg-red-100 text-red-700"
                }`}>
                  <span className={`w-2 h-2 rounded-full ${
                    user.isActive ? "bg-green-500" : "bg-red-500"
                  }`}></span>
                  {user.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Account Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Account Information */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">👤</span> Account Information
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Username</p>
                  <p className="text-gray-800 font-medium">{user.username}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="text-gray-800 font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Last Login</p>
                  <p className="text-gray-800 font-medium">
                    {new Date(user.lastLogin).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">📞</span> Contact
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                  <p className="text-gray-800 font-medium">{user.profile.phoneNumber || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Address</p>
                  <p className="text-gray-800 font-medium">{user.profile.address || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Personal & Employment Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">📋</span> Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Gender</p>
                  <p className="text-gray-800 font-medium">{user.profile.gender || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Birthday</p>
                  <p className="text-gray-800 font-medium">
                    {user.profile.birthday 
                      ? new Date(user.profile.birthday).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : "N/A"}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500 mb-1">Description</p>
                  <p className="text-gray-800 font-medium">{user.profile.description || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Employment Information */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">💼</span> Employment Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Position</p>
                  <p className="text-gray-800 font-medium">{user.profile.position}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Department</p>
                  <p className="text-gray-800 font-medium">{user.profile.department}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Salary</p>
                  <p className="text-gray-800 font-medium text-lg">
                    ${user.profile.salary.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Hire Date</p>
                  <p className="text-gray-800 font-medium">
                    {new Date(user.profile.hireDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                {user.profile.endDate && user.profile.endDate !== "0001-01-01T00:00:00" && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">End Date</p>
                    <p className="text-gray-800 font-medium">
                      {new Date(user.profile.endDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/edit-profile')}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition-colors"
              >
                Edit Profile
              </button>
              <button
                onClick={() => navigate('/change-password')}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg shadow-md transition-colors"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
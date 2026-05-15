import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";

const MyProfile = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [dbUser, setDbUser] = useState(null);

  useEffect(() => {
    axiosSecure.get(`/users/${user.email}`).then(res => setDbUser(res.data));
  }, [user]);

  const handleRoleRequest = async (requestType) => {
    try {
      await axiosSecure.post("/requests", {
        userName: user.displayName,
        userEmail: user.email,
        requestType,
      });
      toast.success(`Request to become ${requestType} sent!`);
    } catch {
      toast.error("Request already sent or failed!");
    }
  };

  if (!dbUser) return <div className="text-center py-10">Loading...</div>;

  return (
    <div>
      <Helmet><title>My Profile | LocalChefBazaar</title></Helmet>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h2>

      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-lg">
        <div className="flex flex-col items-center mb-6">
          <img src={user.photoURL || "https://placehold.co/100"}
            alt="profile"
            className="w-24 h-24 rounded-full object-cover border-4 border-orange-400 mb-3" />
          <h3 className="text-xl font-bold text-gray-800">{user.displayName}</h3>
          <span className={`text-xs px-3 py-1 rounded-full mt-1 font-semibold
            ${dbUser.role === "admin" ? "bg-purple-100 text-purple-700" :
              dbUser.role === "chef" ? "bg-green-100 text-green-700" :
              "bg-blue-100 text-blue-700"}`}>
            {dbUser.role}
          </span>
        </div>

        <div className="space-y-3 text-gray-600">
          <p><span className="font-semibold">Email:</span> {dbUser.email}</p>
          <p><span className="font-semibold">Address:</span> {dbUser.address || "Not provided"}</p>
          <p>
            <span className="font-semibold">Status:</span>{" "}
            <span className={dbUser.status === "fraud" ? "text-red-500" : "text-green-500"}>
              {dbUser.status}
            </span>
          </p>
          {dbUser.role === "chef" && (
            <p><span className="font-semibold">Chef ID:</span> {dbUser.chefId}</p>
          )}
        </div>

        {/* Role Request Buttons */}
        <div className="flex gap-3 mt-6">
          {dbUser.role !== "chef" && dbUser.role !== "admin" && (
            <button onClick={() => handleRoleRequest("chef")}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition text-sm font-semibold">
              Be a Chef
            </button>
          )}
          {dbUser.role !== "admin" && (
            <button onClick={() => handleRoleRequest("admin")}
              className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition text-sm font-semibold">
              Be an Admin
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
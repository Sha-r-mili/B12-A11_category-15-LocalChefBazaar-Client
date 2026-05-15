// Admin page - manage all users and fraud status

import { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const [users, setUsers] = useState([]);

  const fetchUsers = () => {
    axiosSecure.get("/users").then(res => setUsers(res.data));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleMakeFraud = async (id) => {
    const result = await Swal.fire({
      title: "Mark as Fraud?",
      text: "This user will be restricted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, Mark!",
    });
    if (result.isConfirmed) {
      await axiosSecure.patch(`/users/fraud/${id}`);
      toast.success("User marked as fraud!");
      fetchUsers();
    }
  };

  return (
    <div>
      <Helmet><title>Manage Users | LocalChefBazaar</title></Helmet>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Users</h2>

      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-2xl shadow overflow-hidden">
          <thead className="bg-orange-500 text-white">
            <tr>
              <th className="py-3 px-4 text-left">#</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Role</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u._id} className={i % 2 === 0 ? "bg-white" : "bg-orange-50"}>
                <td className="py-3 px-4">{i + 1}</td>
                <td className="py-3 px-4">{u.name}</td>
                <td className="py-3 px-4">{u.email}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold
                    ${u.role === "admin" ? "bg-purple-100 text-purple-700" :
                      u.role === "chef" ? "bg-green-100 text-green-700" :
                      "bg-blue-100 text-blue-700"}`}>
                    {u.role}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={u.status === "fraud" ? "text-red-500 font-semibold" : "text-green-500 font-semibold"}>
                    {u.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {u.role !== "admin" && u.status !== "fraud" && (
                    <button onClick={() => handleMakeFraud(u._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition">
                      Make Fraud
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
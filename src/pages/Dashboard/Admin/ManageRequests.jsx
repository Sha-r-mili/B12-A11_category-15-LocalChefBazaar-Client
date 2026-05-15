import { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";

const ManageRequests = () => {
  const axiosSecure = useAxiosSecure();
  const [requests, setRequests] = useState([]);

  const fetchRequests = () => {
    axiosSecure.get("/requests").then(res => setRequests(res.data));
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleApprove = async (id) => {
    await axiosSecure.patch(`/requests/approve/${id}`);
    toast.success("Request approved!");
    fetchRequests();
  };

  const handleReject = async (id) => {
    await axiosSecure.patch(`/requests/reject/${id}`);
    toast.error("Request rejected!");
    fetchRequests();
  };

  return (
    <div>
      <Helmet><title>Manage Requests | LocalChefBazaar</title></Helmet>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Requests</h2>

      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-2xl shadow overflow-hidden">
          <thead className="bg-orange-500 text-white">
            <tr>
              <th className="py-3 px-4 text-left">#</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Request Type</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Time</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req, i) => (
              <tr key={req._id} className={i % 2 === 0 ? "bg-white" : "bg-orange-50"}>
                <td className="py-3 px-4">{i + 1}</td>
                <td className="py-3 px-4">{req.userName}</td>
                <td className="py-3 px-4">{req.userEmail}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold
                    ${req.requestType === "admin" ? "bg-purple-100 text-purple-700" : "bg-green-100 text-green-700"}`}>
                    {req.requestType}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`text-xs font-semibold
                    ${req.requestStatus === "approved" ? "text-green-600" :
                      req.requestStatus === "rejected" ? "text-red-600" :
                      "text-yellow-600"}`}>
                    {req.requestStatus}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-gray-500">
                  {new Date(req.requestTime).toLocaleDateString()}
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(req._id)}
                      disabled={req.requestStatus !== "pending"}
                      className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600 transition disabled:opacity-40 disabled:cursor-not-allowed">
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(req._id)}
                      disabled={req.requestStatus !== "pending"}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition disabled:opacity-40 disabled:cursor-not-allowed">
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageRequests;
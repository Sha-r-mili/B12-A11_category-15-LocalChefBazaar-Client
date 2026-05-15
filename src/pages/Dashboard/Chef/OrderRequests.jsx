import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";

const OrderRequests = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [orders, setOrders] = useState([]);
  const [dbUser, setDbUser] = useState(null);

  useEffect(() => {
    axiosSecure.get(`/users/${user.email}`).then(res => {
      setDbUser(res.data);
      if (res.data?.chefId) {
        axiosSecure.get(`/orders/chef/${res.data.chefId}`)
          .then(r => setOrders(r.data));
      }
    });
  }, [user]);

  const updateStatus = async (id, orderStatus) => {
    await axiosSecure.patch(`/orders/status/${id}`, { orderStatus });
    toast.success(`Order ${orderStatus}!`);
    axiosSecure.get(`/orders/chef/${dbUser.chefId}`)
      .then(r => setOrders(r.data));
  };

  return (
    <div>
      <Helmet><title>Order Requests | LocalChefBazaar</title></Helmet>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Requests</h2>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : (
        <div className="grid gap-4">
          {orders.map(order => (
            <div key={order._id}
              className="bg-white rounded-2xl shadow p-5">
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-1 text-sm text-gray-600">
                  <h3 className="text-lg font-bold text-gray-800">{order.mealName}</h3>
                  <p>Price: ${order.price} | Qty: {order.quantity}</p>
                  <p>User: {order.userEmail}</p>
                  <p>Address: {order.userAddress}</p>
                  <p>Time: {new Date(order.orderTime).toLocaleString()}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <span className={`px-3 py-1 rounded-full text-center text-sm font-semibold
                    ${order.orderStatus === "delivered" ? "bg-green-100 text-green-700" :
                      order.orderStatus === "accepted" ? "bg-blue-100 text-blue-700" :
                      order.orderStatus === "cancelled" ? "bg-red-100 text-red-700" :
                      "bg-yellow-100 text-yellow-700"}`}>
                    {order.orderStatus}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-center text-sm font-semibold
                    ${order.paymentStatus === "paid" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                    Payment: {order.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => updateStatus(order._id, "cancelled")}
                  disabled={order.orderStatus !== "pending"}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition disabled:opacity-40 disabled:cursor-not-allowed">
                  Cancel
                </button>
                <button
                  onClick={() => updateStatus(order._id, "accepted")}
                  disabled={order.orderStatus !== "pending"}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition disabled:opacity-40 disabled:cursor-not-allowed">
                  Accept
                </button>
                <button
                  onClick={() => updateStatus(order._id, "delivered")}
                  disabled={order.orderStatus !== "accepted"}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600 transition disabled:opacity-40 disabled:cursor-not-allowed">
                  Deliver
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderRequests;
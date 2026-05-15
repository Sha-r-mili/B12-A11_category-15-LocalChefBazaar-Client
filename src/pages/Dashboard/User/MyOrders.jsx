import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../../Payment/CheckoutForm";
import { Helmet } from "react-helmet-async";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const MyOrders = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [orders, setOrders] = useState([]);
  const [payingOrder, setPayingOrder] = useState(null);

  useEffect(() => {
    axiosSecure.get(`/orders/user/${user.email}`)
      .then(res => setOrders(res.data));
  }, [user]);

  return (
    <div>
      <Helmet><title>My Orders | LocalChefBazaar</title></Helmet>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h2>

      {orders.length === 0 ? (
        <p className="text-gray-500">You have no orders yet.</p>
      ) : (
        <div className="grid gap-4">
          {orders.map(order => (
            <div key={order._id}
              className="bg-white rounded-2xl shadow p-5 flex flex-col md:flex-row justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-gray-800">{order.mealName}</h3>
                <p className="text-sm text-gray-500">Chef ID: {order.chefId}</p>
                <p className="text-sm text-gray-500">Quantity: {order.quantity}</p>
                <p className="text-sm text-gray-500">Price: ${order.price}</p>
                <p className="text-sm text-gray-500">
                  Order Time: {new Date(order.orderTime).toLocaleString()}
                </p>
              </div>
              <div className="flex flex-col gap-2 text-sm">
                <span className={`px-3 py-1 rounded-full text-center font-semibold
                  ${order.orderStatus === "delivered" ? "bg-green-100 text-green-700" :
                    order.orderStatus === "accepted" ? "bg-blue-100 text-blue-700" :
                    order.orderStatus === "cancelled" ? "bg-red-100 text-red-700" :
                    "bg-yellow-100 text-yellow-700"}`}>
                  {order.orderStatus}
                </span>
                <span className={`px-3 py-1 rounded-full text-center font-semibold
                  ${order.paymentStatus === "paid" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                  {order.paymentStatus}
                </span>

                {/* Pay Button — only when accepted and not paid */}
                {order.orderStatus === "accepted" && order.paymentStatus !== "paid" && (
                  <button onClick={() => setPayingOrder(order)}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition font-semibold">
                    Pay Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stripe Payment Modal */}
      {payingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md relative">
            <button onClick={() => setPayingOrder(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl">✕</button>
            <h3 className="text-xl font-bold mb-4">Pay for {payingOrder.mealName}</h3>
            <p className="mb-4 text-gray-600">
              Total: <strong className="text-orange-500">${(payingOrder.price * payingOrder.quantity).toFixed(2)}</strong>
            </p>
            <Elements stripe={stripePromise}>
              <CheckoutForm
                order={payingOrder}
                onSuccess={() => {
                  setPayingOrder(null);
                  axiosSecure.get(`/orders/user/${user.email}`)
                    .then(res => setOrders(res.data));
                }}
              />
            </Elements>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
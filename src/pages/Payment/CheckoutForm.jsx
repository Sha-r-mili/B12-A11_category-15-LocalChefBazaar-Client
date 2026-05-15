// Stripe checkout form - handles card payment and saves history

import { useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const CheckoutForm = ({ order, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  const totalAmount = (order.price * order.quantity).toFixed(2);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);

    try {
      // 1. Create payment intent
      const { data } = await axiosSecure.post("/create-payment-intent", {
        price: parseFloat(totalAmount),
      });

      // 2. Confirm card payment
      const { paymentIntent, error } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: { email: user.email },
          },
        }
      );

      if (error) {
        toast.error(error.message);
        setProcessing(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        // 3. Save payment history
        await axiosSecure.post("/payments", {
          orderId: order._id,
          userEmail: user.email,
          amount: parseFloat(totalAmount),
          transactionId: paymentIntent.id,
        });

        // 4. Update order payment status
        await axiosSecure.patch(`/orders/payment/${order._id}`);

        toast.success("Payment successful!");
        onSuccess();
        navigate("/payment-success");
      }
    } catch {
      toast.error("Payment failed. Try again.");
    }
    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="border border-gray-300 rounded-lg p-4 mb-4">
        <CardElement options={{
          style: {
            base: { fontSize: "16px", color: "#374151" },
          }
        }} />
      </div>
      <button type="submit" disabled={!stripe || processing}
        className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition disabled:opacity-50">
        {processing ? "Processing..." : `Pay $${totalAmount}`}
      </button>
    </form>
  );
};

export default CheckoutForm;
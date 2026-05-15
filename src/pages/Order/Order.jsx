// Private order page - quantity selection and SweetAlert confirmation

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../../contexts/AuthContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import axios from "axios";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { FiMapPin, FiMinus, FiPlus } from "react-icons/fi";

const Order = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [meal, setMeal] = useState(null);
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({ defaultValues: { quantity: 1 } });
  const quantity = parseInt(watch("quantity", 1)) || 1;

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/meals/${id}`)
      .then(res => setMeal(res.data));
  }, [id]);

  const onSubmit = async (data) => {
    const totalPrice = (meal.price * data.quantity).toFixed(2);

    const result = await Swal.fire({
      title: "Confirm Your Order",
      html: `<p style="color:#9ca3af;font-size:14px">Your total is <strong style="color:#f59e0b;font-size:18px">$${totalPrice}</strong><br/>Do you want to place this order?</p>`,
      background: "#111827",
      color: "#f3f4f6",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#f59e0b",
      cancelButtonColor: "#374151",
      confirmButtonText: "Yes, Order!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.post("/orders", {
          foodId: meal._id,
          mealName: meal.foodName,
          price: meal.price,
          quantity: parseInt(data.quantity),
          chefId: meal.chefId,
          chefName: meal.chefName,
          userEmail: user.email,
          userAddress: data.userAddress,
          paymentStatus: "Pending",
        });
        await Swal.fire({
          title: "Order Placed!",
          text: "Your order has been placed successfully!",
          icon: "success",
          background: "#111827",
          color: "#f3f4f6",
          confirmButtonColor: "#f59e0b",
        });
        navigate("/dashboard/my-orders");
      } catch {
        Swal.fire({
          title: "Error!",
          text: "Failed to place order. Please try again.",
          icon: "error",
          background: "#111827",
          color: "#f3f4f6",
          confirmButtonColor: "#f59e0b",
        });
      }
    }
  };

  if (!meal) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-gray-800 border-t-amber-400 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 pt-24 pb-16">
      <Helmet><title>Order {meal.foodName} | LocalChefBazaar</title></Helmet>

      <div className="max-w-2xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}>

          {/* Header */}
          <div className="mb-8">
            <span className="text-amber-400 text-xs uppercase tracking-widest font-semibold">Checkout</span>
            <h1 className="text-3xl font-bold text-white mt-2"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              Confirm Order
            </h1>
          </div>

          {/* Meal preview */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden mb-6">
            <div className="relative h-40 overflow-hidden">
              <img
                src={meal.foodImage}
                alt={meal.foodName}
                className="w-full h-full object-cover"
                onError={(e) => e.target.src = "https://placehold.co/600x200/1f2937/f59e0b?text=🍽️"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
              <div className="absolute bottom-4 left-4">
                <h3 className="text-white font-bold text-xl">{meal.foodName}</h3>
                <p className="text-gray-400 text-sm">Chef: {meal.chefName}</p>
              </div>
              <div className="absolute bottom-4 right-4">
                <span className="text-amber-400 font-bold text-2xl">${meal.price}</span>
                <span className="text-gray-500 text-xs ml-1">/ item</span>
              </div>
            </div>
          </div>

          {/* Order Form */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 lg:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

              {/* Auto-filled fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-500 text-xs uppercase tracking-widest font-semibold mb-2 block">Meal</label>
                  <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-gray-400 text-sm truncate">
                    {meal.foodName}
                  </div>
                </div>
                <div>
                  <label className="text-gray-500 text-xs uppercase tracking-widest font-semibold mb-2 block">Chef ID</label>
                  <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-gray-400 text-sm font-mono truncate">
                    {meal.chefId}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-gray-500 text-xs uppercase tracking-widest font-semibold mb-2 block">Your Email</label>
                <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-gray-400 text-sm">
                  {user.email}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="text-gray-400 text-xs uppercase tracking-widest font-semibold mb-2 block">Quantity</label>
                <div className="flex items-center gap-4">
                  <button type="button"
                    onClick={() => setValue("quantity", Math.max(1, quantity - 1))}
                    className="w-10 h-10 bg-gray-800 border border-gray-700 rounded-xl flex items-center justify-center text-gray-400 hover:text-amber-400 hover:border-amber-500/50 transition-all">
                    <FiMinus size={16} />
                  </button>
                  <input
                    type="number"
                    min="1"
                    {...register("quantity", { required: true, min: 1 })}
                    className="w-20 bg-gray-800 border border-gray-700 text-gray-200 rounded-xl px-4 py-2.5 text-center text-sm font-semibold focus:outline-none focus:border-amber-500 transition-all"
                  />
                  <button type="button"
                    onClick={() => setValue("quantity", quantity + 1)}
                    className="w-10 h-10 bg-gray-800 border border-gray-700 rounded-xl flex items-center justify-center text-gray-400 hover:text-amber-400 hover:border-amber-500/50 transition-all">
                    <FiPlus size={16} />
                  </button>
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <label className="text-gray-400 text-xs uppercase tracking-widest font-semibold mb-2 block">
                  Delivery Address
                </label>
                <div className="relative">
                  <FiMapPin className="absolute left-4 top-3.5 text-gray-500" size={15} />
                  <input
                    type="text"
                    {...register("userAddress", { required: "Delivery address is required" })}
                    placeholder="Enter your full delivery address..."
                    className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all placeholder-gray-600"
                  />
                </div>
                {errors.userAddress && (
                  <p className="text-red-400 text-xs mt-1">{errors.userAddress.message}</p>
                )}
              </div>

              {/* Total */}
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5">
                <div className="flex justify-between items-center text-sm text-gray-400 mb-2">
                  <span>Price per item</span>
                  <span>${meal.price}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-400 mb-3">
                  <span>Quantity</span>
                  <span>× {quantity}</span>
                </div>
                <div className="border-t border-amber-500/10 pt-3 flex justify-between items-center">
                  <span className="text-white font-semibold">Total Amount</span>
                  <span className="text-amber-400 font-bold text-2xl">
                    ${(meal.price * quantity).toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-4 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-200 hover:scale-[1.02]">
                Place Order — ${(meal.price * quantity).toFixed(2)}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Order;
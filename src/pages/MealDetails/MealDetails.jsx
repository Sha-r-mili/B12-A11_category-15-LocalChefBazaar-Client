// Private meal details - shows full info, reviews, and favorite button

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useForm } from "react-hook-form";
import { FaStar } from "react-icons/fa";
import { FiMapPin, FiClock, FiAward, FiHeart, FiShoppingCart } from "react-icons/fi";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

const MealDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [meal, setMeal] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/meals/${id}`)
      .then(res => setMeal(res.data));
    fetchReviews();
  }, [id]);

  const fetchReviews = () => {
    axios.get(`${import.meta.env.VITE_API_URL}/reviews/${id}`)
      .then(res => setReviews(res.data));
  };

  const handleAddToFavorite = async () => {
    try {
      const res = await axiosSecure.post("/favorites", {
        userEmail: user.email,
        mealId: meal._id,
        mealName: meal.foodName,
        chefId: meal.chefId,
        chefName: meal.chefName,
        price: meal.price,
      });
      if (res.data.message === "Already in favorites") {
        toast.error("Already in your favorites!");
      } else {
        toast.success("Added to favorites! ❤️");
      }
    } catch {
      toast.error("Failed to add to favorites!");
    }
  };

  const onReviewSubmit = async (data) => {
    setSubmitting(true);
    try {
      await axiosSecure.post("/reviews", {
        foodId: id,
        reviewerName: user.displayName,
        reviewerEmail: user.email,
        reviewerImage: user.photoURL,
        rating: parseInt(data.rating),
        comment: data.comment,
      });
      toast.success("Review submitted successfully!");
      reset();
      fetchReviews();
    } catch {
      toast.error("Failed to submit review!");
    } finally {
      setSubmitting(false);
    }
  };

  if (!meal) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-gray-800 border-t-amber-400 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 pt-24 pb-16">
      <Helmet><title>{meal.foodName} | LocalChefBazaar</title></Helmet>

      <div className="max-w-5xl mx-auto px-6">

        {/* ── MEAL CARD ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden mb-8 shadow-2xl">

          <div className="relative">
            <img
              src={meal.foodImage}
              alt={meal.foodName}
              className="w-full h-72 lg:h-96 object-cover"
              onError={(e) => e.target.src = "https://placehold.co/800x400/1f2937/f59e0b?text=🍽️"}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/30 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2"
                  style={{ fontFamily: "'Playfair Display', serif" }}>
                  {meal.foodName}
                </h1>
                <p className="text-gray-400 text-sm">by <span className="text-amber-400 font-semibold">{meal.chefName}</span></p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-amber-400">${meal.price}</div>
                <div className="flex items-center gap-1 justify-end mt-1">
                  <FaStar className="text-amber-400 text-sm" />
                  <span className="text-white text-sm font-semibold">{meal.rating}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 lg:p-8 grid md:grid-cols-2 gap-8">
            {/* Left: Info */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                {[
                  { icon: FiMapPin, label: meal.deliveryArea },
                  { icon: FiClock, label: meal.estimatedDeliveryTime },
                  { icon: FiAward, label: meal.chefExperience },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 bg-gray-800 rounded-xl px-3 py-2">
                    <Icon className="text-amber-400 shrink-0" size={14} />
                    <span className="text-gray-300 text-xs">{label}</span>
                  </div>
                ))}
              </div>

              <div>
                <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold mb-2">Chef ID</p>
                <p className="text-gray-300 text-sm font-mono bg-gray-800 rounded-lg px-3 py-2 inline-block">{meal.chefId}</p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => navigate(`/order/${meal._id}`)}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-200 hover:scale-[1.02]">
                  <FiShoppingCart size={16} />
                  Order Now
                </button>
                <button
                  onClick={handleAddToFavorite}
                  className="flex items-center justify-center gap-2 border border-gray-700 text-gray-400 px-5 py-3 rounded-xl font-semibold text-sm hover:border-red-500/50 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200">
                  <FiHeart size={16} />
                  Save
                </button>
              </div>
            </div>

            {/* Right: Ingredients */}
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold mb-4">Ingredients</p>
              <div className="flex flex-wrap gap-2">
                {meal.ingredients?.map((ing, i) => (
                  <span key={i}
                    className="bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs px-3 py-1.5 rounded-full font-medium">
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── REVIEWS ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="bg-gray-900 border border-gray-800 rounded-3xl p-6 lg:p-8 mb-8">

          <h2 className="text-xl font-bold text-white mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            Customer Reviews
            <span className="text-gray-600 text-base font-normal ml-2">({reviews.length})</span>
          </h2>

          {reviews.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-4xl mb-3">⭐</div>
              <p className="text-gray-500 text-sm">No reviews yet. Be the first to review!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r._id} className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={r.reviewerImage}
                      alt={r.reviewerName}
                      className="w-10 h-10 rounded-full object-cover border-2 border-gray-700"
                      onError={(e) => e.target.src = `https://ui-avatars.com/api/?name=${r.reviewerName}&background=374151&color=fbbf24`}
                    />
                    <div className="flex-1">
                      <p className="text-white text-sm font-semibold">{r.reviewerName}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex text-amber-400 text-xs gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={i < r.rating ? "text-amber-400" : "text-gray-700"} />
                          ))}
                        </div>
                        <span className="text-gray-600 text-xs">·</span>
                        <span className="text-gray-500 text-xs">{new Date(r.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* ── REVIEW FORM ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="bg-gray-900 border border-gray-800 rounded-3xl p-6 lg:p-8">

          <h2 className="text-xl font-bold text-white mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            Write a Review
          </h2>

          <form onSubmit={handleSubmit(onReviewSubmit)} className="flex flex-col gap-5">
            {/* Rating */}
            <div>
              <label className="text-gray-400 text-xs font-medium uppercase tracking-widest mb-2 block">
                Your Rating
              </label>
              <select
                {...register("rating", { required: true })}
                className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all cursor-pointer appearance-none"
                style={{ colorScheme: "dark" }}>
                <option value="" className="bg-gray-800 text-gray-400">Select a rating...</option>
                <option value="5" className="bg-gray-800 text-gray-200">⭐⭐⭐⭐⭐ — 5 Stars (Excellent)</option>
                <option value="4" className="bg-gray-800 text-gray-200">⭐⭐⭐⭐ — 4 Stars (Good)</option>
                <option value="3" className="bg-gray-800 text-gray-200">⭐⭐⭐ — 3 Stars (Average)</option>
                <option value="2" className="bg-gray-800 text-gray-200">⭐⭐ — 2 Stars (Poor)</option>
                <option value="1" className="bg-gray-800 text-gray-200">⭐ — 1 Star (Bad)</option>
              </select>
            </div>

            {/* Comment */}
            <div>
              <label className="text-gray-400 text-xs font-medium uppercase tracking-widest mb-2 block">
                Your Comment
              </label>
              <textarea
                {...register("comment", { required: true })}
                rows={4}
                placeholder="How was the food? Describe your experience..."
                className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all resize-none placeholder-gray-600"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3.5 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-200 hover:scale-[1.02] disabled:opacity-60 disabled:scale-100">
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Submitting...
                </span>
              ) : "Submit Review"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default MealDetails;
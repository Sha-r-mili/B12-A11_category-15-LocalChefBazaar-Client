// Meals page - displays all meals with sort and pagination

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { FaStar } from "react-icons/fa";
import { FiFilter, FiMapPin, FiClock } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";
import { motion } from "framer-motion";

const Meals = () => {
  const [meals, setMeals] = useState([]);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const limit = 10;
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios.get(`${import.meta.env.VITE_API_URL}/meals?sort=${sort}&page=${page}&limit=${limit}`)
      .then(res => {
        setMeals(res.data.meals || []);
        setTotal(res.data.total || 0);
      })
      .catch(() => {
        setMeals([]);
        setTotal(0);
      })
      .finally(() => setLoading(false));
  }, [sort, page]);

  const totalPages = Math.ceil(total / limit);

  const handleDetails = (id) => {
    if (!user) return navigate("/login");
    navigate(`/meals/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-950 pt-24 pb-16">
      <Helmet><title>Meals | LocalChefBazaar</title></Helmet>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}>
          <span className="text-amber-400 text-xs uppercase tracking-widest font-semibold">Our Menu</span>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-3">
            <h1 className="text-4xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              All Meals
              <span className="text-gray-600 text-xl font-normal ml-3">({total})</span>
            </h1>
            <div className="flex items-center gap-2 bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5">
              <FiFilter className="text-amber-400" size={15} />
              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
                className="bg-transparent text-gray-300 text-sm focus:outline-none cursor-pointer">
                <option value="" className="bg-gray-900">Sort by Price</option>
                <option value="asc" className="bg-gray-900">Price: Low → High</option>
                <option value="desc" className="bg-gray-900">Price: High → Low</option>
              </select>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-900 rounded-2xl overflow-hidden animate-pulse">
                <div className="h-52 bg-gray-800"></div>
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-800 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-800 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-800 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : meals.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🍳</div>
            <h3 className="text-gray-400 text-xl font-semibold mb-2">No meals available yet</h3>
            <p className="text-gray-600 text-sm">Chefs are preparing the menu. Please check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {meals.map((meal, i) => (
              <motion.div
                key={meal._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-amber-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50 group">
                <div className="relative overflow-hidden">
                  <img
                    src={meal.foodImage}
                    alt={meal.foodName}
                    className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => e.target.src = "https://placehold.co/400x300/1f2937/f59e0b?text=🍽️"}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-3 right-3 flex gap-2">
                    <span className="bg-black/70 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                      <FaStar className="text-amber-400 text-xs" />
                      {meal.rating || "New"}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-amber-400 font-bold text-2xl">${meal.price}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-white font-bold text-lg mb-1 truncate">{meal.foodName}</h3>
                  <p className="text-gray-500 text-xs mb-1">Chef: <span className="text-gray-400">{meal.chefName}</span> · ID: <span className="text-gray-400">{meal.chefId}</span></p>
                  <div className="flex items-center gap-3 mt-2 mb-4">
                    <span className="flex items-center gap-1 text-gray-500 text-xs">
                      <FiMapPin size={11} className="text-amber-500" />
                      {meal.deliveryArea}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-amber-400 font-bold text-xl">${meal.price}</span>
                    <button
                      onClick={() => handleDetails(meal._id)}
                      className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-5 py-2 rounded-full text-xs font-semibold hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-200 hover:scale-105">
                      See Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-xl border border-gray-700 text-gray-400 hover:border-amber-500 hover:text-amber-400 transition-all disabled:opacity-30 text-sm">
              ← Prev
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button key={i}
                onClick={() => setPage(i + 1)}
                className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${
                  page === i + 1
                    ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25"
                    : "border border-gray-700 text-gray-400 hover:border-amber-500 hover:text-amber-400"
                }`}>
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-xl border border-gray-700 text-gray-400 hover:border-amber-500 hover:text-amber-400 transition-all disabled:opacity-30 text-sm">
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Meals;
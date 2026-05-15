import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { FaStar, FaQuoteLeft } from "react-icons/fa";
import { FiArrowRight, FiShield, FiZap, FiHeart } from "react-icons/fi";

const Home = () => {
  const [meals, setMeals] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/meals/home`)
      .then(res => setMeals(res.data))
      .catch(() => {});
    axios.get(`${import.meta.env.VITE_API_URL}/reviews/home`)
      .then(res => setReviews(res.data))
      .catch(() => {});
  }, []);

  return (
    <div className="bg-gray-950 text-white">
      <Helmet><title>Home | LocalChefBazaar</title></Helmet>

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-orange-600/5 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-16 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}>
            <span className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold px-4 py-2 rounded-full mb-6 uppercase tracking-widest">
              🍽️ Homemade. Delivered. Loved.
            </span>
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Real Food<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                Real Chefs
              </span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-md">
              Discover authentic home-cooked meals from talented local chefs in your neighborhood. Fresh, affordable, and made with love.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/meals"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl hover:shadow-amber-500/30 transition-all duration-300 hover:scale-105">
                Explore Meals <FiArrowRight />
              </Link>
              <Link to="/register"
                className="inline-flex items-center gap-2 border border-gray-700 text-gray-300 px-8 py-4 rounded-full font-semibold hover:border-amber-500/50 hover:text-amber-400 transition-all duration-300">
                Become a Chef
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-12 pt-8 border-t border-gray-800">
              {[
                { num: "500+", label: "Home Chefs" },
                { num: "2k+", label: "Meals Served" },
                { num: "4.9★", label: "Avg Rating" },
              ].map(({ num, label }) => (
                <div key={label}>
                  <div className="text-2xl font-bold text-amber-400">{num}</div>
                  <div className="text-gray-500 text-xs mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Hero visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block relative">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-3xl"></div>
              <img
                src="https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80"
                alt="Delicious homemade food"
                className="w-full h-full object-cover rounded-3xl"
                onError={(e) => e.target.src = "https://placehold.co/600x600/1f2937/f59e0b?text=🍽️"}
              />
              {/* Floating card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="absolute -bottom-6 -left-6 bg-gray-900 border border-gray-700 rounded-2xl p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-xl">🥘</div>
                  <div>
                    <div className="text-white text-sm font-semibold">Fresh Today</div>
                    <div className="text-amber-400 text-xs">12 new meals added</div>
                  </div>
                </div>
              </motion.div>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 bg-gray-900 border border-gray-700 rounded-2xl p-4 shadow-xl">
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-400">{"★★★★★".split("").map((s, i) => <span key={i} className="text-xs">{s}</span>)}</div>
                  <span className="text-white text-xs font-semibold">4.9/5</span>
                </div>
                <div className="text-gray-500 text-xs mt-1">from 2,000+ reviews</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────── */}
      <section className="py-20 border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14">
            <span className="text-amber-400 text-xs uppercase tracking-widest font-semibold">Simple Process</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mt-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              How It Works
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "🔍", step: "01", title: "Browse Meals", desc: "Explore daily menus from talented home chefs near you. Filter by cuisine, price, or delivery area." },
              { icon: "🛒", step: "02", title: "Place Order", desc: "Select your meals, customize your order, and confirm with our simple one-click checkout." },
              { icon: "🚀", step: "03", title: "Fresh Delivery", desc: "Your meal is freshly prepared and delivered hot to your doorstep. Track in real-time." },
            ].map(({ icon, step, title, desc }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-amber-500/30 transition-all duration-300 group">
                <div className="flex justify-between items-start mb-6">
                  <div className="text-4xl">{icon}</div>
                  <span className="text-gray-800 font-bold text-4xl group-hover:text-amber-500/20 transition-colors">{step}</span>
                </div>
                <h3 className="text-white font-bold text-lg mb-3">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TODAY'S MEALS ────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}>
              <span className="text-amber-400 text-xs uppercase tracking-widest font-semibold">Fresh Today</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mt-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                Today's Specials
              </h2>
            </motion.div>
            <Link to="/meals"
              className="hidden md:inline-flex items-center gap-2 text-amber-400 text-sm font-semibold hover:gap-3 transition-all">
              View All <FiArrowRight />
            </Link>
          </div>

          {meals.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🍳</div>
              <p className="text-gray-500">Chefs are preparing today's menu. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {meals.map((meal, i) => (
                <motion.div
                  key={meal._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-amber-500/30 transition-all duration-300 group hover:shadow-xl hover:shadow-black/50 hover:-translate-y-1">
                  <div className="relative overflow-hidden">
                    <img
                      src={meal.foodImage}
                      alt={meal.foodName}
                      className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => e.target.src = "https://placehold.co/400x300/1f2937/f59e0b?text=🍽️"}
                    />
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                      <FaStar className="text-amber-400 text-xs" />
                      <span className="text-white text-xs font-semibold">{meal.rating || "New"}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-white font-bold text-lg mb-1">{meal.foodName}</h3>
                    <p className="text-gray-500 text-xs mb-4">by {meal.chefName} · {meal.deliveryArea}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-amber-400 font-bold text-xl">${meal.price}</span>
                      <Link to={`/meals/${meal._id}`}
                        className="bg-amber-500/10 border border-amber-500/30 text-amber-400 px-4 py-2 rounded-full text-xs font-semibold hover:bg-amber-500 hover:text-white transition-all duration-200">
                        See Details
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── WHY US ──────────────────────────────────────────── */}
      <section className="py-20 bg-gray-900/50 border-y border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14">
            <span className="text-amber-400 text-xs uppercase tracking-widest font-semibold">Why Choose Us</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mt-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              The LocalChefBazaar Difference
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: FiHeart, title: "Made with Love", desc: "Every meal is crafted by passionate home cooks who pour their heart into each dish.", color: "text-rose-400" },
              { icon: FiShield, title: "Quality Assured", desc: "All chefs are verified and reviewed by our community. Your safety is our priority.", color: "text-green-400" },
              { icon: FiZap, title: "Fast & Fresh", desc: "Orders are prepared fresh and delivered quickly. No frozen meals, ever.", color: "text-blue-400" },
            ].map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="text-center p-8">
                <div className={`inline-flex w-14 h-14 bg-gray-800 rounded-2xl items-center justify-center ${color} mb-5`}>
                  <Icon size={24} />
                </div>
                <h3 className="text-white font-bold text-lg mb-3">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVIEWS ─────────────────────────────────────────── */}
      {reviews.length > 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14">
              <span className="text-amber-400 text-xs uppercase tracking-widest font-semibold">Testimonials</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mt-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                What Customers Say
              </h2>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-6">
              {reviews.slice(0, 3).map((review, i) => (
                <motion.div
                  key={review._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-amber-500/20 transition-all duration-300">
                  <FaQuoteLeft className="text-amber-500/30 text-2xl mb-4" />
                  <p className="text-gray-400 text-sm leading-relaxed mb-5">"{review.comment}"</p>
                  <div className="flex items-center gap-3">
                    <img
                      src={review.reviewerImage}
                      alt={review.reviewerName}
                      className="w-10 h-10 rounded-full object-cover border-2 border-gray-700"
                      onError={(e) => e.target.src = `https://ui-avatars.com/api/?name=${review.reviewerName}`}
                    />
                    <div>
                      <p className="text-white text-sm font-semibold">{review.reviewerName}</p>
                      <div className="flex text-amber-400 text-xs gap-0.5 mt-0.5">
                        {[...Array(review.rating)].map((_, i) => <FaStar key={i} />)}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-amber-500/10 to-orange-600/10 border border-amber-500/20 rounded-3xl p-12">
            <div className="text-5xl mb-6">🚀</div>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Ready to Get Started?
            </h2>
            <p className="text-gray-400 mb-8">
              Join thousands of food lovers discovering amazing home-cooked meals in their neighborhood.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register"
                className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl hover:shadow-amber-500/30 transition-all duration-300 hover:scale-105">
                Create Free Account
              </Link>
              <Link to="/meals"
                className="border border-gray-700 text-gray-300 px-8 py-4 rounded-full font-semibold hover:border-amber-500/50 hover:text-amber-400 transition-all duration-300">
                Browse Meals
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
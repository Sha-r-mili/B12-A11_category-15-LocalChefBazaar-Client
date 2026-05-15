import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

const ErrorPage = () => {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-6">
      <Helmet><title>404 – Not Found | LocalChefBazaar</title></Helmet>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center">
        <div className="text-8xl mb-6">🍽️</div>
        <h1 className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600 mb-4"
          style={{ fontFamily: "'Playfair Display', serif" }}>
          404
        </h1>
        <h2 className="text-2xl font-bold text-white mb-3">Page Not Found</h2>
        <p className="text-gray-500 mb-8 max-w-md">
          Looks like this page took a wrong turn. Let's get you back to the kitchen.
        </p>
        <Link to="/"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl hover:shadow-amber-500/30 transition-all duration-300 hover:scale-105">
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
};

export default ErrorPage;
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

const PaymentSuccess = () => {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-6">
      <Helmet><title>Payment Successful | LocalChefBazaar</title></Helmet>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-24 h-24 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center text-5xl mx-auto mb-6">
          ✅
        </motion.div>
        <h1 className="text-4xl font-bold text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
          Payment Successful!
        </h1>
        <p className="text-gray-500 mb-8">Your order has been confirmed. Enjoy your meal!</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/dashboard/my-orders"
            className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-8 py-3.5 rounded-full font-semibold hover:shadow-lg hover:shadow-amber-500/25 transition-all hover:scale-105">
            Track My Order
          </Link>
          <Link to="/meals"
            className="border border-gray-700 text-gray-300 px-8 py-3.5 rounded-full font-semibold hover:border-amber-500/50 hover:text-amber-400 transition-all">
            Order More
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
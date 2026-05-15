// Login page - email and password authentication with JWT

import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { useState } from "react";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      toast.success("Welcome back! 👋");
      navigate(from, { replace: true });
    } catch (err) {
      toast.error("Invalid email or password!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-20">
      <Helmet><title>Login | LocalChefBazaar</title></Helmet>

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-600 rounded-2xl items-center justify-center text-3xl mb-4 shadow-lg shadow-amber-500/25">
            🍽️
          </div>
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
            Welcome Back
          </h1>
          <p className="text-gray-500 mt-2 text-sm">Sign in to your LocalChefBazaar account</p>
        </div>

        {/* Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            {/* Email */}
            <div>
              <label className="text-gray-400 text-xs font-medium uppercase tracking-widest mb-2 block">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all placeholder-gray-600"
                  placeholder="chef@example.com"
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="text-gray-400 text-xs font-medium uppercase tracking-widest mb-2 block">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", { required: "Password is required" })}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl pl-11 pr-12 py-3 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all placeholder-gray-600"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1.5">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3.5 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-200 hover:scale-[1.02] disabled:opacity-60 disabled:scale-100 mt-2">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </span>
              ) : "Sign In"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-800 text-center">
            <p className="text-gray-500 text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-amber-400 font-semibold hover:text-amber-300 transition-colors">
                Create one free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
// Registration - creates Firebase user then saves to MongoDB

import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";
import { FiMail, FiLock, FiUser, FiImage, FiMapPin, FiEye, FiEyeOff } from "react-icons/fi";
import { useState } from "react";

const Register = () => {
  const { register: registerUser, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch("password");

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      return toast.error("Passwords do not match!");
    }
    setLoading(true);
    try {
      await registerUser(data.email, data.password);
      await updateUserProfile(data.name, data.photoURL);
      await axios.post(`${import.meta.env.VITE_API_URL}/users`, {
        name: data.name,
        email: data.email,
        photoURL: data.photoURL,
        address: data.address,
      });
      toast.success("Account created! Welcome 🎉");
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: "Full Name", name: "name", type: "text", placeholder: "John Doe", icon: FiUser, rules: { required: "Name is required" } },
    { label: "Email Address", name: "email", type: "email", placeholder: "john@example.com", icon: FiMail, rules: { required: "Email is required" } },
    { label: "Profile Image URL", name: "photoURL", type: "text", placeholder: "https://your-photo-url.com/photo.jpg", icon: FiImage, rules: { required: "Photo URL is required" } },
    { label: "Delivery Address", name: "address", type: "text", placeholder: "House 12, Road 7, Dhaka", icon: FiMapPin, rules: { required: "Address is required" } },
  ];

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-20">
      <Helmet><title>Register | LocalChefBazaar</title></Helmet>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-600 rounded-2xl items-center justify-center text-3xl mb-4 shadow-lg shadow-amber-500/25">
            👨‍🍳
          </div>
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
            Join the Community
          </h1>
          <p className="text-gray-500 mt-2 text-sm">Create your LocalChefBazaar account</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {fields.map(({ label, name, type, placeholder, icon: Icon, rules }) => (
              <div key={name}>
                <label className="text-gray-400 text-xs font-medium uppercase tracking-widest mb-2 block">{label}</label>
                <div className="relative">
                  <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={15} />
                  <input
                    type={type}
                    {...register(name, rules)}
                    placeholder={placeholder}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all placeholder-gray-600"
                  />
                </div>
                {errors[name] && <p className="text-red-400 text-xs mt-1">{errors[name].message}</p>}
              </div>
            ))}

            {/* Password */}
            <div>
              <label className="text-gray-400 text-xs font-medium uppercase tracking-widest mb-2 block">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={15} />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", { required: "Password is required", minLength: { value: 6, message: "Minimum 6 characters" } })}
                  placeholder="••••••••"
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl pl-11 pr-12 py-3 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all placeholder-gray-600"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-gray-400 text-xs font-medium uppercase tracking-widest mb-2 block">Confirm Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={15} />
                <input
                  type="password"
                  {...register("confirmPassword", {
                    required: "Please confirm password",
                    validate: val => val === password || "Passwords do not match"
                  })}
                  placeholder="••••••••"
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all placeholder-gray-600"
                />
              </div>
              {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3.5 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-200 hover:scale-[1.02] disabled:opacity-60 disabled:scale-100 mt-2">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating account...
                </span>
              ) : "Create Account"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-800 text-center">
            <p className="text-gray-500 text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-amber-400 font-semibold hover:text-amber-300 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
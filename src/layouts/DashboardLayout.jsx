// Dashboard layout with responsive collapsible sidebar

import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { FiHome, FiShoppingBag, FiStar, FiHeart, FiPlus, FiList, FiInbox, FiUsers, FiSliders, FiBarChart2, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import toast from "react-hot-toast";

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [role, setRole] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.email) {
      axiosSecure.get(`/users/${user.email}`).then(res => setRole(res.data?.role));
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out!");
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-amber-500/15 text-amber-400 border border-amber-500/20"
        : "text-gray-500 hover:text-gray-300 hover:bg-gray-800/50"
    }`;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <NavLink to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-600 rounded-lg flex items-center justify-center text-sm">🍽️</div>
          <span className="text-white font-bold text-sm" style={{ fontFamily: "'Playfair Display', serif" }}>
            LocalChef<span className="text-amber-400">Bazaar</span>
          </span>
        </NavLink>
      </div>

      {/* User info */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center gap-3 bg-gray-800/50 rounded-xl p-3">
          <img
            src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName}`}
            alt="avatar"
            className="w-9 h-9 rounded-lg object-cover border border-gray-700"
          />
          <div className="overflow-hidden">
            <p className="text-white text-xs font-semibold truncate">{user?.displayName}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              role === "admin" ? "bg-purple-500/20 text-purple-400" :
              role === "chef" ? "bg-green-500/20 text-green-400" :
              "bg-blue-500/20 text-blue-400"
            }`}>{role || "user"}</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="text-gray-700 text-xs uppercase tracking-widest font-semibold px-4 mb-2">General</p>
        <NavLink to="/dashboard/profile" className={linkClass} onClick={() => setSidebarOpen(false)}>
          <FiHome size={16} /> My Profile
        </NavLink>
        <NavLink to="/dashboard/my-orders" className={linkClass} onClick={() => setSidebarOpen(false)}>
          <FiShoppingBag size={16} /> My Orders
        </NavLink>
        <NavLink to="/dashboard/my-reviews" className={linkClass} onClick={() => setSidebarOpen(false)}>
          <FiStar size={16} /> My Reviews
        </NavLink>
        <NavLink to="/dashboard/favorites" className={linkClass} onClick={() => setSidebarOpen(false)}>
          <FiHeart size={16} /> Favorites
        </NavLink>

        {role === "chef" && (
          <>
            <p className="text-gray-700 text-xs uppercase tracking-widest font-semibold px-4 mb-2 mt-4">Chef</p>
            <NavLink to="/dashboard/create-meal" className={linkClass} onClick={() => setSidebarOpen(false)}>
              <FiPlus size={16} /> Create Meal
            </NavLink>
            <NavLink to="/dashboard/my-meals" className={linkClass} onClick={() => setSidebarOpen(false)}>
              <FiList size={16} /> My Meals
            </NavLink>
            <NavLink to="/dashboard/order-requests" className={linkClass} onClick={() => setSidebarOpen(false)}>
              <FiInbox size={16} /> Order Requests
            </NavLink>
          </>
        )}

        {role === "admin" && (
          <>
            <p className="text-gray-700 text-xs uppercase tracking-widest font-semibold px-4 mb-2 mt-4">Admin</p>
            <NavLink to="/dashboard/manage-users" className={linkClass} onClick={() => setSidebarOpen(false)}>
              <FiUsers size={16} /> Manage Users
            </NavLink>
            <NavLink to="/dashboard/manage-requests" className={linkClass} onClick={() => setSidebarOpen(false)}>
              <FiSliders size={16} /> Manage Requests
            </NavLink>
            <NavLink to="/dashboard/platform-stats" className={linkClass} onClick={() => setSidebarOpen(false)}>
              <FiBarChart2 size={16} /> Statistics
            </NavLink>
          </>
        )}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200">
          <FiLogOut size={16} /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-950">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-gray-900 border-r border-gray-800 flex-col shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
            <SidebarContent />
          </div>
          <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}></div>
        </div>
      )}

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile topbar */}
        <div className="lg:hidden flex items-center gap-4 p-4 bg-gray-900 border-b border-gray-800">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-400 hover:text-white">
            <FiMenu size={20} />
          </button>
          <span className="text-white font-semibold text-sm" style={{ fontFamily: "'Playfair Display', serif" }}>Dashboard</span>
        </div>
        <div className="flex-1 p-6 lg:p-8 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
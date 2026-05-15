import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success("See you soon!");
  };

  const linkClass = ({ isActive }) =>
    isActive
      ? "text-amber-400 font-semibold border-b-2 border-amber-400 pb-0.5"
      : "text-gray-300 hover:text-amber-400 transition-colors duration-200";

  const links = (
    <>
      <NavLink to="/" className={linkClass}>Home</NavLink>
      <NavLink to="/meals" className={linkClass}>Meals</NavLink>
      {user && <NavLink to="/dashboard/profile" className={linkClass}>Dashboard</NavLink>}
    </>
  );

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-gray-950/95 backdrop-blur-md shadow-lg shadow-black/50" : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-600 rounded-xl flex items-center justify-center text-xl shadow-lg group-hover:scale-110 transition-transform">
            🍽️
          </div>
          <div>
            <span className="text-xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              LocalChef<span className="text-amber-400">Bazaar</span>
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm tracking-wide">
          {links}
        </div>

        {/* Auth */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gray-800 rounded-full pl-1 pr-4 py-1">
                <img
                  src={user.photoURL || "https://ui-avatars.com/api/?name=" + user.displayName}
                  alt="profile"
                  className="w-8 h-8 rounded-full object-cover border-2 border-amber-400"
                />
                <span className="text-sm text-gray-300 font-medium">{user.displayName?.split(" ")[0]}</span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-200 hover:scale-105">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Link to="/login"
                className="text-amber-400 border border-amber-400/50 px-5 py-2 rounded-full text-sm font-semibold hover:bg-amber-400/10 transition-all duration-200">
                Login
              </Link>
              <Link to="/register"
                className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-200 hover:scale-105">
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-gray-300 hover:text-amber-400 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}>
          <div className="w-6 h-5 flex flex-col justify-between">
            <span className={`block h-0.5 bg-current transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}></span>
            <span className={`block h-0.5 bg-current transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}></span>
            <span className={`block h-0.5 bg-current transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-950/98 backdrop-blur-md border-t border-gray-800 px-6 py-6 flex flex-col gap-5">
          <div className="flex flex-col gap-4 text-sm">
            {links}
          </div>
          {user ? (
            <button onClick={handleLogout}
              className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold">
              Logout
            </button>
          ) : (
            <div className="flex flex-col gap-3">
              <Link to="/login" onClick={() => setMenuOpen(false)}
                className="text-center text-amber-400 border border-amber-400/50 px-5 py-2.5 rounded-full text-sm font-semibold">
                Login
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}
                className="text-center bg-gradient-to-r from-amber-500 to-orange-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold">
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { FiMail, FiPhone, FiMapPin, FiClock } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-gray-950 border-t border-gray-800/50">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-600 rounded-xl flex items-center justify-center text-xl">
                🍽️
              </div>
              <span className="text-xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                LocalChef<span className="text-amber-400">Bazaar</span>
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Connecting passionate home cooks with food lovers seeking authentic, homemade meals.
            </p>
            <div className="flex gap-3">
              {[FaFacebook, FaInstagram, FaTwitter, FaYoutube].map((Icon, i) => (
                <a key={i} href="#"
                  className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-amber-400 hover:bg-gray-700 transition-all duration-200">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-widest">Explore</h4>
            <ul className="space-y-3">
              {["Home", "Meals", "Login", "Register"].map(item => (
                <li key={item}>
                  <Link to={`/${item === "Home" ? "" : item.toLowerCase()}`}
                    className="text-gray-500 hover:text-amber-400 text-sm transition-colors duration-200 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-amber-400/50"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Working Hours */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-widest">Hours</h4>
            <ul className="space-y-3">
              {[
                { day: "Mon – Fri", hours: "8am – 10pm" },
                { day: "Saturday", hours: "9am – 11pm" },
                { day: "Sunday", hours: "10am – 8pm" },
              ].map(({ day, hours }) => (
                <li key={day} className="flex items-start gap-2">
                  <FiClock className="text-amber-400 mt-0.5 shrink-0" size={13} />
                  <div>
                    <span className="text-gray-400 text-xs block">{day}</span>
                    <span className="text-gray-300 text-sm">{hours}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-widest">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <FiMail className="text-amber-400 shrink-0" size={13} />
                <span className="text-gray-400 text-sm">support@localchefbazaar.com</span>
              </li>
              <li className="flex items-center gap-2">
                <FiPhone className="text-amber-400 shrink-0" size={13} />
                <span className="text-gray-400 text-sm">+880 1234-567890</span>
              </li>
              <li className="flex items-center gap-2">
                <FiMapPin className="text-amber-400 shrink-0" size={13} />
                <span className="text-gray-400 text-sm">Dhaka, Bangladesh</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} LocalChefBazaar. All rights reserved.
          </p>
          <p className="text-gray-700 text-xs">
            Made with ❤️ for home cooks everywhere
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
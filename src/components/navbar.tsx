import { Link } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full bg-gray-200 fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="text-black text-2xl font-bold">
          Routico
        </Link>

        {/* Hamburger Icon (Mobile) */}
        <button
          className="md:hidden text-black focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={
                menuOpen
                  ? "M6 18L18 6M6 6l12 12" // X icon
                  : "M4 6h16M4 12h16M4 18h16" // Hamburger
              }
            />
          </svg>
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <nav className="flex space-x-8 text-black font-medium">
            <Link to="/about" className="hover:text-gray-600 transition-colors">
              About Us
            </Link>
            <Link to="/partner" className="hover:text-gray-600 transition-colors">
              Partner
            </Link>
            <Link to="/contact-us" className="hover:text-gray-600 transition-colors">
              Contact Us
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="bg-white text-black px-5 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-white text-black px-5 py-2 rounded-md font-medium transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-100 px-6 pb-4 space-y-2">
          <nav className="flex flex-col space-y-2 text-black font-medium">
            <Link to="/about" onClick={() => setMenuOpen(false)}>About Us</Link>
            <Link to="/partner" onClick={() => setMenuOpen(false)}>Partner</Link>
            <Link to="/contact-us" onClick={() => setMenuOpen(false)}>Contact Us</Link>
            <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
            <Link to="/register" onClick={() => setMenuOpen(false)}>Register</Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;

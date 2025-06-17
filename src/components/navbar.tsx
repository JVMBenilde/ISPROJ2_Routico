import { Link } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full fixed top-0 left-0 z-50 bg-white shadow">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="text-2xl font-bold text-black">
          Routico
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <nav className="flex items-center space-x-8 text-black font-medium">
            <Link to="/about" className="hover:text-blue-600">About Us</Link>
            <Link to="/partner" className="hover:text-blue-600">Partner</Link>
            <Link to="/contact-us" className="hover:text-blue-600">Contact Us</Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link to="/login" className="bg-gray-100 text-black px-4 py-2 rounded hover:bg-gray-200">Login</Link>
            <Link to="/register" className="bg-gray-100 text-black px-4 py-2 rounded hover:bg-gray-200">Register</Link>
          </div>
        </div>

        <button
          className="md:hidden text-black focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={
                menuOpen
                  ? "M6 18L18 6M6 6l12 12"
                  : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden px-6 pb-4 space-y-2 bg-white shadow-md text-black font-medium">
          <Link to="/about" onClick={() => setMenuOpen(false)} className="block hover:text-blue-600">About Us</Link>
          <Link to="/partner" onClick={() => setMenuOpen(false)} className="block hover:text-blue-600">Partner</Link>
          <Link to="/contact-us" onClick={() => setMenuOpen(false)} className="block hover:text-blue-600">Contact Us</Link>
          <Link to="/login" onClick={() => setMenuOpen(false)} className="block hover:text-blue-600">Login</Link>
          <Link to="/register" onClick={() => setMenuOpen(false)} className="block hover:text-blue-600">Register</Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;

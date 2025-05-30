import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="w-full bg-gray-200 fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="text-black text-2xl font-bold">
          Routico
        </Link>

        <div className="flex items-center space-x-8">
          <nav className="flex space-x-8 text-black font-medium">
            <Link to="/about" className="hover:text-gray-600 transition-colors">
              About Us
            </Link>
            <Link to="/partner" className="hover:text-gray-600 transition-colors">
              Partner
            </Link>
            <Link to="/contact" className="hover:text-gray-600 transition-colors">
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
              className="bg-white text-black px-5 py-2 rounded-md font-medium  transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

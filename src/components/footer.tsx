// src/components/Footer.tsx
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-200 text-white pt-12 pb-6 w-full">
      <div className="max-w-7xl px-6 mx-auto">
        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8 text-center w-full">
            <div>
              <h2 className="text-2xl text-black font-bold mb-4">Routico</h2>
              <p className="text-black mb-4">
                Finding your perfect delivery solution has never been easier.
              </p>
              <div className="flex justify-center space-x-4">
                <a 
                  href="https://facebook.com" 
                  className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                  aria-label="Facebook"
                >
                  <FaFacebookF />
                </a>
                <a 
                  href="https://twitter.com" 
                  className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors"
                  aria-label="Twitter"
                >
                  <FaTwitter />
                </a>
                <a 
                  href="https://instagram.com" 
                  className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors"
                  aria-label="Instagram"
                >
                  <FaInstagram />
                </a>
                <a 
                  href="https://linkedin.com" 
                  className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center hover:bg-blue-800 transition-colors"
                  aria-label="LinkedIn"
                >
                  <FaLinkedinIn />
                </a>
              </div>
            </div>

            <div className="text-black">
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <address className="not-italic">
                <p className="mb-2">123 Delivery Lane, Manila</p>
                <p className="mb-2">Philippines, 1000</p>
                <p className="mb-2">Email: info@routico.com</p>
                <p>Phone: +63 987 654 3210</p>
              </address>
            </div>

            <div className="text-black">
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/support" className="hover:text-white transition">Contact Support</Link>
                </li>
                <li>
                  <Link to="/about-us" className="hover:text-white transition">About Us</Link>
                </li>
                <li>
                  <Link to="/services" className="hover:text-white transition">Delivery Services</Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-white transition">Terms & Conditions</Link>
                </li> 
              </ul>
            </div>
          </div>
        </div>

        <hr className="border-gray-700 mb-6" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-black text-sm mb-4 md:mb-0">
            Copyright © 2025 Routico. All rights reserved.
          </p>
          <p className="text-black text-sm text-center">
            Designed by IS Students in De La Salle College of Saint Benilde
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

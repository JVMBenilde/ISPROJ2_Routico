
import { useState } from 'react';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    accountType: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { fullName, email, phone, password, confirmPassword, accountType } = form;

    if (!fullName || !email || !phone || !password || !confirmPassword || !accountType) {
      Swal.fire('All fields are required!', '', 'warning');
      return;
    }

    if (!/^\d{11}$/.test(phone)) {
      Swal.fire('Phone number must be exactly 11 digits.', '', 'error');
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire("Passwords don't match.", '', 'error');
      return;
    }

    Swal.fire('Registered Successfully!', '', 'success');
  };

  return (
    <main className="min-h-screen flex items-start justify-center bg-white px-4 pt-30 pb-10">
      <div className="bg-white p-10 md:p-20 rounded-2xl shadow-lg w-full max-w-md text-left border border-gray-300">
        <h1 className="text-4xl font-extrabold text-center text-black">Routico</h1>
        <h2 className="text-xl font-semibold text-center mt-2 mb-6">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              name="fullName"
              type="text"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Juan Dela Cruz"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="juandelacruz@email.com"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="09XXXXXXXXX"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
            <div className="flex items-center space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="accountType"
                  value="business_owner"
                  onChange={handleChange}
                  className="form-radio text-blue-600"
                />
                <span className="ml-2 text-sm text-gray-700">Business Owner</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="accountType"
                  value="driver"
                  onChange={handleChange}
                  className="form-radio text-blue-600"
                />
                <span className="ml-2 text-sm text-gray-700">Driver</span>
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="w-full mt-4 bg-black text-white py-2 rounded-md hover:bg-gray-900 transition duration-200"
          >
            Register
          </button>
        </form>
        <p className="text-sm text-center text-gray-600 mt-4">
          {' '}
          <Link to="/login" className="text-sm text-blue-600 text-center mt-4 hover:underline">
            Already have an account?
          </Link>
        </p>
      </div>
    </main>
  );
};

export default RegisterPage;

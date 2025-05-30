
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const LoginPage = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { email, password } = form;

    if (!email || !password) {
      Swal.fire('Email and Password are required!', '', 'warning');
      return;
    }

    Swal.fire('Login successful!', '', 'success');
  };

  return (
    <main className="min-h-screen flex items-start justify-center bg-white px-4 pt-30 pb-10">
      <div className="bg-white p-10 md:p-20 rounded-2xl shadow-lg w-full max-w-md text-left border border-gray-300">
        <h1 className="text-4xl font-extrabold text-center text-black">Routico</h1>
        <h2 className="text-xl font-semibold text-center mt-2 mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <button
            type="submit"
            className="w-full mt-4 bg-black text-white py-2 rounded-md hover:bg-gray-900 transition duration-200"
          >
            Login
          </button>
        </form>
        <p className="text-sm text-center text-gray-600 mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </main>
  );
};

export default LoginPage;

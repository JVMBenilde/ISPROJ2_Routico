import { useState } from 'react';
import Swal from 'sweetalert2';
import { auth } from '../firebase';

const RegisterBusinessPage = () => {
  const [form, setForm] = useState({
    companyName: '',
    businessType: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.companyName || !form.businessType) {
      Swal.fire('All fields are required.', '', 'warning');
      return;
    }

    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not authenticated');
      const token = await user.getIdToken();

      const res = await fetch('/api/business-owners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          companyName: form.companyName,
          businessType: form.businessType,
        }),
      });

      if (res.ok) {
        Swal.fire('Business registered successfully!', '', 'success');
        setForm({ companyName: '', businessType: '' });
      } else {
        Swal.fire('Failed to register business.', '', 'error');
      }
    } catch (err) {
      Swal.fire('Server error.', '', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-6">Register Your Business</h1>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white border p-6 rounded shadow space-y-4"
      >
        <div>
          <label className="block font-medium mb-1">Company Name</label>
          <input
            type="text"
            name="companyName"
            value={form.companyName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Business Type</label>
          <select
            name="businessType"
            value={form.businessType}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select type</option>
            <option value="Retail">Retail</option>
            <option value="Logistics">Logistics</option>
            <option value="Construction">Construction</option>
            <option value="Technology">Technology</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
        >
          {loading ? 'Registering...' : 'Register Business'}
        </button>
      </form>
    </main>
  );
};

export default RegisterBusinessPage;

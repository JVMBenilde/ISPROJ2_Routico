import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { auth } from '../../firebase';
import { submitBusinessRegistration, fetchMyRegistrations } from '../../api/business-owners';

const RegisterBusinessPage = () => {
  const [form, setForm] = useState({ companyName: '', businessType: '' });
  const [govIdFile, setGovIdFile] = useState<File | null>(null);
  const [permitFile, setPermitFile] = useState<File | null>(null);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (!files?.length) return;
    const file = files[0];
    if (file.size > MAX_FILE_SIZE) return Swal.fire('File too large', '', 'error');
    if (name === 'govId') setGovIdFile(file);
    if (name === 'permit') setPermitFile(file);
  };

  const loadRegistrations = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();
      const data = await fetchMyRegistrations(token);
      setRegistrations(data || []);
    } catch (err) {
      console.error('Failed to load registrations', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.companyName || !form.businessType || !govIdFile || !permitFile) {
      Swal.fire('All fields and documents are required.', '', 'warning');
      return;
    }

    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not authenticated');
      const token = await user.getIdToken();

      const formData = new FormData();
      formData.append('companyName', form.companyName);
      formData.append('businessType', form.businessType);
      formData.append('govId', govIdFile);
      formData.append('permit', permitFile);

      const res = await submitBusinessRegistration(formData, token);

      if (res.ok) {
        Swal.fire('Business registered successfully!', '', 'success');
        setForm({ companyName: '', businessType: '' });
        setGovIdFile(null);
        setPermitFile(null);
        loadRegistrations();
      } else {
        Swal.fire('Failed to register business.', '', 'error');
      }
    } catch {
      Swal.fire('Server error.', '', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRegistrations();
  }, []);

  const hasPending = registrations.some(r => r.status === 'pending');
  const hasApproved = registrations.some(r => r.status === 'approved');
  const formDisabled = hasPending || hasApproved;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-6">Register Your Business</h1>

      {!formDisabled ? (
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white border p-6 rounded shadow space-y-4 mb-10"
          encType="multipart/form-data"
        >
          <div>
            <label className="block font-medium mb-1">Company Name</label>
            <input type="text" name="companyName" value={form.companyName} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block font-medium mb-1">Business Type</label>
            <select name="businessType" value={form.businessType} onChange={handleChange} className="w-full p-2 border rounded">
              <option value="">Select type</option>
              <option value="Retail">Retail</option>
              <option value="Logistics">Logistics</option>
              <option value="Construction">Construction</option>
              <option value="Technology">Technology</option>
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Government ID</label>
            <input type="file" name="govId" onChange={handleFileChange} className="w-full p-2 border rounded" accept="image/*,application/pdf" />
          </div>
          <div>
            <label className="block font-medium mb-1">Business Permit / Mayor's Permit</label>
            <input type="file" name="permit" onChange={handleFileChange} className="w-full p-2 border rounded" accept="image/*,application/pdf" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-black text-white py-2 rounded hover:bg-gray-800">
            {loading ? 'Registering...' : 'Register Business'}
          </button>
        </form>
      ) : (
        <p className="text-sm text-red-600 mb-10">
          You can only register one business. You have an {hasPending ? 'pending' : 'approved'} registration.
        </p>
      )}

      <div className="w-full max-w-3xl">
        <h2 className="text-xl font-semibold mb-4">My Business Registrations</h2>
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2">Company</th>
              <th className="border px-3 py-2">Type</th>
              <th className="border px-3 py-2">Status</th>
              <th className="border px-3 py-2">Notes</th>
            </tr>
          </thead>
          <tbody>
            {registrations.length === 0 ? (
              <tr><td colSpan={3} className="text-center py-4">No submissions found.</td></tr>
            ) : (
              registrations.map((r, i) => {
                const status = r.status?.toLowerCase();
                let statusClass = '';
                if (status === 'pending') statusClass = 'bg-yellow-400 text-black';
                else if (status === 'approved') statusClass = 'bg-green-400 text-black';
                else if (status === 'rejected') statusClass = 'bg-red-600 text-black';

                return (
                  <tr key={i}>
                    <td className="border px-3 py-2">{r.company_name}</td>
                    <td className="border px-3 py-2">{r.business_type}</td>
                    <td className="border px-3 py-2">
                      <span className={`capitalize font-semibold text-sm px-2 py-1 rounded ${statusClass}`}>
                        {status}
                      </span>
                    </td>
                    <td className="border px-3 py-2">{r.review_notes}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default RegisterBusinessPage;

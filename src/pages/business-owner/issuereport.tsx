import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { auth } from '../../firebase';

interface Category {
  category_id: number;
  category_name: string;
}

const BusinessIssueReportPage = () => {
  const [form, setForm] = useState({
    category_id: '',
    description: '',
    proof_attachment: null as File | null,
    order_id: ''
  });

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/issues/issue-categories');
        const data = await res.json();
        setCategories(data);
      } catch {
        Swal.fire('Failed to fetch categories', '', 'error');
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setForm((prev) => ({ ...prev, proof_attachment: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { category_id, description, proof_attachment, order_id } = form;
    if (!category_id || !description) {
      Swal.fire('Please fill in all required fields', '', 'warning');
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      Swal.fire('You must be logged in to submit an issue.', '', 'error');
      return;
    }

    const token = await user.getIdToken();

    const body = new FormData();
    body.append('category_id', category_id);
    body.append('description', description);
    body.append('context', 'general');
    if (order_id) body.append('order_id', order_id);
    if (proof_attachment) body.append('proof_attachment', proof_attachment);

    try {
      const res = await fetch('/api/issues', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body
      });

      if (res.ok) {
        Swal.fire('Issue reported successfully', '', 'success');
        setForm({ category_id: '', description: '', proof_attachment: null, order_id: '' });
      } else {
        const err = await res.json();
        Swal.fire(err.message || 'Failed to submit issue', '', 'error');
      }
    } catch {
      Swal.fire('Server error', '', 'error');
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Report an Issue</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow border">
        <div>
          <label className="block mb-1 font-medium">Category</label>
          <select
            name="category_id"
            value={form.category_id}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.category_id} value={cat.category_id}>
                {cat.category_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Order ID (optional)</label>
          <input
            type="text"
            name="order_id"
            value={form.order_id}
            onChange={handleChange}
            className="w-full border rounded p-2"
            placeholder="Enter order ID if applicable"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border rounded p-2"
            rows={5}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Proof Attachment (optional)</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
        >
          Submit Issue
        </button>
      </form>
    </main>
  );
};

export default BusinessIssueReportPage;

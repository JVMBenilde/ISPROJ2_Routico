import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { auth } from '../../firebase';

interface Issue {
  issue_id: string;
  order_id?: string;
  reporter_name?: string;
  category: string;
  description: string;
  status: string;
  context: 'general' | 'delivery';
}

const IssueResolutionPage = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [tab, setTab] = useState<'delivery' | 'general'>('delivery');
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);
  const [newStatus, setNewStatus] = useState('');

  const fetchIssues = async () => {
    try {
      const user = auth.currentUser;
      const token = await user?.getIdToken();
      const res = await fetch('/api/issues', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setIssues(data);
    } catch {
      Swal.fire('Failed to fetch issues.', '', 'error');
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const handleEdit = (issue: Issue) => {
    setEditingIssue(issue);
    setNewStatus(issue.status);
  };

  const handleStatusUpdate = async () => {
    if (!editingIssue) return;
    try {
      const user = auth.currentUser;
      const token = await user?.getIdToken();
      const res = await fetch(`/api/issues/${editingIssue.issue_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        Swal.fire('Status updated successfully.', '', 'success');
        fetchIssues();
        setEditingIssue(null);
      } else {
        const err = await res.json();
        Swal.fire(err.message || 'Failed to update status.', '', 'error');
      }
    } catch {
      Swal.fire('Server error.', '', 'error');
    }
  };

  const handleDelete = (issueId: string) => {
    Swal.fire({
      title: 'Delete issue?',
      text: `Are you sure you want to delete issue ${issueId}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const user = auth.currentUser;
          const token = await user?.getIdToken();
          await fetch(`/api/issues/${issueId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
          });
          Swal.fire('Deleted!', '', 'success');
          fetchIssues();
        } catch {
          Swal.fire('Error deleting issue.', '', 'error');
        }
      }
    });
  };

  const deliveryIssues = issues.filter(issue => issue.context === 'delivery');
  const generalIssues = issues.filter(issue => issue.context === 'general');

  return (
    <main className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-2">Issue Resolution</h1>
      <p className="text-sm text-muted-foreground mb-6">Manage and resolve all reported issues.</p>

      <div className="flex gap-2 mb-4">
        <button
          className={`px-4 py-2 rounded ${tab === 'delivery' ? 'bg-black text-white' : 'bg-gray-200'}`}
          onClick={() => setTab('delivery')}
        >
          Delivery Issues
        </button>
        <button
          className={`px-4 py-2 rounded ${tab === 'general' ? 'bg-black text-white' : 'bg-gray-200'}`}
          onClick={() => setTab('general')}
        >
          General Issues
        </button>
      </div>

      {tab === 'delivery' && (
        <IssueTable issues={deliveryIssues} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      {tab === 'general' && (
        <IssueTable issues={generalIssues} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      {editingIssue && (
        <div className="mt-6 bg-white border p-4 rounded shadow max-w-md mx-auto">
          <h2 className="text-lg font-bold mb-2">Update Status</h2>
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="w-full border p-2 mb-4 rounded"
          >
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
          <div className="flex gap-2">
            <button
              className="px-4 py-2 bg-green-600 text-white rounded"
              onClick={handleStatusUpdate}
            >
              Save
            </button>
            <button
              className="px-4 py-2 bg-gray-300 rounded"
              onClick={() => setEditingIssue(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

const IssueTable = ({ issues, onEdit, onDelete }: {
  issues: Issue[];
  onEdit: (issue: Issue) => void;
  onDelete: (id: string) => void;
}) => (
  <div className="overflow-x-auto bg-white rounded shadow border">
    <table className="min-w-full text-sm">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-3 text-center font-medium">Issue ID</th>
          <th className="p-3 text-center font-medium">Order ID</th>
          <th className="p-3 text-center font-medium">Reporter</th>
          <th className="p-3 text-center font-medium">Category</th>
          <th className="p-3 text-center font-medium">Description</th>
          <th className="p-3 text-center font-medium">Status</th>
          <th className="p-3 text-center font-medium">Action</th>
        </tr>
      </thead>
      <tbody>
        {issues.map((issue) => (
          <tr key={issue.issue_id} className="border-t hover:bg-gray-50">
            <td className="p-3 text-center">{issue.issue_id}</td>
            <td className="p-3 text-center">{issue.order_id ?? '—'}</td>
            <td className="p-3 text-center">{issue.reporter_name ?? '—'}</td>
            <td className="p-3 text-center">{issue.category}</td>
            <td className="p-3 text-center">{issue.description}</td>
            <td className="p-3 text-center">{issue.status}</td>
            <td className="p-3 flex justify-center gap-2">
              <button className="px-2 py-1 bg-blue-500 text-white text-sm rounded" onClick={() => onEdit(issue)}>Edit</button>
              <button className="px-2 py-1 bg-red-500 text-white text-sm rounded" onClick={() => onDelete(issue.issue_id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default IssueResolutionPage;

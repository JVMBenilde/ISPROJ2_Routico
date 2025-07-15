import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { auth } from '../../firebase';
import {
  fetchAllBusinessRegistrations,
  approveBusinessRegistration,
  disapproveBusinessRegistration,
} from '../../api/view-registrations';

interface BusinessRegistration {
  user_id: number;
  company_name: string;
  business_type: string;
  status: 'pending' | 'approved' | 'rejected';
  owner_name: string;
}

const ViewRegistrationsPage = () => {
  const [registrations, setRegistrations] = useState<BusinessRegistration[]>([]);
  const [loading, setLoading] = useState(false);
  const [disapprovalReason, setDisapprovalReason] = useState('');
  const [showReasonInputId, setShowReasonInputId] = useState<number | null>(null);

  const getToken = async () => {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');
    return await user.getIdToken();
  };

  const fetchRegistrations = async () => {
    try {
      const token = await getToken();
      const data = await fetchAllBusinessRegistrations(token);
      console.log('Registrations data:', data);
      setRegistrations(data);
    } catch {
      Swal.fire('Failed to load registrations.', '', 'error');
    }
  };

  const handleApprove = async (userId: number) => {
    try {
      const token = await getToken();
      const res = await approveBusinessRegistration(userId, token);
      if (res.ok) {
        Swal.fire('Approved!', '', 'success');
        fetchRegistrations();
      } else {
        Swal.fire('Failed to approve.', '', 'error');
      }
    } catch {
      Swal.fire('Server error.', '', 'error');
    }
  };

  const handleDisapprove = async (userId: number) => {
    if (!disapprovalReason.trim()) {
      Swal.fire('Please provide a reason for disapproval.', '', 'warning');
      return;
    }

    try {
      const token = await getToken();
      const res = await disapproveBusinessRegistration(userId, disapprovalReason, token);
      if (res.ok) {
        Swal.fire('Disapproved!', '', 'success');
        setDisapprovalReason('');
        setShowReasonInputId(null);
        fetchRegistrations();
      } else {
        Swal.fire('Failed to disapprove.', '', 'error');
      }
    } catch {
      Swal.fire('Server error.', '', 'error');
    }
  };

  const getStatusStyle = (status: string) => {
    if (status === 'approved') return 'bg-green-200 text-green-800 rounded px-2 py-1 text-sm';
    if (status === 'rejected') return 'bg-red-200 text-red-800 rounded px-2 py-1 text-sm';
    return 'bg-yellow-200 text-yellow-800 rounded px-2 py-1 text-sm';
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  return (
    <main className="min-h-screen p-6 flex flex-col items-center bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">View Registrations</h1>

      <div className="overflow-x-auto bg-white rounded shadow border w-full max-w-5xl">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-center font-medium">Business Owner</th>
              <th className="p-3 text-center font-medium">Company Name</th>
              <th className="p-3 text-center font-medium">Business</th>
              <th className="p-3 text-center font-medium">Status</th>
              <th className="p-3 text-center font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {registrations.length === 0 ? (
              <tr><td colSpan={5} className="text-center p-4">No registrations found.</td></tr>
            ) : (
              registrations.map(reg => (
                <tr key={reg.user_id} className="hover:bg-gray-50 text-center">
                  <td className="p-3">{reg.owner_name}</td>
                  <td className="p-3">{reg.company_name}</td>
                  <td className="p-3">{reg.business_type}</td>
                  <td className="p-3">
                    <span className={getStatusStyle(reg.status)}>{reg.status}</span>
                  </td>
                  <td className="p-3 space-x-2">
                    {reg.status === 'pending' && (
                      <>
                        <button
                          className="px-2 py-1 bg-green-500 text-white rounded text-xs"
                          onClick={() => handleApprove(reg.user_id)}
                        >Approve</button>
                        <button
                          className="px-2 py-1 bg-red-500 text-white rounded text-xs"
                          onClick={() => setShowReasonInputId(reg.user_id)}
                        >Disapprove</button>
                      </>
                    )}
                    {showReasonInputId === reg.user_id && (
                      <div className="mt-2">
                        <input
                          type="text"
                          placeholder="Reason for disapproval"
                          className="p-2 border rounded w-full mb-2"
                          value={disapprovalReason}
                          onChange={e => setDisapprovalReason(e.target.value)}
                        />
                        <button
                          className="px-2 py-1 bg-gray-800 text-white rounded text-xs"
                          onClick={() => handleDisapprove(reg.user_id)}
                        >Submit</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default ViewRegistrationsPage;

export const fetchAllBusinessRegistrations = async (token: string) => {
  const res = await fetch('/api/view-registrations', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to load registrations');
  }

  return await res.json();
};

export const approveBusinessRegistration = async (userId: number, token: string) => {
  return await fetch(`/api/view-registrations/${userId}/approve`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const disapproveBusinessRegistration = async (
  userId: number,
  reason: string,
  token: string
) => {
  return await fetch(`/api/view-registrations/${userId}/disapprove`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ reason }),
  });
};
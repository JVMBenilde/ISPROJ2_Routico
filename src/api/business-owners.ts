export const submitBusinessRegistration = async (
  formData: FormData,
  token: string
): Promise<Response> => {
  return await fetch('http://localhost:3001/api/business-owners', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
};

export const fetchMyRegistrations = async (token: string) => {
  const res = await fetch('http://localhost:3001/api/business-owners/registrations', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch registrations');
  }

  return await res.json();
};

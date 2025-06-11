export const registerUser = async (form: {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role: string;
}) => {
  const response = await fetch('/api/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(form),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Registration failed');
  return data;
};
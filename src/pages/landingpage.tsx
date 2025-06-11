import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile', {
          credentials: 'include',
        });

        if (!res.ok) throw new Error();

        const user = await res.json();

        switch (user.role) {
          case 'admin':
            navigate('/admin');
            break;
          case 'driver':
            navigate('/driver');
            break;
          case 'business_owner':
            navigate('/business-owner');
            break;
          default:
            navigate('/login');
        }
      } catch {
        navigate('/login');
      }
    };

    fetchProfile();
  }, [navigate]);

  return null;
};

export default LandingPage;
import { useState, useEffect } from 'react';
import { getProfile } from '../api/auth';

export const useUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await getProfile();
        setUser(userData);
      } catch (err) {
        console.error('Failed to load user', err);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  return { user, loading };
};
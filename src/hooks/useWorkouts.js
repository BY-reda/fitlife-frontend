import { useState, useEffect } from 'react';
import { getWorkouts } from '../api/workouts';

export const useWorkouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const data = await getWorkouts();
        setWorkouts(data);
      } catch (err) {
        console.error('Failed to fetch workouts', err);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkouts();
  }, []);

  return { workouts, loading };
};
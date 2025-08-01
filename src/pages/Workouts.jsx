
import { useNavigate } from 'react-router-dom';
import '../css/Workouts.css';
import React, { useEffect, useState } from 'react';
import api from '../api/client';
const muscleGroups = [
  { id: 'abs', name: 'Abdos', count: 2, image: '/exercices/abs.jpg' },
  { id: 'back', name: 'Dorsaux', count: 2, image: '/exercices/back.jpg' },
  { id: 'biceps', name: 'Biceps', count: 2, image: '/exercices/biceps.jpg' },
  { id: 'calves', name: 'Mollet', count: 2, image: '/exercices/calves.jpg' },
  { id: 'chest', name: 'Poitrine', count: 2, image: '/exercices/chest.jpg' },
  { id: 'shoulders', name: 'Épaules', count: 2, image: '/exercices/shoulders.jpg' },
  { id: 'triceps', name: 'Triceps', count: 2, image: '/exercices/triceps.jpg' },
  { id: 'legs', name: 'Jambes', count: 2,  image: '/exercices/legs.jpg' },
];

const Workouts = () => {
  const navigate = useNavigate();
  const [dbExercises, setDbExercises] = useState([]);

useEffect(() => {
  const fetchExercises = async () => {
    try {
      const res = await api.get('/catalog-exercises/');
      console.log('Exercices récupérés depuis MongoDB :', res.data);
       console.log('Exercices récupérés nombre :', res.data.length);
      setDbExercises(res.data);
    } catch (err) {
      console.error('Erreur API :', err);
    }
  };

  fetchExercises();
}, []);

  return (
    <div className="workout-page">
      <h1 className="page-title">Exercise Categories</h1>
      <p className="subtitle">Browse exercises by muscle group</p>

      <div className="group-grid">
        {muscleGroups.map((group) => (
          <div
            key={group.id}
            className="group-card"
            style={{ backgroundColor: group.color }}
            onClick={() => navigate(`/app/workouts/${group.id}`)}
          >
            <img src={group.image} alt={group.name} className="group-image" />
            <div className="group-info">
              <h2>{group.name}</h2>
       <p className="count">
  {
    group.count +
    dbExercises.filter((ex) => ex.muscleGroup === group.id).length
  } exercises
</p>

            </div>
          </div>
        ))}
      </div>
    </div>

  );
};

export default Workouts;

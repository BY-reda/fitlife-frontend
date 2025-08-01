import React, { createContext, useContext, useState } from 'react';

export const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {
  const [selectedExercises, setSelectedExercises] = useState([]);

  const addExercise = (exercise) => {
    setSelectedExercises((prev) => {
      const alreadyAdded = prev.some((e) => e.id === exercise.id);
      return alreadyAdded ? prev : [...prev, exercise];
    });
  };

  return (
    <WorkoutContext.Provider value={{ selectedExercises, addExercise }}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => useContext(WorkoutContext);

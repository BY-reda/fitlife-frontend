import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api/client';

import '../css/ExerciseDetail.css';

const mockExercises = {
  abs1: {
    id: 'abs1',
    name: 'Crunches',
    muscleGroup: 'Abs',
    difficulty: 'Beginner',
    equipment: 'Bodyweight',
    restTime: '30-60 seconds',
    recommended: '3-4 sets, 8-12 reps',
    image: '/workouts/abdos/crunches.png',
    instructions: [
      'Lie on your back with knees bent and feet flat on the floor.',
      'Place hands behind your head or across your chest.',
      'Exhale as you lift your upper body, engaging your abs.',
      'Hold for a second, then slowly lower back down.',
      'Repeat for recommended reps.'
    ],
  },
  abs2: {
    id: 'abs2',
    name: 'Plank',
    muscleGroup: 'Abs',
    difficulty: 'Intermediate',
    equipment: 'Bodyweight',
    restTime: '30-60 seconds',
    recommended: '3 sets, hold for 20-60 seconds',
    image: '/workouts/abdos/panks.png',
    instructions: [
      'Start face down with forearms on the floor, elbows under shoulders.',
      'Extend legs back, keeping your body in a straight line.',
      'Engage your core and glutes.',
      'Hold this position without letting your hips sag.',
      'Breathe steadily and hold for recommended time.'
    ],
  },

  back1: {
    id: 'back1',
    name: 'Pull-ups',
    muscleGroup: 'Back',
    difficulty: 'Advanced',
    equipment: 'Pull-up bar',
    restTime: '60-90 seconds',
    recommended: '3 sets, 6-10 reps',
    image: '/workouts/back/latspulldown.png',
    instructions: [
      'Grab the pull-up bar with hands shoulder-width apart, palms facing away.',
      'Hang fully extended with your arms straight.',
      'Pull yourself up until your chin passes the bar.',
      'Pause at the top, then lower yourself down slowly.',
      'Repeat for recommended reps without swinging.'
    ],
  },
  back2: {
    id: 'back2',
    name: 'Bent-over Rows',
    muscleGroup: 'Back',
    difficulty: 'Intermediate',
    equipment: 'Dumbbell or barbell',
    restTime: '60-90 seconds',
    recommended: '3-4 sets, 8-12 reps',
    image: '/workouts/back/over row.png',
    instructions: [
      'Hold dumbbells/barbell with palms facing down.',
      'Bend at hips with back straight and knees slightly bent.',
      'Pull weights towards your waist while squeezing shoulder blades.',
      'Lower weights back down slowly.',
      'Repeat for recommended reps.'
    ],
  },

  biceps1: {
    id: 'biceps1',
    name: 'Bicep Curls',
    muscleGroup: 'Biceps',
    difficulty: 'Beginner',
    equipment: 'Dumbbells',
    restTime: '30-60 seconds',
    recommended: '3-4 sets, 8-12 reps',
    image: '/workouts/biceps/curl.png',
    instructions: [
      'Stand holding dumbbells at your sides.',
      'Keep elbows close to your torso.',
      'Curl the weights up while contracting your biceps.',
      'Slowly lower the dumbbells back down.',
      'Repeat for recommended reps.'
    ],
  },
  biceps2: {
    id: 'biceps2',
    name: 'Hammer Curls',
    muscleGroup: 'Biceps',
    difficulty: 'Beginner',
    equipment: 'Dumbbells',
    restTime: '30-60 seconds',
    recommended: '3-4 sets, 8-12 reps',
    image: '/workouts/biceps/hammer.png',
    instructions: [
      'Stand with dumbbells in neutral grip (palms facing each other).',
      'Keep elbows fixed to your sides.',
      'Curl weights up while keeping wrists straight.',
      'Pause, then lower slowly.',
      'Repeat for recommended reps.'
    ],
  },

  calves1: {
    id: 'calves1',
    name: 'Calf Raises',
    muscleGroup: 'Calves',
    difficulty: 'Beginner',
    equipment: 'Bodyweight',
    restTime: '30-60 seconds',
    recommended: '3-4 sets, 12-20 reps',
    image: '/workouts/mollets/raise.png',
    instructions: [
      'Stand upright on a flat surface or step.',
      'Slowly raise your heels, lifting your body upward.',
      'Pause and squeeze your calves at the top.',
      'Lower heels back down in a controlled motion.',
      'Repeat for recommended reps.'
    ],
  },
  calves2: {
    id: 'calves2',
    name: 'Seated Calf Raises',
    muscleGroup: 'Calves',
    difficulty: 'Intermediate',
    equipment: 'Machine or weight',
    restTime: '30-60 seconds',
    recommended: '3-4 sets, 12-20 reps',
    image: '/workouts/mollets/seated.png',
    instructions: [
      'Sit with balls of feet on platform and weight on thighs.',
      'Raise heels by extending your ankles upward.',
      'Hold at the top, then lower heels below the platform.',
      'Repeat for recommended reps with control.'
    ],
  },

  chest1: {
    id: 'chest1',
    name: 'Push-ups',
    muscleGroup: 'Chest',
    difficulty: 'Beginner',
    equipment: 'Bodyweight',
    restTime: '30-60 seconds',
    recommended: '3-4 sets, 8-15 reps',
    image: '/workouts/chest/pushups.png',
    instructions: [
      'Start in a high plank with hands under shoulders.',
      'Lower your body by bending elbows until chest nearly touches floor.',
      'Push through palms to return to starting position.',
      'Keep core tight and back straight throughout.',
      'Repeat for recommended reps.'
    ],
  },
  chest2: {
    id: 'chest2',
    name: 'Bench Press',
    muscleGroup: 'Chest',
    difficulty: 'Intermediate',
    equipment: 'Barbell and bench',
    restTime: '60-90 seconds',
    recommended: '3-4 sets, 8-12 reps',
    image: '/workouts/chest/benchpress.png',
    instructions: [
      'Lie flat on bench with feet on floor.',
      'Grip barbell slightly wider than shoulder-width.',
      'Lower bar slowly to your chest.',
      'Push bar back up to starting position.',
      'Repeat for recommended reps.'
    ],
  },

  shoulders1: {
    id: 'shoulders1',
    name: 'Shoulder Press',
    muscleGroup: 'Shoulders',
    difficulty: 'Intermediate',
    equipment: 'Dumbbells',
    restTime: '30-60 seconds',
    recommended: '3-4 sets, 8-12 reps',
    image: '/workouts/shoulders/press shoulder.png',
    instructions: [
      'Hold dumbbells at shoulder height.',
      'Press weights upward until arms are fully extended.',
      'Pause at the top, then lower back to shoulders.',
      'Keep core tight and back straight.',
      'Repeat for recommended reps.'
    ],
  },
  shoulders2: {
    id: 'shoulders2',
    name: 'Lateral Raises',
    muscleGroup: 'Shoulders',
    difficulty: 'Beginner',
    equipment: 'Dumbbells',
    restTime: '30-60 seconds',
    recommended: '3-4 sets, 10-15 reps',
    image: '/workouts/shoulders/lateral raise.png',
    instructions: [
      'Stand with dumbbells at sides, palms facing in.',
      'Raise arms out to sides until shoulder height.',
      'Pause, then slowly lower back down.',
      'Keep slight bend in elbows throughout.',
      'Repeat for recommended reps.'
    ],
  },

  triceps1: {
    id: 'triceps1',
    name: 'Tricep Dips',
    muscleGroup: 'Triceps',
    difficulty: 'Intermediate',
    equipment: 'Bench or parallel bars',
    restTime: '30-60 seconds',
    recommended: '3-4 sets, 8-12 reps',
    image: '/workouts/triceps/dips.png',
    instructions: [
      'Place hands behind you on a bench or bars.',
      'Lower body by bending elbows until arms are at 90 degrees.',
      'Push back up through palms to start position.',
      'Keep back close to bench throughout.',
      'Repeat for recommended reps.'
    ],
  },
  triceps2: {
    id: 'triceps2',
    name: 'Tricep Extensions',
    muscleGroup: 'Triceps',
    difficulty: 'Intermediate',
    equipment: 'Dumbbell',
    restTime: '30-60 seconds',
    recommended: '3-4 sets, 8-12 reps',
    image: '/workouts/triceps/extention.png',
    instructions: [
      'Hold dumbbell overhead with both hands.',
      'Lower dumbbell behind your head by bending elbows.',
      'Keep elbows close to ears.',
      'Extend arms to raise dumbbell overhead again.',
      'Repeat for recommended reps.'
    ],
  },

  legs1: {
    id: 'legs1',
    name: 'Squats',
    muscleGroup: 'Legs',
    difficulty: 'Beginner',
    equipment: 'Bodyweight',
    restTime: '30-60 seconds',
    recommended: '3-4 sets, 12-15 reps',
    image: '/workouts/jambes/squat.png',
    instructions: [
      'Stand feet shoulder-width apart, toes slightly out.',
      'Lower body by bending knees and hips as if sitting back.',
      'Keep back straight and chest up.',
      'Go as low as comfortable, then push back up.',
      'Repeat for recommended reps.'
    ],
  },
  legs2: {
    id: 'legs2',
    name: 'Lunges',
    muscleGroup: 'Legs',
    difficulty: 'Beginner',
    equipment: 'Bodyweight',
    restTime: '30-60 seconds',
    recommended: '3-4 sets, 10-12 reps per leg',
    image: '/workouts/jambes/lungs.png',
    instructions: [
      'Stand tall, step forward with one leg.',
      'Lower hips until knees are bent at 90 degrees.',
      'Push back up through front foot to start position.',
      'Alternate legs and repeat.',
      'Maintain balance and control.'
    ],
  },
};

const ExerciseDetail = () => {
  const { id, catalogId } = useParams();
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to load exercise from backend (MongoDB) using axios
  const fetchCatalogExercise = async (catalogId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/catalog-exercises/${catalogId}`);
      const data = response.data;
      
      setExercise({
        id: data._id,
        name: data.name,
        muscleGroup: data.muscleGroup,
        difficulty: data.difficulty,
        equipment: data.equipment,
        restTime: data.restTime || 'N/A',
        recommended: data.recommended || 'N/A',
        image: data.image,
        instructions: data.instructions || [],
        isFromAPI: true,
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch exercise');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (catalogId) {
      // If we have a catalogId => fetch from MongoDB
      fetchCatalogExercise(catalogId);
    } else if (id) {
      // Otherwise look in mock exercises
      const ex = mockExercises[id];
      if (ex) setExercise(ex);
      else setError('Mock exercise not found');
    }
  }, [id, catalogId]);

  const handleSave = async () => {
    if (!exercise) return;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('❌ You must be logged in to save an exercise.');
        return;
      }
      
      const todayDate = new Date().toISOString().split('T')[0];

      const exerciseToSave = {
        name: exercise.name,
        muscleGroup: exercise.muscleGroup,
        difficulty: exercise.difficulty,
        equipment: exercise.equipment,
        restTime: exercise.restTime,
        recommended: exercise.recommended,
        image: exercise.image,
        instructions: Array.isArray(exercise.instructions)
          ? exercise.instructions
          : [exercise.instructions],
        date: todayDate,
      };

      const response = await api.post('/exercises/save', exerciseToSave);
      
      if (response.status === 201) {
        alert('✅ Exercise saved successfully!');
      }
    } catch (error) {
      if (error.response?.status === 409) {
        alert('⚠️ Exercise already saved for today.');
      } else {
        const message = error.response?.data?.message || 'Save failed: network or server error.';
        alert(`❌ ${message}`);
      }
      console.error('Save error:', error);
    }
  };

  if (loading) return <div className="exercise-detail">Loading...</div>;
  if (error) return <div className="exercise-detail">Error: {error}</div>;
  if (!exercise) return <div className="exercise-detail">Exercise not found.</div>;

  return (
    <div className="exercise-detail">
      <div className="exercise-header">
        <div className="exercise-image-container">
          <img src={exercise.image} alt={exercise.name} className="exercise-main-img" />
        </div>

        <div className="exercise-info-card">
          <h3>Quick Info</h3>
          <p><strong>Equipment:</strong> {exercise.equipment}</p>
          <p><strong>Difficulty:</strong> {exercise.difficulty}</p>
          <p><strong>Rest Time:</strong> {exercise.restTime}</p>
          <p><strong>Recommended:</strong> {exercise.recommended}</p>
          <button className="btn-workout" onClick={handleSave}>
            + Add to Workout
          </button>
        </div>
      </div>

      <div className="exercise-content">
        <h2>{exercise.name}</h2>
        <p>
          This exercise targets the{' '}
          {exercise.muscleGroup ? exercise.muscleGroup.toLowerCase() : 'target area'} and helps build strength and definition.
        </p>

        <h4>How to perform</h4>
        <ol>
          {exercise.instructions && exercise.instructions.length > 0 ? (
            exercise.instructions.map((step, index) => <li key={index}>{step}</li>)
          ) : (
            <li>No instructions available.</li>
          )}
        </ol>
      </div>
    </div>
  );
};

export default ExerciseDetail;
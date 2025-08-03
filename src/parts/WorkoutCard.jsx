import { useNavigate } from 'react-router-dom';

export default function WorkoutCard({ workout }) {
  const navigate = useNavigate();

  return (
    <div className="workout-card" onClick={() => navigate(`/workouts/${workout._id}`)}>
      <h3>{workout.name}</h3>
      <p>{workout.exercises.length} exercises</p>
      <div className="workout-meta">
        <span>{workout.duration} mins</span>
        <span>{workout.difficulty}</span>
      </div>
    </div>
  );
}
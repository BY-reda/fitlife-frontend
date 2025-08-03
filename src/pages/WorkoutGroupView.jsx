// src/pages/WorkoutGroupView.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../css/WorkoutGroupView.css';
import api from '../api/client';  

const mockGroups = {
  "abs": {
    "name": "Abdos",
    "exercises": [
      {
        "id": "abs1",
        "name": "Crunches",
        "image": "/workouts/abdos/crunches.png",
        "description": "A classic core exercise that targets the abdominal muscles by lifting the upper body towards the knees."
      },
      {
        "id": "abs2",
        "name": "Plank",
        "image": "/workouts/abdos/panks.png",
        "description": "A full-body isometric exercise that strengthens the core, shoulders, and glutes by maintaining a straight body line."
      }
    ]
  },
  "back": {
    "name": "Dorsaux",
    "exercises": [
      {
        "id": "back1",
        "name": "Pull-ups",
        "image": "/workouts/back/latspulldown.png",
        "description": "A compound upper body exercise that primarily targets the latissimus dorsi and rhomboids."
      },
      {
        "id": "back2",
        "name": "Bent-over Rows",
        "image": "/workouts/back/over row.png",
        "description": "A pulling exercise that strengthens the middle and upper back muscles using dumbbells or barbells."
      }
    ]
  },
  "biceps": {
    "name": "Biceps",
    "exercises": [
      {
        "id": "biceps1",
        "name": "Bicep Curls",
        "image": "/workouts/biceps/curl.png",
        "description": "A classic isolation exercise that targets the biceps brachii using dumbbells or barbells."
      },
      {
        "id": "biceps2",
        "name": "Hammer Curls",
        "image": "/workouts/biceps/hammer.png",
        "description": "A variation of bicep curls with a neutral grip that also targets the brachialis and forearms."
      }
    ]
  },
  "calves": {
    "name": "Mollet",
    "exercises": [
      {
        "id": "calves1",
        "name": "Calf Raises",
        "image": "/workouts/mollets/raise.png",
        "description": "A simple exercise that targets the gastrocnemius and soleus muscles by rising up on the toes."
      },
      {
        "id": "calves2",
        "name": "Seated Calf Raises",
        "image": "/workouts/mollets/seated.png",
        "description": "A seated variation that primarily targets the soleus muscle of the calves."
      }
    ]
  },
  "chest": {
    "name": "Poitrine",
    "exercises": [
      {
        "id": "chest1",
        "name": "Push-ups",
        "image": "/workouts/chest/benchpress.png",
        "description": "A bodyweight exercise that targets the pectorals, shoulders, and triceps."
      },
      {
        "id": "chest2",
        "name": "Bench Press",
        "image": "/workouts/chest/pushups.png",
        "description": "A compound exercise using a barbell or dumbbells to build chest strength and mass."
      }
    ]
  },
  "shoulders": {
    "name": "Épaules",
    "exercises": [
      {
        "id": "shoulders1",
        "name": "Shoulder Press",
        "image": "/workouts/shoulders/press shoulder.png",
        "description": "A compound exercise that targets all three heads of the deltoids using dumbbells or barbells."
      },
      {
        "id": "shoulders2",
        "name": "Lateral Raises",
        "image": "/workouts/shoulders/lateral raise.png",
        "description": "An isolation exercise that specifically targets the middle deltoids using dumbbells."
      }
    ]
  },
  "triceps": {
    "name": "Triceps",
    "exercises": [
      {
        "id": "triceps1",
        "name": "Tricep Dips",
        "image": "/workouts/triceps/dips.png",
        "description": "A bodyweight exercise that targets the triceps using parallel bars or a bench."
      },
      {
        "id": "triceps2",
        "name": "Tricep Extensions",
        "image": "/workouts/triceps/extention.png",
        "description": "An isolation exercise that targets the triceps using dumbbells or cables overhead."
      }
    ]
  },
  "legs": {
    "name": "Jambes",
    "exercises": [
      {
        "id": "legs1",
        "name": "Squats",
        "image": "/workouts/jambes/squat.png",
        "description": "A compound exercise that targets the quadriceps, glutes, and hamstrings."
      },
      {
        "id": "legs2",
        "name": "Lunges",
        "image": "/workouts/jambes/lungs.png",
        "description": "A unilateral exercise that targets the quadriceps, glutes, and improves balance."
      }
    ]
  }
};

// Alternative with more specific exercise images from Pexels
const mockGroupsWithRealImages = {
  "abs": {
    "name": "Abdos",
    "exercises": [
      {
        "id": "abs1",
        "name": "Crunches",
        "image": "https://images.pexels.com/photos/1552249/pexels-photo-1552249.jpeg?auto=compress&cs=tinysrgb&w=500&h=400&fit=crop",
        "description": "A classic core exercise that targets the abdominal muscles by lifting the upper body towards the knees."
      },
      {
        "id": "abs2",
        "name": "Plank",
        "image": "https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=500&h=400&fit=crop",
        "description": "A full-body isometric exercise that strengthens the core, shoulders, and glutes by maintaining a straight body line."
      }
    ]
  },
  "back": {
    "name": "Dorsaux",
    "exercises": [
      {
        "id": "back1",
        "name": "Pull-ups",
        "image": "https://images.pexels.com/photos/1229356/pexels-photo-1229356.jpeg?auto=compress&cs=tinysrgb&w=500&h=400&fit=crop",
        "description": "A compound upper body exercise that primarily targets the latissimus dorsi and rhomboids."
      },
      {
        "id": "back2",
        "name": "Bent-over Rows",
        "image": "https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&cs=tinysrgb&w=500&h=400&fit=crop",
        "description": "A pulling exercise that strengthens the middle and upper back muscles using dumbbells or barbells."
      }
    ]
  },
  "biceps": {
    "name": "Biceps",
    "exercises": [
      {
        "id": "biceps1",
        "name": "Bicep Curls",
        "image": "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=500&h=400&fit=crop",
        "description": "A classic isolation exercise that targets the biceps brachii using dumbbells or barbells."
      },
      {
        "id": "biceps2",
        "name": "Hammer Curls",
        "image": "https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=500&h=400&fit=crop",
        "description": "A variation of bicep curls with a neutral grip that also targets the brachialis and forearms."
      }
    ]
  },
  "calves": {
    "name": "Mollet",
    "exercises": [
      {
        "id": "calves1",
        "name": "Calf Raises",
        "image": "https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg?auto=compress&cs=tinysrgb&w=500&h=400&fit=crop",
        "description": "A simple exercise that targets the gastrocnemius and soleus muscles by rising up on the toes."
      },
      {
        "id": "calves2",
        "name": "Seated Calf Raises",
        "image": "https://images.pexels.com/photos/4162451/pexels-photo-4162451.jpeg?auto=compress&cs=tinysrgb&w=500&h=400&fit=crop",
        "description": "A seated variation that primarily targets the soleus muscle of the calves."
      }
    ]
  },
  "chest": {
    "name": "Poitrine",
    "exercises": [
      {
        "id": "chest1",
        "name": "Push-ups",
        "image": "https://images.pexels.com/photos/416809/pexels-photo-416809.jpeg?auto=compress&cs=tinysrgb&w=500&h=400&fit=crop",
        "description": "A bodyweight exercise that targets the pectorals, shoulders, and triceps."
      },
      {
        "id": "chest2",
        "name": "Bench Press",
        "image": "https://images.pexels.com/photos/1552103/pexels-photo-1552103.jpeg?auto=compress&cs=tinysrgb&w=500&h=400&fit=crop",
        "description": "A compound exercise using a barbell or dumbbells to build chest strength and mass."
      }
    ]
  },
  "shoulders": {
    "name": "Épaules",
    "exercises": [
      {
        "id": "shoulders1",
        "name": "Shoulder Press",
        "image": "https://images.pexels.com/photos/1552238/pexels-photo-1552238.jpeg?auto=compress&cs=tinysrgb&w=500&h=400&fit=crop",
        "description": "A compound exercise that targets all three heads of the deltoids using dumbbells or barbells."
      },
      {
        "id": "shoulders2",
        "name": "Lateral Raises",
        "image": "https://images.pexels.com/photos/1552244/pexels-photo-1552244.jpeg?auto=compress&cs=tinysrgb&w=500&h=400&fit=crop",
        "description": "An isolation exercise that specifically targets the middle deltoids using dumbbells."
      }
    ]
  },
  "triceps": {
    "name": "Triceps",
    "exercises": [
      {
        "id": "triceps1",
        "name": "Tricep Dips",
        "image": "https://images.pexels.com/photos/4162438/pexels-photo-4162438.jpeg?auto=compress&cs=tinysrgb&w=500&h=400&fit=crop",
        "description": "A bodyweight exercise that targets the triceps using parallel bars or a bench."
      },
      {
        "id": "triceps2",
        "name": "Tricep Extensions",
        "image": "https://images.pexels.com/photos/4162440/pexels-photo-4162440.jpeg?auto=compress&cs=tinysrgb&w=500&h=400&fit=crop",
        "description": "An isolation exercise that targets the triceps using dumbbells or cables overhead."
      }
    ]
  },
  "legs": {
    "name": "Jambes",
    "exercises": [
      {
        "id": "legs1",
        "name": "Squats",
        "image": "https://images.pexels.com/photos/1552100/pexels-photo-1552100.jpeg?auto=compress&cs=tinysrgb&w=500&h=400&fit=crop",
        "description": "A compound exercise that targets the quadriceps, glutes, and hamstrings."
      },
      {
        "id": "legs2",
        "name": "Lunges",
        "image": "https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg?auto=compress&cs=tinysrgb&w=500&h=400&fit=crop",
        "description": "A unilateral exercise that targets the quadriceps, glutes, and improves balance."
      }
    ]
  }
};

const WorkoutGroupView = () => {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [catalogExercises, setCatalogExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set mock group data immediately for quick UI
    setGroup(mockGroups[groupId]);

    // Fetch catalog exercises for this muscle group from backend
    const fetchCatalogExercises = async () => {
      try {
        setLoading(true);
        const res = await api.get('/catalog-exercises');
        // Filter catalog exercises by muscleGroup == groupId (assuming groupId matches muscleGroup string)
        const filteredCatalog = res.data.filter(
          (ex) => ex.muscleGroup.toLowerCase() === groupId.toLowerCase()
        );
        setCatalogExercises(filteredCatalog);
      } catch (err) {
        console.error('Erreur fetching catalog exercises:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalogExercises();
  }, [groupId]);

  if (!group) return <div>Loading group data...</div>;

  return (
    <div className="workout-group-container">
      <h2>{group.name} Exercises</h2>

      <div className="exercise-grid">
        {/* Show mock exercises first */}
        {group.exercises.map((exercise) => (
          <Link
            to={`/app/exercise/${exercise.id}`}
            key={`mock-${exercise.id}`}
            className="exercise-card"
          >
            <img src={exercise.image} alt={exercise.name} className="exercise-img" />
            <div className="exercise-info">
              <h3>{exercise.name}</h3>
              <p>{exercise.description}</p>
            </div>
          </Link>
        ))}

        {/* Show catalog exercises fetched from backend */}
        {loading ? (
          <p>Chargement des exercices du catalogue...</p>
        ) : (
          catalogExercises.map((ex) => (
            <Link
              to={`/app/exercise/catalog/${ex._id}`}  // different route for catalog exercises maybe
              key={`catalog-${ex._id}`}
              className="exercise-card"
            >
              {/* Use catalog image or fallback */}
              <img
                src={ex.image || '/default-exercise-image.png'}
                alt={ex.name}
                className="exercise-img"
              />
              <div className="exercise-info">
                <h3>{ex.name}</h3>
                <p>{ex.instructions?.[0] || 'Pas de description disponible.'}</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default WorkoutGroupView;
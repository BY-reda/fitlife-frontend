import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "../pages/Home";
import Workouts from "../pages/Workouts";
import WorkoutGroupView from "../pages/WorkoutGroupView";
import Profile from "../pages/Profile";
import Login from "../pages/Login";
import SignupForm from "../pages/Signup";
import ProtectedRoute from "../components/ProtectedRoute";
import Landing from "../pages/Landing";
import Nutrition from "../pages/Nutrition";
import Social from "../pages/Social";
import ExerciseDetail from "../pages/ExerciseDetail";
import User from "../pages/User";
import AdminProtectedRoute from '../hooks/AdminProtectedRoute';
import AdminExercises from "../pages/AdminExercises";
import AdminDashboard from "../pages/AdminDashboard";
import MealPlanPage from "../pages/MealPlanPage";
import ProgramCard from "../pages/beginnerPage";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
<Route
  path="/meal-plan"
  element={
    <ProtectedRoute>
      <MealPlanPage />
    </ProtectedRoute>
  }
/>
<Route
  path="/beginner"
  element={
    <ProtectedRoute>
      <ProgramCard />
    </ProtectedRoute>
  }
/>


        {/* Public Landing page */}
        <Route path="/" element={<Landing />} />

        {/* Public Auth Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupForm />} />

        {/* Admin routes protégées */}
        <Route
          path="admin"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="admin/exercises"
          element={
            <AdminProtectedRoute>
              <AdminExercises />
            </AdminProtectedRoute>
          }
        />

        {/* Protected zone sous /app avec Layout */}
        <Route path="/app" element={<Layout />}>

          <Route
            index
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route
            path="user/:userId"
            element={
              <ProtectedRoute>
                <User />
              </ProtectedRoute>
            }
          />

          <Route
            path="workouts"
            element={
              <ProtectedRoute>
                <Workouts />
              </ProtectedRoute>
            }
          />

          <Route
            path="workouts/:groupId"
            element={
              <ProtectedRoute>
                <WorkoutGroupView />
              </ProtectedRoute>
            }
          />

          {/* Route standard pour exercice par ID */}
          <Route
            path="exercise/:id"
            element={
              <ProtectedRoute>
                <ExerciseDetail />
              </ProtectedRoute>
            }
          />

          {/* Nouvelle route pour exercice via catalog avec segment 'catalog' */}
          <Route
           path="exercise/catalog/:catalogId"
            element={
              <ProtectedRoute>
                <ExerciseDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="food"
            element={
              <ProtectedRoute>
                <Nutrition />
              </ProtectedRoute>
            }
          />

          <Route
            path="social"
            element={
              <ProtectedRoute>
                <Social />
              </ProtectedRoute>
            }
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

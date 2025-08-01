
import ReactDOM from "react-dom/client";
import { AuthProvider } from "./context/AuthContext";
import { WorkoutProvider } from "./context/WorkoutContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App";
import "./index.css";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <GoogleOAuthProvider clientId="809399988134-m76ngcvoe9usf8pnq0muam7uenijqpmj.apps.googleusercontent.com">
    <AuthProvider>
      <WorkoutProvider>
        <App />
      </WorkoutProvider>
    </AuthProvider>
  </GoogleOAuthProvider>
);



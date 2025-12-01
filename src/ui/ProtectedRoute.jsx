import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../features/authentication/useUser";
import Loader from "./Loader";

function ProtectedRoute({ children }) {
  // 1. Get user state from your custom hook
  const { isLoading, isAuthenticated } = useUser();
  const navigate = useNavigate();

  // 2. If NOT authenticated and NOT loading, redirect to login
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  // 3. While checking status, show a full-page spinner
  if (isLoading) return <Loader />;

  // 4. If authenticated, render the app pages
  if (isAuthenticated) return children;
}

export default ProtectedRoute;

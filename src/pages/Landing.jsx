// src/pages/Landing.jsx
import { useNavigate } from "react-router-dom";
import { useUser } from "../features/authentication/useUser";
import { useEffect } from "react";
import Logo from "../ui/Logo";

function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated } = useUser();

  // If user is ALREADY logged in, throw them to the dashboard
  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated, navigate]);
  console.log(isAuthenticated);

  return (
    <div className="bg-white">
      {/* Marketing Header */}
      <nav className="flex justify-between p-6">
        <Logo />
        <div className="flex gap-4">
          <button onClick={() => navigate("/login")}>Login</button>
          <button
            onClick={() => navigate("/signup")}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-white"
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="px-4 py-20 text-center">
        <h1 className="mb-6 text-5xl font-bold text-gray-900">
          Stop wondering where your money went.
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600">
          SpendSignature tracks your income and expenses, but goes further. Our
          AI detects unusual spending patterns to keep you financially safe.
        </p>
        <button
          onClick={() => navigate("/signup")}
          className="rounded-xl bg-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:bg-indigo-500"
        >
          Start Tracking for Free
        </button>
      </header>

      {/* Add screenshots or feature list below... */}
    </div>
  );
}

export default Landing;

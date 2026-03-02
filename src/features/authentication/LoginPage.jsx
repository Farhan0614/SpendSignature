import { useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import Logo from "../../ui/Logo"; // <-- Import Logo

function LoginPage({ mode }) {
  const navigate = useNavigate();

  function handleBack() {
    navigate(-1);
  }

  return (
    // 1. The Full Page Background
    <div className="flex min-h-dvh flex-col items-center justify-center bg-slate-50 p-4 sm:p-8">
      {/* 2. The Logo above the card */}
      <div className="mb-8 scale-110">
        <Logo />
      </div>

      {/* 3. The Premium Card Wrapper */}
      <div className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/40 sm:p-10">
        <LoginForm mode={mode} onBack={handleBack} />
      </div>
    </div>
  );
}

export default LoginPage;

import { useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";

function LoginPage({ mode }) {
  const navigate = useNavigate();
  function handleBack() {
    navigate(-1);
  }

  return (
    <div className="flex h-dvh items-center justify-center">
      <LoginForm mode={mode} onBack={handleBack} />
    </div>
  );
}

export default LoginPage;

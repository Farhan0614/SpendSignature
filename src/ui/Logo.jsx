import { useNavigate } from "react-router-dom";

function Logo() {
  const navigate = useNavigate();
  return (
    <div
      className="flex cursor-pointer items-center gap-2"
      onClick={() => navigate("/")}
    >
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-xl font-bold text-white">
          S
        </div>
        <p className="font-sans text-lg font-bold tracking-tight text-slate-900 dark:text-white">
          SpendSignature
        </p>
      </div>
    </div>
  );
}

export default Logo;

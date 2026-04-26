import { useNavigate } from "react-router-dom";

function Logo() {
  const navigate = useNavigate();
  return (
    <div
      className="flex cursor-pointer items-center gap-2"
      onClick={() => navigate("/")}
    >
      <div className="flex items-center gap-1">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg">
          <img src="/favicon.svg" alt="spendSignature Logo" />
        </div>
        <p className="font-sans text-lg font-bold tracking-tight text-slate-900 dark:text-white">
          SpendSignature
        </p>
      </div>
    </div>
  );
}

export default Logo;

// src/ui/Logo.jsx
function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-xl font-bold text-white">
        S
      </div>
      <p className="hidden font-sans text-lg font-bold tracking-tight text-slate-900 sm:block">
        SpendSignature
      </p>
    </div>
  );
}

export default Logo;

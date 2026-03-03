function LoginFormHeader({ mode }) {
  return (
    <div className="text-center">
      <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
        {mode === "login" ? "Login to your account" : "Create Your Account"}
      </h1>
      <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
        {" "}
        {/* Softened color, added margin */}
        {mode === "login"
          ? "Log in to manage your expenses and budgets"
          : "Sign up to start tracking your spending"}
      </p>
    </div>
  );
}

export default LoginFormHeader;

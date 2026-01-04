function LoginFormHeader({ mode }) {
  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold text-slate-900">
        {mode === "login" ? "Login to your account" : "Create Your Account"}
      </h1>
      <p className="mt-1 text-slate-600">
        {mode === "login"
          ? "Log in to manage your expenses and budgets"
          : "Sign up to start tracking your spending"}
      </p>
    </div>
  );
}

export default LoginFormHeader;

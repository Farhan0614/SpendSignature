import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginFormHeader from "./LoginFormHeader";
import { useSignup } from "./useSignup";
import LoaderMini from "../../ui/LoaderMini";
import { useLogin } from "./useLogin";

function LoginForm({ mode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { signup, isLoading: isLoading1 } = useSignup();
  const { login, isLoading: isLoading2 } = useLogin();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) return;
    if (mode === "signup")
      signup(
        { email, password },
        {
          onSuccess: () => {
            navigate("/dashboard");
          },
        },
      );
    if (mode === "login") {
      login({ email, password });
    }
    // if (!mode === "login") signup({ email, password });
    setEmail("");
    setPassword("");
  }

  return (
    <div className="flex w-sm flex-col items-center gap-6">
      <LoginFormHeader mode={mode} />

      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-6 font-sans"
      >
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="focus:ring-opacity-50 rounded-lg border border-slate-300 bg-white px-4 py-3 font-sans text-lg focus:ring focus:ring-indigo-500 focus:outline-none"
          type="email"
          placeholder="example@gmail.com"
          required
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="focus:ring-opacity-50 rounded-lg border border-slate-300 bg-white px-4 py-3 font-sans text-lg focus:ring focus:ring-indigo-500 focus:outline-none"
          type="password"
          placeholder="Password"
          required
        />

        <div className="mt-2 flex flex-col gap-3">
          <button className="flex cursor-pointer items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 font-sans font-bold text-white transition-all duration-300 hover:bg-indigo-500 focus:ring focus:ring-indigo-400 focus:ring-offset-1 focus:outline-none">
            {isLoading1 || isLoading2 ? (
              <LoaderMini />
            ) : mode === "login" ? (
              "Sign In"
            ) : (
              "Sign Up"
            )}
          </button>

          <button
            type="button"
            className="rounded-[8px] border border-slate-300 bg-white px-6 py-3 font-sans font-bold text-slate-700 transition-all duration-300 hover:bg-slate-100"
          >
            Continue with Google
          </button>

          <div className="text-center text-sm text-slate-600">
            {mode === "login" ? (
              <p>
                Need an account?
                <button
                  type="button"
                  onClick={() => navigate("/signup")}
                  className="font-bold text-indigo-600 hover:underline"
                >
                  Sign Up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="font-bold text-indigo-600 hover:underline"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;

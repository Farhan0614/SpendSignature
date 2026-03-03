import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import LoginFormHeader from "./LoginFormHeader";
import { useSignup } from "./useSignup";
import LoaderMini from "../../ui/LoaderMini";
import { useLogin } from "./useLogin";
import FormInput from "../../ui/FormInput";
import Button from "../../ui/Button";

function LoginForm({ mode }) {
  const navigate = useNavigate();

  const { signup, isLoading: isLoading1 } = useSignup();
  const { login, isLoading: isLoading2 } = useLogin();

  const isWorking = isLoading1 || isLoading2;

  // 1. Setup React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, submitCount },
  } = useForm();

  // 2. Toast Notifications for Errors (with IDs to prevent stacking)
  useEffect(() => {
    if (submitCount > 0) {
      if (errors?.email?.message)
        toast.error(errors.email.message, { id: "email-err" });
      if (errors?.password?.message)
        toast.error(errors.password.message, { id: "pass-err" });
    }
  }, [errors, submitCount]);

  // 3. Form Submit Handler
  function onSubmit(data) {
    if (mode === "signup") {
      signup(
        { email: data.email, password: data.password },
        {
          onSuccess: () => {
            reset();
            navigate("/dashboard");
          },
        },
      );
    }
    if (mode === "login") {
      login(
        { email: data.email, password: data.password },
        { onSuccess: () => reset() },
      );
    }
  }

  // Toggle handler to clear errors when switching modes
  function toggleMode(newMode) {
    reset(); // Clears inputs and errors
    navigate(`/${newMode}`);
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <LoginFormHeader mode={mode} />

      {/* Added noValidate to block default browser popups */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex w-full flex-col gap-5"
      >
        <FormInput
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          disabled={isWorking}
          autoComplete="email"
          register={register("email", {
            required: "Email address is required",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Please provide a valid email address",
            },
          })}
        />

        <FormInput
          label="Password"
          type="password"
          placeholder="••••••••"
          disabled={isWorking}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          register={register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
        />

        <div className="mt-4 flex flex-col gap-4">
          <Button
            type="submit"
            variant="primary"
            disabled={isWorking}
            className="w-full py-3 text-base"
          >
            {isWorking ? (
              <LoaderMini />
            ) : mode === "login" ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </Button>

          <div className="text-center text-sm font-medium text-slate-500 dark:text-slate-400">
            {mode === "login" ? (
              <p>
                Need an account?{" "}
                <button
                  type="button"
                  onClick={() => toggleMode("signup")}
                  className="cursor-pointer font-bold text-indigo-600 transition-colors hover:text-indigo-700 hover:underline focus:outline-none dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  Sign Up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => toggleMode("login")}
                  className="cursor-pointer font-bold text-indigo-600 transition-colors hover:text-indigo-700 hover:underline focus:outline-none dark:text-indigo-400 dark:hover:text-indigo-300"
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

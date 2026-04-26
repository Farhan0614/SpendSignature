import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HiArrowTrendingUp,
  HiBanknotes,
  HiBolt,
  HiChartBarSquare,
  HiShieldCheck,
  HiSparkles,
} from "react-icons/hi2";
import { useUser } from "../features/authentication/useUser";
import PublicThemeToggle from "../ui/PublicThemeToggle";

const features = [
  {
    icon: HiBanknotes,
    title: "Track income and expenses beautifully",
    text: "Log transactions in seconds with a clean flow that feels simple even when your data grows.",
  },
  {
    icon: HiShieldCheck,
    title: "Catch unusual spending earlier",
    text: "Your anomaly engine flags out-of-pattern activity before it quietly becomes a bad habit.",
  },
  {
    icon: HiChartBarSquare,
    title: "Read the story behind your money",
    text: "Use category breakdowns, trend views, and timeline summaries to understand real movement.",
  },
  {
    icon: HiArrowTrendingUp,
    title: "Forecast what comes next",
    text: "Get AI-backed future signals so your app helps you plan, not just record.",
  },
];

function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated } = useUser();

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen overflow-hidden bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-[-6rem] left-[-3rem] h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl dark:bg-indigo-500/25" />
        <div className="absolute top-[10rem] right-[-5rem] h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl dark:bg-fuchsia-500/15" />
        <div className="absolute bottom-[-5rem] left-[20%] h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl dark:bg-cyan-500/15" />
      </div>

      <div className="relative z-10">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl shadow-lg shadow-indigo-500/30">
              <img src="/favicon.svg" alt="logo of spendsignature" />
            </div>
            <div>
              <p className="text-lg font-black tracking-tight">
                SpendSignature
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                AI-powered expense intelligence
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <PublicThemeToggle />
            <button
              onClick={() => navigate("/login")}
              className="cursor-pointer rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="cursor-pointer rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:-translate-y-0.5 hover:bg-indigo-500"
            >
              Get Started
            </button>
          </div>
        </nav>

        <section className="mx-auto grid max-w-7xl items-center gap-14 px-4 pt-10 pb-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:pt-16 lg:pb-28">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm text-indigo-700 shadow-sm dark:border-indigo-400/20 dark:bg-indigo-500/10 dark:text-indigo-200">
              <HiSparkles className="h-4 w-4" />
              Smart tracking, anomaly alerts, and forecasting
            </div>

            <h1 className="max-w-3xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Stop guessing where your money goes.
              <span className="mt-2 block bg-gradient-to-r from-indigo-600 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent dark:from-indigo-400 dark:via-fuchsia-400 dark:to-cyan-300">
                Start reading its pattern.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              SpendSignature helps you track spending, manage income, detect
              unusual behavior, and understand your financial direction through
              a calm, premium interface.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <button
                onClick={() => navigate("/signup")}
                className="inline-flex cursor-pointer items-center justify-center rounded-2xl bg-indigo-600 px-6 py-4 text-base font-bold text-white shadow-xl shadow-indigo-500/30 transition hover:-translate-y-1 hover:bg-indigo-500"
              >
                Start Tracking Free
              </button>

              <button
                onClick={() => navigate("/login")}
                className="inline-flex cursor-pointer items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-4 text-base font-bold text-slate-800 shadow-sm transition hover:-translate-y-1 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                I already have an account
              </button>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-4">
              {[
                ["AI", "spending insights"],
                ["Live", "expense overview"],
                ["Clean", "modern workflow"],
              ].map(([title, text]) => (
                <div
                  key={title}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                >
                  <p className="text-2xl font-black">{title}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-r from-indigo-500/10 via-fuchsia-500/5 to-cyan-500/10 blur-2xl dark:from-indigo-500/20 dark:via-fuchsia-500/10 dark:to-cyan-500/20" />
            <div className="relative rounded-[2rem] border border-slate-200 bg-white/90 p-5 shadow-2xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Current balance
                    </p>
                    <h2 className="mt-1 text-3xl font-black">$8,420</h2>
                  </div>
                  <div className="rounded-2xl bg-emerald-500/15 px-3 py-2 text-sm font-bold text-emerald-600 dark:text-emerald-300">
                    +12.4%
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                    <p className="text-xs tracking-[0.2em] text-slate-500 uppercase">
                      Monthly spend
                    </p>
                    <p className="mt-2 text-2xl font-bold">$1,240</p>
                    <div className="mt-4 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                      <div className="h-2 w-[58%] rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400" />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                    <p className="text-xs tracking-[0.2em] text-slate-500 uppercase">
                      AI alert score
                    </p>
                    <p className="mt-2 text-2xl font-bold">Low risk</p>
                    <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                      No unusual activity detected this week
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="font-semibold">Forecast outlook</p>
                    <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-300">
                      <HiBolt className="h-4 w-4" />
                      <span className="text-sm font-medium">AI summary</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      [
                        "Expected saving trend",
                        "Improving",
                        "text-emerald-600 dark:text-emerald-300",
                      ],
                      [
                        "Top spend category",
                        "Food & Dining",
                        "text-amber-600 dark:text-amber-300",
                      ],
                      [
                        "Runway insight",
                        "Healthy",
                        "text-cyan-600 dark:text-cyan-300",
                      ],
                    ].map(([label, value, color]) => (
                      <div
                        key={label}
                        className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-3 dark:bg-white/5"
                      >
                        <span className="text-slate-600 dark:text-slate-300">
                          {label}
                        </span>
                        <span className={`font-bold ${color}`}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-sm font-bold tracking-[0.3em] text-indigo-600 uppercase dark:text-indigo-300">
              Why SpendSignature
            </p>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Built for clarity, not clutter
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-600 dark:text-slate-400">
              The goal is not just to store transactions. It is to help people
              understand behavior, reduce noise, and make better decisions.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500/30"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-300 dark:group-hover:bg-indigo-500/20">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                    {feature.text}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-indigo-200 bg-gradient-to-r from-indigo-50 via-white to-cyan-50 p-8 shadow-xl dark:border-indigo-400/20 dark:from-indigo-600/20 dark:via-slate-900/80 dark:to-fuchsia-600/10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-bold tracking-[0.3em] text-indigo-600 uppercase dark:text-indigo-300">
                  Ready to begin
                </p>
                <h3 className="mt-3 text-3xl font-black">
                  Give your spending a signature.
                </h3>
                <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
                  Track smarter, detect anomalies earlier, and build a more
                  confident money routine with SpendSignature.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => navigate("/signup")}
                  className="cursor-pointer rounded-2xl bg-indigo-600 px-6 py-4 font-bold text-white transition hover:-translate-y-1 hover:bg-indigo-500"
                >
                  Create account
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="cursor-pointer rounded-2xl border border-slate-200 bg-white px-6 py-4 font-bold text-slate-800 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-slate-200 px-4 py-8 text-sm text-slate-500 sm:px-6 lg:px-8 dark:border-slate-800 dark:text-slate-400">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} SpendSignature. All rights reserved.
            </p>
            <div className="flex items-center gap-5">
              <Link
                to="/privacy"
                className="transition hover:text-indigo-600 dark:hover:text-white"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="transition hover:text-indigo-600 dark:hover:text-white"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Landing;

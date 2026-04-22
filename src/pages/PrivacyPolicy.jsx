import { Link } from "react-router-dom";
import PublicThemeToggle from "../ui/PublicThemeToggle";

const sections = [
  {
    title: "Information We Collect",
    body: [
      "We may collect account details such as email address, authentication data, and profile preferences.",
      "We may also store the financial information you choose to enter, including expenses, income entries, categories, notes, dates, and forecasting-related activity.",
      "Limited technical information may be collected for reliability, diagnostics, and security.",
    ],
  },
  {
    title: "How We Use Information",
    body: [
      "We use your information to provide expense tracking, insights, forecasting, anomaly detection, personalization, and account management.",
      "Operational logs may be used to monitor performance, investigate bugs, and prevent misuse.",
    ],
  },
  {
    title: "Data Storage and Security",
    body: [
      "Data may be stored using third-party infrastructure and service providers.",
      "We take reasonable steps to protect user data, but no storage or transmission method is completely secure.",
      "You are responsible for maintaining the security of your account credentials.",
    ],
  },
  {
    title: "AI and Forecasting Disclaimer",
    body: [
      "AI-generated summaries, forecasts, and anomaly alerts are informational only.",
      "They do not constitute financial, tax, legal, investment, or accounting advice.",
    ],
  },
  {
    title: "Your Choices",
    body: [
      "You may update certain profile information inside the application.",
      "You may request deletion of your account or personal data subject to platform capability and applicable law.",
    ],
  },
  {
    title: "Contact",
    body: [
      "If you have questions about this Privacy Policy, provide a real support email or legal contact here before production launch.",
    ],
  },
];

function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white">
      <div className="border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-lg font-black text-white">
              S
            </div>
            <div>
              <p className="font-bold tracking-tight">SpendSignature</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Privacy Policy
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <PublicThemeToggle />
            <Link
              to="/"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              Home
            </Link>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-bold tracking-[0.25em] text-indigo-600 uppercase dark:text-indigo-400">
            Legal
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-4 max-w-3xl text-slate-600 dark:text-slate-400">
            This page explains how SpendSignature collects, uses, stores, and
            protects information when you use the application.
          </p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Last updated: April 22, 2026
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {sections.map((section) => (
            <section
              key={section.title}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <h2 className="text-xl font-black">{section.title}</h2>
              <div className="mt-4 space-y-3 text-slate-700 dark:text-slate-300">
                {section.body.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}

export default PrivacyPolicy;

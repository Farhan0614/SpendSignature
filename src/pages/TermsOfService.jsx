import { Link } from "react-router-dom";
import PublicThemeToggle from "../ui/PublicThemeToggle";

const sections = [
  {
    title: "1. Acceptance of Terms",
    body: [
      "By accessing or using SpendSignature, you agree to be bound by these Terms of Service and all applicable laws and regulations.",
      "If you do not agree with any of these terms, you are prohibited from using or accessing this site.",
    ],
  },
  {
    title: "2. Description of Service",
    body: [
      "SpendSignature provides personal finance tracking features including expense logging, income management, data analytics, AI-powered anomaly alerts, and financial forecasting.",
      "We reserve the right to modify, improve, or remove features at any time without prior notice to enhance the user experience.",
    ],
  },
  {
    title: "3. User Accounts & Responsibilities",
    body: [
      "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.",
      "You agree to provide accurate, current, and complete information during the registration process and to keep such information updated.",
      "Misuse of the service, including attempts at unauthorized access, data scraping, or interference with platform security, will result in immediate account termination.",
    ],
  },
  {
    title: "4. AI & Forecasting Disclaimer",
    body: [
      "SpendSignature utilizes Artificial Intelligence (AI) to generate summaries, detect anomalies, and provide 3-month financial forecasts.",
      "These outputs are for informational and educational purposes only. They do not constitute professional financial, investment, legal, tax, or accounting advice.",
      "We do not guarantee the 100% accuracy of AI predictions. Users should make financial decisions based on their own judgment or with the help of a certified professional.",
    ],
  },
  {
    title: "5. Intellectual Property",
    body: [
      "The SpendSignature name, logo, software code, and original content are the exclusive property of SpendSignature and its licensors.",
      "You may not reproduce, distribute, or create derivative works from any part of the application without express written permission.",
    ],
  },
  {
    title: "6. Limitation of Liability",
    body: [
      "To the maximum extent permitted by law, SpendSignature shall not be liable for any indirect, incidental, special, or consequential damages resulting from your use of the service.",
      "This includes, but is not limited to, loss of profits, data loss, or financial setbacks occurring while using the application.",
    ],
  },
  {
    title: "7. Changes to Terms",
    body: [
      "We reserve the right to revise these terms at any time. By continuing to use the application after changes are made, you agree to be bound by the revised Terms of Service.",
    ],
  },
  {
    title: "8. Contact Information",
    body: [
      "If you have any questions regarding these Terms, please contact our legal team at: legal@spendsignature.com.",
    ],
  },
];

function TermsOfService() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white">
      {/* Header / Navigation */}
      <div className="border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-lg font-black text-white">
              S
            </div>
            <div>
              <p className="font-bold tracking-tight">SpendSignature</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Terms of Service
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
        {/* Intro Hero Section */}
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-bold tracking-[0.25em] text-indigo-600 uppercase dark:text-indigo-400">
            Agreement
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight">
            Terms of Service
          </h1>
          <p className="mt-4 max-w-3xl text-slate-600 dark:text-slate-400">
            Please read these terms carefully before using SpendSignature. These
            terms establish a legally binding agreement between you and our
            platform.
          </p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Last updated: April 22, 2026
          </p>
        </div>

        {/* Dynamic Sections */}
        <div className="mt-8 space-y-6 pb-20">
          {sections.map((section) => (
            <section
              key={section.title}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                {section.title}
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                {section.body.map((item, index) => (
                  <p key={index}>{item}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}

export default TermsOfService;

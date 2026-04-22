import { HiMoon, HiSun } from "react-icons/hi2";
import { useDarkMode } from "../context/DarkModeContext";

function PublicThemeToggle() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      type="button"
      onClick={toggleDarkMode}
      aria-label="Toggle theme"
      className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl border border-slate-200 bg-white/80 text-slate-700 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:bg-slate-900"
    >
      {isDarkMode ? (
        <HiSun className="h-5 w-5" />
      ) : (
        <HiMoon className="h-5 w-5" />
      )}
    </button>
  );
}

export default PublicThemeToggle;

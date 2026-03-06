import Logo from "./Logo";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
        {/* Left: Branding */}
        <div className="flex justify-center md:justify-start">
          {/* If Logo has text, you might want a simpler version here, or just text */}
          <span className="text-lg font-bold text-slate-400 dark:text-slate-600">
            SpendSignature
          </span>
        </div>

        {/* Right: Copyright */}
        <div className="mt-8 md:order-1 md:mt-0">
          <p className="text-center text-xs leading-5 text-slate-400 dark:text-slate-600">
            &copy; {currentYear} SpendSignature. All rights reserved.
          </p>
        </div>

        {/* Center/Right: Links */}
        <div className="mt-4 flex justify-center space-x-6 md:order-2 md:mt-0 md:ml-4">
          <a
            href="#"
            className="text-sm text-slate-400 hover:text-slate-500 dark:text-slate-600 dark:hover:text-slate-400"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="text-sm text-slate-400 hover:text-slate-500 dark:text-slate-600 dark:hover:text-slate-400"
          >
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

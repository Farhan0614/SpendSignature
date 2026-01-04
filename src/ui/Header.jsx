import { useState } from "react";
import { HiBars3, HiXMark } from "react-icons/hi2";
import Logo from "./Logo";
import { useLogout } from "../features/authentication/useLogout";
import { useUser } from "../features/authentication/useUser";
import NavBar from "./NavBar";
import UserMenu from "./UserMenu";
import MobileMenu from "./MobileMenu";

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout, isLoading } = useLogout();
  const { user } = useUser();

  const handleLogout = () => {
    logout();
  };

  return (
    // Sticky header with glassmorphism effect
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* --- LEFT: LOGO --- */}
        <Logo />
        {/* --- MIDDLE: DESKTOP NAVIGATION --- */}
        <NavBar />
        {/* --- RIGHT: USER & LOGOUT --- */}
        <UserMenu />

        {/* --- MOBILE MENU BUTTON --- */}
        <div className="flex md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-slate-600 hover:text-indigo-600 focus:outline-none"
          >
            {isMobileMenuOpen ? (
              <HiXMark className="h-7 w-7" />
            ) : (
              <HiBars3 className="h-7 w-7" />
            )}
          </button>
        </div>
      </div>

      {/* --- MOBILE NAVIGATION DROPDOWN --- */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        setIsOpen={setIsMobileMenuOpen}
        user={user}
        logout={handleLogout}
        isLoading={isLoading}
      />
    </header>
  );
}

export default Header;

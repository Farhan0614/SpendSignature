import NavItem from "./NavItem";

function NavBar() {
  return (
    // 1. Added padding (p-1.5)
    // 2. Added background (bg-slate-100/50) for the track
    // 3. Added border for definition
    <nav className="hidden items-center gap-1 rounded-full border border-slate-200/60 bg-slate-100/50 p-1.5 md:flex dark:border-slate-800 dark:bg-slate-900/50">
      <NavItem to="/dashboard">Dashboard</NavItem>
      <NavItem to="/wallet">Wallet</NavItem>
      <NavItem to="/category">Categories</NavItem>
      <NavItem to="/expense">Expenses</NavItem>
      <NavItem to="/settings">Settings</NavItem>
    </nav>
  );
}

export default NavBar;

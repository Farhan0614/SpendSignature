import NavItem from "./NavItem";

function NavBar() {
  return (
    <nav className="hidden items-center gap-1 md:flex">
      <NavItem to="/dashboard">Dashboard</NavItem>
      <NavItem to="/wallet">Wallet</NavItem>
      <NavItem to="/category">Categories</NavItem>
      <NavItem to="/expense">Expenses</NavItem>
      <NavItem to="/settings">Settings</NavItem>
    </nav>
  );
}

export default NavBar;

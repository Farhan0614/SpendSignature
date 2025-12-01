import { HiBriefcase, HiHome, HiMiniTag } from "react-icons/hi2";

import { IoIosWallet } from "react-icons/io";

import SideBarNavLink from "./SideBarNavLink";

import { IoSettingsSharp } from "react-icons/io5";

function SideBarNav() {
  return (
    <ul className="flex flex-col gap-4">
      <SideBarNavLink to="/dashboard">
        <HiHome />

        <span>Dashboard</span>
      </SideBarNavLink>

      <SideBarNavLink to="/wallet">
        <HiBriefcase />

        <span>My Wallet</span>
      </SideBarNavLink>

      <SideBarNavLink to="/category">
        <HiMiniTag />

        <span>Category</span>
      </SideBarNavLink>

      <SideBarNavLink to="/expense">
        <IoIosWallet />

        <span>Expenses</span>
      </SideBarNavLink>

      <SideBarNavLink to="/settings">
        <IoSettingsSharp />

        <span>Settings</span>
      </SideBarNavLink>
    </ul>
  );
}

export default SideBarNav;

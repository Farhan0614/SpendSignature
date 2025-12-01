import Logo from "./Logo";

import SideBarNav from "./SideBarNav";

function SideBar() {
  return (
    <div className="row-span-full flex flex-col items-center gap-20 border-r border-gray-100">
      <Logo />

      <SideBarNav />
    </div>
  );
}

export default SideBar;

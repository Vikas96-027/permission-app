import { Bell, Search, Settings } from "lucide-react";

const Header = () => {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex h-11 items-center justify-between bg-[#004a94] px-4 text-white">
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold">LO</span>
        <span className="text-sm font-semibold">PermissionHub</span>
        <span className="text-[10px] tracking-wide text-white/70">
          CONFIGURATOR
        </span>
      </div>
      <div className="flex items-center gap-4">
        <Search size={16} className="cursor-pointer" />
        <Bell size={16} className="cursor-pointer" />
        <Settings size={16} className="cursor-pointer" />
        <span className="text-white/200">|</span>
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-[11px] font-semibold">
          AD
        </div>
        <span className="text-sm font-medium">Admin</span>
      </div>
    </header>
  );
};

export default Header;

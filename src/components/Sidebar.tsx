import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  ChevronDown,
  ChevronRight,
  Folder,
  GitBranch,
  LayoutDashboard,
  MapPin,
  Shield,
  Users,
} from "lucide-react";

const managementItems = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Users", to: "/users", icon: Users },
  { label: "Groups", to: "/groups", icon: Users },
  { label: "Roles", to: "/roles", icon: Shield },
  { label: "Heirarchy", to: "/heirarchy", icon: GitBranch },
];

const configurationItems = [
  { label: "Resources", to: "/resources", icon: Folder },
  { label: "Locations", to: "/locations", icon: MapPin },
];

const linkClass = ({
  isActive,
}: {
  isActive: boolean;
}) => `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors 
${isActive ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white"}`;

const sectionButtonClass =
  "group flex w-full cursor-pointer items-center justify-between bg-transparent px-4 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40 transition-colors hover:bg-white/5 hover:text-white/60 focus:outline-none active:bg-transparent";
const sectionIconClass =
  "h-4 w-4 shrink-0 cursor-pointer text-white/40 transition-colors group-hover:text-white/60";

const Sidebar = () => {
  const { pathname } = useLocation();
  const [managementOpen, setManagementOpen] = useState(true);
  const [configurationOpen, setConfigurationOpen] = useState(true);

  useEffect(() => {
    if (managementItems.some((item) => item.to === pathname))
      setManagementOpen(true);

    if (configurationItems.some((item) => item.to === pathname))
      setConfigurationOpen(true);
  }, [pathname]);

  const renderLinks = (items: typeof managementItems) =>
    items.map(({ label, to, icon: Icon }) => (
      <NavLink key={to} to={to} className={linkClass}>
        <Icon size={16} className="shrink-0" />
        <span>{label}</span>
      </NavLink>
    ));
  return (
    <aside className="fixed left-0 top-11 h-[calc(100vh-2.75rem)] w-56 overflow-y-auto bg-[#0f1f3d] py-4 text-white">
      <nav className="space-y-2">
        <div>
          <button
            type="button"
            onClick={() => setManagementOpen((open) => !open)}
            className={sectionButtonClass}
          >
            <span>MANAGEMENT</span>
            {managementOpen ? (
              <ChevronDown size={16} className={sectionIconClass} />
            ) : (
              <ChevronRight size={16} className={sectionIconClass} />
            )}
          </button>
          {managementOpen && (
            <div className="mt-1 space-y-1 px-3">
              {renderLinks(managementItems)}
            </div>
          )}
        </div>
        <div>
          <button
            type="button"
            onClick={() => setConfigurationOpen((open) => !open)}
            className={sectionButtonClass}
          >
            <span>CONFIGURATION</span>
            {configurationOpen ? (
              <ChevronDown size={16} className={sectionIconClass} />
            ) : (
              <ChevronRight size={16} className={sectionIconClass} />
            )}
          </button>
          {configurationOpen && (
            <div className="mt-1 space-y-1 px-3">
              {renderLinks(configurationItems)}
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;

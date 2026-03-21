import { Folder, MapPin, Shield, Users } from "lucide-react";

const stats = [
  { label: "TOTAL USERS", value: "30", note: "+2 this month", icon: Users },
  { label: "ACTIVE ROLES", value: "11", note: "2 departments", icon: Shield },
  { label: "MODULES", value: "7", note: "21 sub-modules", icon: Folder },
  { label: "LOCATIONS", value: "7", note: "Total active locations", icon: MapPin },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-[#eaedf0] pl-56 pt-11">
      <div className="p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ label, value, note, icon: Icon }) => (
            <div key={label} className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <div className="mb-4 flex items-start justify-between">
                <span className="text-[11px] font-semibold tracking-wide text-slate-500">{label}</span>
                <Icon size={16} className="text-[#6b84d6]" />
              </div>
              <p className="text-4xl font-bold leading-none text-black">{value}</p>
              <p className="mt-2 text-xs text-slate-500">{note}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

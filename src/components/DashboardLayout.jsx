import { useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileStack,
  Search,
  BarChart3,
  Users,
  Bell,
  Menu,
  X,
  LogOut,
  ChevronDown,
  Settings,
  ShieldCheck,
} from "lucide-react";
import Logo from "./Logo";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/dashboard/reports", label: "Crime Reports", icon: FileStack },
  { to: "/dashboard/investigation", label: "Investigation", icon: Search },
  { to: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/dashboard/users", label: "User Management", icon: Users },
];

const pageTitles = {
  "/dashboard": "Dashboard Overview",
  "/dashboard/reports": "Crime Reports",
  "/dashboard/investigation": "Case Investigation",
  "/dashboard/analytics": "Crime Analytics",
  "/dashboard/users": "User Management",
};

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const title = pageTitles[location.pathname] || "Police Portal";

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-police-900 text-slate-300 transition-transform duration-200 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
          <Logo variant="light" subtitle={false} />
          <button className="text-slate-400 lg:hidden" onClick={() => setOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-1 p-4">
          <p className="px-3 pb-2 pt-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Main
          </p>
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-gold-400 text-police-900 shadow"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <Icon className="h-4.5 w-4.5" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="absolute inset-x-0 bottom-0 border-t border-white/10 p-4">
          <div className="mb-3 rounded-xl bg-white/5 p-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-gold-300">
              <ShieldCheck className="h-4 w-4" /> Secure Session
            </div>
            <p className="mt-1 text-[11px] text-slate-400">2FA enabled · JWT active</p>
          </div>
          <Link to="/" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white">
            <LogOut className="h-4 w-4" /> Sign out
          </Link>
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Content */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <button className="text-slate-600 lg:hidden" onClick={() => setOpen(true)}>
              <Menu className="h-6 w-6" />
            </button>
            <div>
              <h1 className="font-display text-lg font-bold text-slate-900">{title}</h1>
              <p className="hidden text-xs text-slate-400 sm:block">
                ECRS Command Center
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button className="relative grid h-10 w-10 place-items-center rounded-lg text-slate-500 hover:bg-slate-100">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>
            <button className="hidden h-10 w-10 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 sm:grid">
              <Settings className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2.5 rounded-lg border border-slate-200 px-2 py-1.5">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-police-700 text-xs font-bold text-white">
                KM
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-semibold text-slate-800">Insp. K. Mensah</p>
                <p className="text-[11px] text-slate-400">Investigator</p>
              </div>
              <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
            </div>
          </div>
        </header>

        <main key={location.pathname} className="animate-fade-in p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

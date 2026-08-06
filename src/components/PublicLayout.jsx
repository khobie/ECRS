import { useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import Footer from "./Footer";
import EmergencyBar from "./EmergencyBar";

const navLinks = [
  { to: "/", label: "Home", end: true },
  { to: "/report", label: "Report Crime" },
  { to: "/track", label: "Track Report" },
];

export default function PublicLayout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col">
      <EmergencyBar />
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link to="/">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `rounded-lg px-4 py-2 text-sm font-medium transition ${
                    isActive ? "bg-police-50 text-police-700" : "text-slate-600 hover:bg-slate-100"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link to="/report" className="btn-gold">
              Report Crime
            </Link>
          </div>

          <button
            className="grid h-10 w-10 place-items-center rounded-lg text-police-700 md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>

        {open && (
          <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
            <nav className="flex flex-col gap-1">
              {navLinks.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `rounded-lg px-4 py-2.5 text-sm font-medium ${
                      isActive ? "bg-police-50 text-police-700" : "text-slate-600"
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              <Link to="/report" onClick={() => setOpen(false)} className="btn-gold mt-2">
                Report Crime
              </Link>
            </nav>
          </div>
        )}
      </header>

      <main key={location.pathname} className="flex-1 animate-fade-in">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

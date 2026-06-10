import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-police-900 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo variant="light" />
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            The Electronic Crime Reporting System (ECRS) — a secure platform for reporting crime,
            tracking cases, and supporting investigations.
          </p>
          <div className="mt-5 flex gap-3">
            {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 text-slate-300 transition hover:bg-gold-400 hover:text-police-900"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">Contact</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 text-gold-400" />
              <span>ECRS National Command Center</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-gold-400" />
              <span>info@ecrs.gov</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 text-gold-400" />
              <span>+233 302 773 906</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">Emergency Numbers</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center justify-between border-b border-white/10 pb-2">
              <span>Police Emergency</span> <span className="font-bold text-gold-400">191</span>
            </li>
            <li className="flex items-center justify-between border-b border-white/10 pb-2">
              <span>National Emergency</span> <span className="font-bold text-gold-400">112</span>
            </li>
            <li className="flex items-center justify-between border-b border-white/10 pb-2">
              <span>Ambulance</span> <span className="font-bold text-gold-400">193</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Fire Service</span> <span className="font-bold text-gold-400">192</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">Quick Links</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/report" className="hover:text-gold-400">Report a Crime</Link></li>
            <li><Link to="/track" className="hover:text-gold-400">Track a Report</Link></li>
            <li><a href="#" className="hover:text-gold-400">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-gold-400">Terms & Conditions</a></li>
            <li><Link to="/login" className="hover:text-gold-400">Officer Login</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-slate-400 sm:flex-row">
          <p>© {new Date().getFullYear()} Electronic Crime Reporting System (ECRS). All rights reserved.</p>
          <p>Built for safer communities</p>
        </div>
      </div>
    </footer>
  );
}

import { Phone, AlertTriangle } from "lucide-react";

export default function EmergencyBar() {
  return (
    <div className="bg-police-900 text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-1 px-4 py-1.5 text-xs sm:flex-row">
        <div className="flex items-center gap-2 text-gold-300">
          <AlertTriangle className="h-3.5 w-3.5" />
          <span className="font-medium">In an emergency, always call the Police directly.</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="tel:191" className="flex items-center gap-1.5 font-semibold hover:text-gold-300">
            <Phone className="h-3.5 w-3.5" /> Police: 191
          </a>
          <a href="tel:112" className="flex items-center gap-1.5 font-semibold hover:text-gold-300">
            <Phone className="h-3.5 w-3.5" /> Emergency: 112
          </a>
        </div>
      </div>
    </div>
  );
}

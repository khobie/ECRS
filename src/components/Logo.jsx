import { Shield } from "lucide-react";
import { cn } from "../lib/utils";

export default function Logo({ className, variant = "dark", subtitle = true }) {
  const isLight = variant === "light";
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative grid place-items-center">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-police-700 to-police-900 shadow-md ring-2 ring-gold-400/60">
          <Shield className="h-5 w-5 text-gold-400" strokeWidth={2.5} />
        </div>
      </div>
      <div className="leading-tight">
        <p className={cn("font-display text-base font-extrabold tracking-tight", isLight ? "text-white" : "text-police-900")}>
          ECRS
        </p>
        {subtitle && (
          <p className={cn("text-[11px] font-medium", isLight ? "text-gold-300" : "text-gold-600")}>
            Electronic Crime Reporting System
          </p>
        )}
      </div>
    </div>
  );
}

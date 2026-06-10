import * as Icons from "lucide-react";
import { cn } from "../lib/utils";

const toneMap = {
  police: "bg-police-50 text-police-700",
  gold: "bg-gold-100 text-gold-700",
  blue: "bg-blue-50 text-blue-600",
  emerald: "bg-emerald-50 text-emerald-600",
  red: "bg-red-50 text-red-600",
};

export default function StatCard({ label, value, icon, trend, tone = "police" }) {
  const Icon = Icons[icon] || Icons.Activity;
  const positive = trend && !String(trend).startsWith("-");
  return (
    <div className="card p-5 transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5">
      <div className="flex items-start justify-between">
        <div className={cn("grid h-11 w-11 place-items-center rounded-xl", toneMap[tone])}>
          <Icon className="h-5 w-5" />
        </div>
        {trend && (
          <span
            className={cn(
              "badge",
              positive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
            )}
          >
            {positive ? <Icons.TrendingUp className="h-3 w-3" /> : <Icons.TrendingDown className="h-3 w-3" />}
            {trend}
          </span>
        )}
      </div>
      <p className="mt-4 font-display text-2xl font-extrabold text-slate-900">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{label}</p>
    </div>
  );
}

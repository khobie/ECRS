import { Link } from "react-router-dom";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ArrowRight, MapPin } from "lucide-react";
import StatCard from "../components/StatCard";
import ChartCard from "../components/ChartCard";
import {
  dashboardStats,
  crimeTrend,
  reportsByRegion,
  categoryDistribution,
  reports,
} from "../data/mock";
import { formatDate, statusStyles, priorityStyles } from "../lib/utils";

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid #e2e8f0",
  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
  fontSize: 12,
};

export default function Dashboard() {
  const recent = reports.slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {dashboardStats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid gap-6 lg:grid-cols-3">
        <ChartCard
          title="Crime Trend"
          subtitle="Reports vs. resolved over the year"
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={crimeTrend} margin={{ left: -20, right: 10 }}>
              <defs>
                <linearGradient id="rep" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#003366" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#003366" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="res" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F4B400" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#F4B400" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="reports" name="Reports" stroke="#003366" strokeWidth={2.5} fill="url(#rep)" />
              <Area type="monotone" dataKey="resolved" name="Resolved" stroke="#F4B400" strokeWidth={2.5} fill="url(#res)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Crime Categories" subtitle="Distribution by type">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={categoryDistribution}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={2}
              >
                {categoryDistribution.map((e) => (
                  <Cell key={e.name} fill={e.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            {categoryDistribution.map((c) => (
              <div key={c.name} className="flex items-center gap-2 text-xs text-slate-500">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.color }} />
                {c.name}
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Charts row 2 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Reports by Zone" subtitle="Top zones in Koforidua this year">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={reportsByRegion} margin={{ left: -20, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
              <XAxis dataKey="region" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} interval={0} angle={-15} textAnchor="end" height={50} />
              <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#f1f5f9" }} />
              <Bar dataKey="reports" name="Reports" fill="#003366" radius={[6, 6, 0, 0]} barSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Monthly Crime Statistics" subtitle="Reported incidents per month">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={crimeTrend} margin={{ left: -20, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#f1f5f9" }} />
              <Bar dataKey="reports" name="Reports" fill="#F4B400" radius={[6, 6, 0, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Recent reports */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <h3 className="font-display text-base font-bold text-slate-900">Recent Reports</h3>
          <Link to="/dashboard/reports" className="flex items-center gap-1 text-sm font-semibold text-police-700 hover:text-police-900">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-5 py-3 font-semibold">Case ID</th>
                <th className="px-5 py-3 font-semibold">Crime Type</th>
                <th className="px-5 py-3 font-semibold">Location</th>
                <th className="px-5 py-3 font-semibold">Date</th>
                <th className="px-5 py-3 font-semibold">Priority</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((r) => (
                <tr key={r.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                  <td className="px-5 py-3 font-semibold text-police-700">{r.id}</td>
                  <td className="px-5 py-3 text-slate-700">{r.crimeType}</td>
                  <td className="px-5 py-3 text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" /> {r.location}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-500">{formatDate(r.dateReported)}</td>
                  <td className="px-5 py-3"><span className={`badge ${priorityStyles[r.priority]}`}>{r.priority}</span></td>
                  <td className="px-5 py-3"><span className={`badge ${statusStyles[r.status]}`}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

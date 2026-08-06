import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { MapPin, Building2, Flame, Calendar } from "lucide-react";
import ChartCard from "../components/ChartCard";
import { api } from "../lib/api";

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid #e2e8f0",
  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
  fontSize: 12,
};

const levelColor = { high: "#ef4444", medium: "#f4b400", low: "#22c55e" };

export default function Analytics() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getAnalytics()
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return <div className="card p-8 text-center text-sm text-red-500">{error}</div>;
  }

  if (!data) {
    return <div className="card p-8 text-center text-sm text-slate-400">Loading analytics…</div>;
  }

  const {
    crime_trend: crimeTrend,
    reports_by_zone: reportsByRegion,
    category_distribution: categoryDistribution,
    resolution_rates: resolutionRates,
    hotspots,
    stations,
  } = data;

  const radialData = resolutionRates.map((r, i) => ({
    name: r.zone,
    rate: r.rate,
    fill: ["#003366", "#1f5d99", "#F4B400", "#4a7cb0", "#d99e00", "#7099c2"][i % 6],
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-slate-900">Crime Analytics</h2>
          <p className="text-sm text-slate-500">Data-driven insights across Koforidua zones and categories.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-outline text-sm"><Calendar className="h-4 w-4" /> Last 12 months</button>
        </div>
      </div>

      <ChartCard
        title="Koforidua Crime Hotspot Map"
        subtitle="Incident density across Koforidua zones"
        action={
          <div className="flex items-center gap-3 text-xs">
            {Object.entries(levelColor).map(([k, c]) => (
              <span key={k} className="flex items-center gap-1.5 capitalize text-slate-500">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: c }} /> {k}
              </span>
            ))}
          </div>
        }
      >
        <div className="relative h-[360px] overflow-hidden rounded-xl border border-slate-200 bg-[#e8eef5]">
          <div className="absolute inset-0 opacity-60" style={{
            backgroundImage: "linear-gradient(#cdd9e8 1px, transparent 1px), linear-gradient(90deg, #cdd9e8 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }} />
          <div className="absolute left-[10%] top-[20%] h-40 w-56 rounded-[40%] bg-police-100/70" />
          <div className="absolute right-[14%] top-[40%] h-48 w-64 rounded-[45%] bg-police-100/60" />
          <div className="absolute bottom-[10%] left-[30%] h-36 w-72 rounded-[50%] bg-emerald-100/50" />

          {stations.map((s) => (
            <div key={s.name} className="group absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${s.x}%`, top: `${s.y}%` }}>
              <div className="grid h-7 w-7 place-items-center rounded-lg bg-police-800 text-white shadow-lg ring-2 ring-white">
                <Building2 className="h-3.5 w-3.5" />
              </div>
              <span className="pointer-events-none absolute left-1/2 top-8 -translate-x-1/2 whitespace-nowrap rounded bg-slate-900 px-2 py-0.5 text-[10px] text-white opacity-0 transition group-hover:opacity-100">
                {s.name}
              </span>
            </div>
          ))}

          {hotspots.map((h) => (
            <div key={h.name} className="group absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${h.x}%`, top: `${h.y}%` }}>
              <span className="absolute inset-0 m-auto h-6 w-6 rounded-full animate-pulse-ring" style={{ background: levelColor[h.level] }} />
              <div className="relative grid h-6 w-6 place-items-center rounded-full text-white shadow-lg ring-2 ring-white" style={{ background: levelColor[h.level] }}>
                <MapPin className="h-3.5 w-3.5" />
              </div>
              <span className="pointer-events-none absolute left-1/2 top-7 -translate-x-1/2 whitespace-nowrap rounded bg-slate-900 px-2 py-0.5 text-[10px] text-white opacity-0 transition group-hover:opacity-100">
                {h.name} · {h.count} incident{h.count !== 1 ? "s" : ""}
              </span>
            </div>
          ))}

          <div className="absolute bottom-3 right-3 flex items-center gap-2 rounded-lg bg-white/90 px-3 py-1.5 text-xs font-medium text-slate-600 shadow">
            <Flame className="h-3.5 w-3.5 text-red-500" /> {hotspots.length} active hotspot{hotspots.length !== 1 ? "s" : ""}
          </div>
        </div>
      </ChartCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Crime Trends" subtitle="Reported vs resolved over 12 months">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={crimeTrend} margin={{ left: -20, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="reports" name="Reports" stroke="#003366" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="resolved" name="Resolved" stroke="#F4B400" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Crime by Zone" subtitle="Total reports per Koforidua zone">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart layout="vertical" data={reportsByRegion} margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="region" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} width={70} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#f1f5f9" }} />
              <Bar dataKey="reports" name="Reports" fill="#1f5d99" radius={[0, 6, 6, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Crime by Category" subtitle="Share of total incidents">
          <div className="flex items-center">
            <ResponsiveContainer width="55%" height={240}>
              <PieChart>
                <Pie data={categoryDistribution} dataKey="value" nameKey="name" innerRadius={50} outerRadius={95} paddingAngle={2}>
                  {categoryDistribution.map((e) => <Cell key={e.name} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {categoryDistribution.map((c) => (
                <div key={c.name} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-slate-600">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.color }} /> {c.name}
                  </span>
                  <span className="font-semibold text-slate-800">{c.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Resolution Rates" subtitle="Case resolution by zone (%)">
          <ResponsiveContainer width="100%" height={280}>
            <RadialBarChart innerRadius="20%" outerRadius="100%" data={radialData} startAngle={90} endAngle={-270}>
              <RadialBar background dataKey="rate" cornerRadius={8} />
              <Legend iconType="circle" layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: 11 }} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => `${v}%`} />
            </RadialBarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Monthly Reports" subtitle="Incident volume per month">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={crimeTrend} margin={{ left: -20, right: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#f1f5f9" }} />
            <Bar dataKey="reports" name="Reports" fill="#003366" radius={[6, 6, 0, 0]} barSize={26} />
            <Bar dataKey="resolved" name="Resolved" fill="#F4B400" radius={[6, 6, 0, 0]} barSize={26} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

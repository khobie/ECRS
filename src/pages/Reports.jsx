import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  FileDown,
  FileSpreadsheet,
  Eye,
  MoreHorizontal,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { api } from "../lib/api";
import { formatDate, statusStyles, priorityStyles } from "../lib/utils";

const statusOptions = ["All", "Submitted", "Assigned", "Under Investigation", "Pending Review", "Resolved", "Closed"];
const priorityOptions = ["All", "Low", "Medium", "High", "Critical"];
const PAGE_SIZE = 8;

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [priority, setPriority] = useState("All");
  const [sort, setSort] = useState({ key: "dateReported", dir: "desc" });
  const [page, setPage] = useState(1);

  useEffect(() => {
    api.getReports()
      .then((res) => setReports(res.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let data = reports.filter((r) => {
      const q = query.toLowerCase();
      const matchesQuery =
        !q ||
        r.id.toLowerCase().includes(q) ||
        r.crimeType.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q) ||
        r.officer.toLowerCase().includes(q);
      const matchesStatus = status === "All" || r.status === status;
      const matchesPriority = priority === "All" || r.priority === priority;
      return matchesQuery && matchesStatus && matchesPriority;
    });

    data = [...data].sort((a, b) => {
      const dir = sort.dir === "asc" ? 1 : -1;
      if (a[sort.key] < b[sort.key]) return -1 * dir;
      if (a[sort.key] > b[sort.key]) return 1 * dir;
      return 0;
    });
    return data;
  }, [reports, query, status, priority, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const paged = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const toggleSort = (key) => {
    setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));
  };

  const SortIcon = ({ col }) => {
    if (sort.key !== col) return <ChevronsUpDown className="h-3.5 w-3.5 text-slate-300" />;
    return sort.dir === "asc" ? <ChevronUp className="h-3.5 w-3.5 text-police-700" /> : <ChevronDown className="h-3.5 w-3.5 text-police-700" />;
  };

  const columns = [
    { key: "id", label: "Case ID" },
    { key: "crimeType", label: "Crime Type" },
    { key: "dateReported", label: "Date Reported" },
    { key: "location", label: "Location" },
    { key: "priority", label: "Priority" },
    { key: "status", label: "Status" },
    { key: "officer", label: "Assigned Officer" },
  ];

  if (error) {
    return <div className="card p-8 text-center text-sm text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-5">
      <div className="card p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              className="input pl-9"
              placeholder="Search by Case ID, type, location, officer..."
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select className="input w-auto" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
              {statusOptions.map((s) => <option key={s}>{s}</option>)}
            </select>
            <select className="input w-auto" value={priority} onChange={(e) => { setPriority(e.target.value); setPage(1); }}>
              {priorityOptions.map((p) => <option key={p}>{p === "All" ? "All Priorities" : p}</option>)}
            </select>
            <button className="btn-outline"><FileDown className="h-4 w-4" /> PDF</button>
            <button className="btn-outline"><FileSpreadsheet className="h-4 w-4" /> Excel</button>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3 text-sm">
          <span className="font-semibold text-slate-700">
            {loading ? "Loading…" : `${filtered.length} report${filtered.length !== 1 ? "s" : ""}`}
          </span>
          <span className="text-slate-400">Page {current} of {totalPages}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-left text-xs uppercase tracking-wider text-slate-500">
                {columns.map((c) => (
                  <th key={c.key} className="px-5 py-3 font-semibold">
                    <button className="flex items-center gap-1.5 hover:text-police-700" onClick={() => toggleSort(c.key)}>
                      {c.label} <SortIcon col={c.key} />
                    </button>
                  </th>
                ))}
                <th className="px-5 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="px-5 py-12 text-center text-slate-400">Loading reports…</td></tr>
              ) : (
                paged.map((r) => (
                  <tr key={r.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                    <td className="px-5 py-3 font-semibold text-police-700">{r.id}</td>
                    <td className="px-5 py-3 text-slate-700">{r.crimeType}</td>
                    <td className="px-5 py-3 text-slate-500">{formatDate(r.dateReported)}</td>
                    <td className="px-5 py-3 text-slate-500">
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-slate-400" /> {r.location}</span>
                    </td>
                    <td className="px-5 py-3"><span className={`badge ${priorityStyles[r.priority]}`}>{r.priority}</span></td>
                    <td className="px-5 py-3"><span className={`badge ${statusStyles[r.status]}`}>{r.status}</span></td>
                    <td className="px-5 py-3">
                      {r.officer === "Unassigned" ? (
                        <span className="text-xs text-slate-400">Unassigned</span>
                      ) : (
                        <span className="text-slate-600">{r.officer}</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link to={`/officer/investigation?case=${r.id}`} className="grid h-8 w-8 place-items-center rounded-lg text-police-700 hover:bg-police-50" title="View case">
                          <Eye className="h-4 w-4" />
                        </Link>
                        <button className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
              {!loading && paged.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-slate-400">
                    No reports match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
          <button className="btn-ghost text-sm disabled:opacity-40" disabled={current === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
            <ChevronLeft className="h-4 w-4" /> Previous
          </button>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`h-8 w-8 rounded-lg text-sm font-medium ${current === i + 1 ? "bg-police-700 text-white" : "text-slate-500 hover:bg-slate-100"}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button className="btn-ghost text-sm disabled:opacity-40" disabled={current === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
            Next <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

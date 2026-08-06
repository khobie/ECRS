import { useEffect, useMemo, useState } from "react";
import {
  Search,
  UserPlus,
  Pencil,
  KeyRound,
  Ban,
  CheckCircle2,
  ShieldCheck,
  X,
  Mail,
} from "lucide-react";
import { api } from "../lib/api";
import { formatDateTime } from "../lib/utils";

const roles = ["All", "Super Admin", "Police Commander", "Investigator", "Station Officer", "Citizen"];

const roleStyles = {
  "Super Admin": "bg-purple-100 text-purple-700",
  "Police Commander": "bg-police-100 text-police-700",
  Investigator: "bg-blue-100 text-blue-700",
  "Station Officer": "bg-cyan-100 text-cyan-700",
  Citizen: "bg-slate-100 text-slate-600",
};

export default function Users() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("All");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    api.getUsers()
      .then((res) => setData(res.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () =>
      data.filter((u) => {
        const q = query.toLowerCase();
        const matchesQuery = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
        const matchesRole = role === "All" || u.role === role;
        return matchesQuery && matchesRole;
      }),
    [data, query, role]
  );

  const activeCount = data.filter((u) => u.status === "Active").length;

  if (error) {
    return <div className="card p-8 text-center text-sm text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Users", value: data.length, icon: ShieldCheck, tone: "bg-police-50 text-police-700" },
          { label: "Active", value: activeCount, icon: CheckCircle2, tone: "bg-emerald-50 text-emerald-600" },
          { label: "Officers", value: data.filter((u) => u.role !== "Citizen").length, icon: ShieldCheck, tone: "bg-gold-100 text-gold-700" },
          { label: "Disabled", value: data.length - activeCount, icon: Ban, tone: "bg-red-50 text-red-600" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="card flex items-center gap-3 p-4">
              <div className={`grid h-11 w-11 place-items-center rounded-xl ${s.tone}`}><Icon className="h-5 w-5" /></div>
              <div>
                <p className="font-display text-xl font-extrabold text-slate-900">{loading ? "—" : s.value}</p>
                <p className="text-xs text-slate-500">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input className="input pl-9" placeholder="Search by name or email..." value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <select className="input w-auto" value={role} onChange={(e) => setRole(e.target.value)}>
              {roles.map((r) => <option key={r}>{r === "All" ? "All Roles" : r}</option>)}
            </select>
            <button className="btn-primary" onClick={() => setShowModal(true)}><UserPlus className="h-4 w-4" /> Add User</button>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-left text-xs uppercase tracking-wider text-slate-500">
                <th className="px-5 py-3 font-semibold">User</th>
                <th className="px-5 py-3 font-semibold">Role</th>
                <th className="px-5 py-3 font-semibold">Station</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Last Active</th>
                <th className="px-5 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-slate-400">Loading users…</td></tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 place-items-center rounded-full bg-police-700 text-xs font-bold text-white">
                          {u.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{u.name}</p>
                          <p className="text-xs text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3"><span className={`badge ${roleStyles[u.role] || "bg-slate-100 text-slate-600"}`}>{u.role}</span></td>
                    <td className="px-5 py-3 text-slate-500">{u.station}</td>
                    <td className="px-5 py-3">
                      <span className={`badge ${u.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-500">{formatDateTime(u.lastActive)}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-police-700" title="Edit"><Pencil className="h-4 w-4" /></button>
                        <button className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-police-700" title="Reset password"><KeyRound className="h-4 w-4" /></button>
                        <button className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100" title="Toggle status">
                          {u.status === "Active" ? <Ban className="h-4 w-4 text-red-500" /> : <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-slate-400">No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={() => setShowModal(false)}>
          <div className="card w-full max-w-md p-6 animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-police-900">Add New User</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
            </div>
            <p className="text-sm text-slate-500">User creation will be available once officer authentication is enabled.</p>
            <div className="mt-6 flex justify-end">
              <button onClick={() => setShowModal(false)} className="btn-ghost">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

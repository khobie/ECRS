import { useState } from "react";
import { Search, Check, Clock, FileText, MapPin, User, ShieldCheck, Bell } from "lucide-react";
import { api } from "../lib/api";
import { formatDateTime, formatStatus, statusStyles } from "../lib/utils";

const eventLabels = {
  submitted: "Submitted",
  assigned: "Assigned",
  reassigned: "Reassigned",
  status_changed: "Status Updated",
  priority_changed: "Priority Updated",
  note_added: "Note Added",
  evidence_uploaded: "Evidence Uploaded",
  officer_message: "Officer Message",
  resolved: "Resolved",
  closed: "Closed",
};

export default function TrackReport() {
  const [caseId, setCaseId] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const search = async (e) => {
    e.preventDefault();
    if (!caseId.trim()) {
      setError("Please enter a Case ID.");
      setResult(null);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await api.trackReport(caseId);
      setResult(res.data);
    } catch (err) {
      setResult(null);
      setError(err.message || "Case not found. Check the ID and try again.");
    } finally {
      setLoading(false);
    }
  };

  const statusLabel = result ? formatStatus(result.status) : "";
  const timeline = result?.timeline || [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="text-center">
        <span className="badge bg-police-50 text-police-700">
          <Search className="h-3.5 w-3.5" /> Case Tracking
        </span>
        <h1 className="mt-4 font-display text-3xl font-extrabold text-police-900">Track Your Report</h1>
        <p className="mt-2 text-slate-500">
          Enter the unique Case ID you received when you filed your report.
        </p>
      </div>

      <form onSubmit={search} className="card mt-8 p-5">
        <label className="label">Case ID</label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <FileText className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              className="input pl-9 uppercase"
              placeholder="e.g. KFD-2026-489201"
              value={caseId}
              onChange={(e) => setCaseId(e.target.value)}
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary sm:w-40 disabled:opacity-60">
            <Search className="h-4 w-4" /> {loading ? "Searching…" : "Track"}
          </button>
        </div>
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        <p className="mt-2 text-xs text-slate-400">Tip: try KFD-2026-489201 to see a sample case.</p>
      </form>

      {result && (
        <div className="mt-8 animate-fade-in space-y-6">
          <div className="card overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-police-900 px-6 py-5 text-white">
              <div>
                <p className="text-xs text-slate-300">Case ID</p>
                <p className="font-display text-xl font-extrabold">{result.case_id}</p>
              </div>
              <span className={`badge ${statusStyles[statusLabel] || "bg-slate-100 text-slate-700"}`}>
                {statusLabel}
              </span>
            </div>
            <div className="grid gap-4 p-6 sm:grid-cols-3">
              <Info icon={FileText} label="Crime Type" value={result.crime_type} />
              <Info icon={MapPin} label="Location" value={`${result.location}, ${result.zone}`} />
              <Info icon={User} label="Assigned Officer" value={result.officer} />
            </div>
          </div>

          <div className="card p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-police-900">Status Timeline</h2>
              <span className="text-xs text-slate-400">Filed {formatDateTime(result.filed_at)}</span>
            </div>

            <ol className="relative">
              {timeline.map((t, i) => {
                const isLast = i === timeline.length - 1;
                const label = eventLabels[t.event] || formatStatus(t.event);
                return (
                  <li key={`${t.event}-${t.date}-${i}`} className="relative flex gap-4 pb-7 last:pb-0">
                    {!isLast && (
                      <span className="absolute left-[18px] top-9 h-[calc(100%-1.5rem)] w-0.5 bg-emerald-500" />
                    )}
                    <div
                      className={`relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full ${
                        isLast ? "bg-police-700 text-white" : "bg-emerald-500 text-white"
                      }`}
                    >
                      {isLast ? <Clock className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                      {isLast && <span className="absolute inset-0 rounded-full bg-police-700 animate-pulse-ring" />}
                    </div>
                    <div className="pt-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-slate-800">{label}</p>
                        {isLast && <span className="badge bg-police-50 text-police-700">Latest</span>}
                      </div>
                      <p className="mt-0.5 text-sm text-slate-500">{t.note}</p>
                      {t.date && <p className="mt-0.5 text-xs text-slate-400">{formatDateTime(t.date)}</p>}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="card flex flex-1 items-center gap-3 p-4">
              <ShieldCheck className="h-6 w-6 text-emerald-500" />
              <p className="text-sm text-slate-600">Your case is being handled by an assigned officer.</p>
            </div>
            <button className="card flex flex-1 items-center gap-3 p-4 text-left transition hover:shadow-card-hover">
              <Bell className="h-6 w-6 text-gold-500" />
              <p className="text-sm text-slate-600">Subscribe to SMS & email updates for this case.</p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Info({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-10 w-10 place-items-center rounded-lg bg-police-50 text-police-700">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-sm font-semibold text-slate-800">{value}</p>
      </div>
    </div>
  );
}

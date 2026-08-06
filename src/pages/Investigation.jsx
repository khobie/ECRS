import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ChevronLeft,
  FileText,
  User,
  MapPin,
  Calendar,
  Phone,
  Image,
  Video,
  File,
  Paperclip,
  Send,
  UserPlus,
  RefreshCw,
  Check,
  Clock,
  Download,
  ShieldAlert,
} from "lucide-react";
import { api } from "../lib/api";
import { formatDateTime, formatStatus, formatPriority, statusStyles, priorityStyles } from "../lib/utils";

const tabs = ["Incident", "Notes", "Officer", "Timeline"];

const eventLabels = {
  submitted: "Submitted",
  assigned: "Assigned",
  reassigned: "Reassigned",
  status_changed: "Status Updated",
  resolved: "Resolved",
  closed: "Closed",
};

const evidenceIcon = {
  image: Image,
  video: Video,
  audio: File,
  document: File,
};

export default function Investigation() {
  const [params] = useSearchParams();
  const caseId = params.get("case") || "KFD-2026-489201";
  const [tab, setTab] = useState("Incident");
  const [caseData, setCaseData] = useState(null);
  const [officers, setOfficers] = useState([]);
  const [notes, setNotes] = useState([]);
  const [assigned, setAssigned] = useState("");
  const [assignedId, setAssignedId] = useState(null);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    Promise.all([api.getReport(caseId), api.getOfficers()])
      .then(([reportRes, officersRes]) => {
        setCaseData(reportRes.data);
        setNotes(reportRes.data.notes || []);
        setAssigned(reportRes.data.officer || "Unassigned");
        setAssignedId(reportRes.data.officer_id ?? null);
        setOfficers(officersRes.data || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [caseId]);

  const reloadCase = () =>
    api.getReport(caseId).then((res) => {
      setCaseData(res.data);
      setNotes(res.data.notes || []);
      setAssigned(res.data.officer || "Unassigned");
      setAssignedId(res.data.officer_id ?? null);
    });

  const addNote = async () => {
    if (!draft.trim() || saving) return;
    setSaving(true);
    setError("");
    try {
      const res = await api.addNote(caseId, draft.trim());
      setNotes((n) => [...n, res.data]);
      setDraft("");
      await reloadCase();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const reassignOfficer = async () => {
    const officer = officers.find((o) => o.name === assigned);
    if (!officer || saving) return;
    setSaving(true);
    setError("");
    try {
      await api.updateReport(caseId, { assigned_officer_id: officer.id });
      setAssignedId(officer.id);
      await reloadCase();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const markResolved = async () => {
    if (saving) return;
    setSaving(true);
    setError("");
    try {
      await api.updateReport(caseId, { status: "resolved" });
      await reloadCase();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const uploadEvidence = async (e) => {
    const file = e.target.files?.[0];
    if (!file || saving) return;
    setSaving(true);
    setError("");
    try {
      await api.uploadEvidence(caseId, file);
      await reloadCase();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
      e.target.value = "";
    }
  };

  if (error) {
    return <div className="card p-8 text-center text-sm text-red-500">{error}</div>;
  }

  if (loading || !caseData) {
    return <div className="card p-8 text-center text-sm text-slate-400">Loading case…</div>;
  }

  const statusLabel = formatStatus(caseData.status);
  const priorityLabel = formatPriority(caseData.priority);
  const timeline = caseData.timeline || [];
  const gps = caseData.latitude && caseData.longitude
    ? `${caseData.latitude}°, ${caseData.longitude}°`
    : "—";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Link to="/officer/reports" className="mb-2 inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-police-700">
            <ChevronLeft className="h-4 w-4" /> Back to Reports
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-2xl font-extrabold text-police-900">{caseData.case_id}</h1>
            <span className={`badge ${statusStyles[statusLabel]}`}>{statusLabel}</span>
            <span className={`badge ${priorityStyles[priorityLabel]}`}>
              <ShieldAlert className="h-3 w-3" /> {priorityLabel}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            {caseData.crime_type} · {caseData.location}, {caseData.zone} · Reported {formatDateTime(caseData.filed_at)}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="btn-outline" disabled={saving}><Download className="h-4 w-4" /> Export Case File</button>
          <button className="btn-primary" disabled={saving || caseData.status === "resolved"} onClick={markResolved}>
            <Check className="h-4 w-4" /> Mark Resolved
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      <div className="flex gap-1 overflow-x-auto border-b border-slate-200">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-semibold transition ${
              tab === t ? "border-police-700 text-police-700" : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {tab === "Incident" && (
            <>
              <div className="card p-6">
                <h2 className="mb-4 font-display text-base font-bold text-police-900">Case Details</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Detail icon={FileText} label="Crime Type" value={caseData.crime_type} />
                  <Detail icon={Calendar} label="Incident Date" value={`${caseData.incident_date?.split("T")[0] || "—"}${caseData.incident_time ? `, ${caseData.incident_time}` : ""}`} />
                  <Detail icon={MapPin} label="Location" value={`${caseData.location}, ${caseData.zone}`} />
                  <Detail icon={MapPin} label="GPS" value={gps} />
                </div>
                <div className="mt-5 rounded-xl bg-slate-50 p-4">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">Description</p>
                  <p className="text-sm leading-relaxed text-slate-600">{caseData.description}</p>
                </div>
              </div>

              {!caseData.is_anonymous && (
                <div className="card p-6">
                  <h2 className="mb-4 font-display text-base font-bold text-police-900">Reporter Details</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Detail icon={User} label="Name" value={caseData.reporter_name || "—"} />
                    <Detail icon={Phone} label="Phone" value={caseData.reporter_phone || "—"} />
                  </div>
                </div>
              )}

              {caseData.is_anonymous && (
                <div className="card p-6">
                  <p className="text-sm text-slate-500">This report was filed anonymously.</p>
                </div>
              )}

              <div className="card p-6">
                <h2 className="mb-4 font-display text-base font-bold text-police-900">Evidence Files</h2>
                {caseData.evidence?.length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {caseData.evidence.map((e) => {
                      const Icon = evidenceIcon[e.type] || File;
                      return (
                        <div key={e.name} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 transition hover:border-police-300 hover:bg-police-50">
                          <div className="grid h-10 w-10 place-items-center rounded-lg bg-police-50 text-police-700">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-slate-700">{e.name}</p>
                            <p className="text-xs text-slate-400">{e.size ? `${Math.round(e.size / 1024)} KB` : "—"}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">No evidence files attached.</p>
                )}
              </div>
            </>
          )}

          {tab === "Notes" && (
            <div className="card p-6">
              <h2 className="mb-4 font-display text-base font-bold text-police-900">Investigation Notes</h2>
              <div className="space-y-4">
                {notes.length === 0 ? (
                  <p className="text-sm text-slate-400">No investigation notes yet.</p>
                ) : (
                  notes.map((n, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-police-700 text-xs font-bold text-white">
                        {n.author.split(" ").map((w) => w[0]).slice(-2).join("")}
                      </div>
                      <div className="flex-1 rounded-xl bg-slate-50 p-3">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-slate-800">{n.author}</p>
                          <p className="text-xs text-slate-400">{formatDateTime(n.date)}</p>
                        </div>
                        <p className="mt-1 text-sm text-slate-600">{n.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-5 rounded-xl border border-slate-200 p-3">
                <textarea
                  rows={3}
                  className="w-full resize-none border-0 p-1 text-sm focus:outline-none"
                  placeholder="Add an investigation note..."
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                />
                <div className="flex items-center justify-between border-t border-slate-100 pt-2">
                  <button type="button" className="btn-ghost text-xs" disabled={saving} onClick={() => document.getElementById("evidence-upload")?.click()}>
                    <Paperclip className="h-4 w-4" /> Upload Document
                  </button>
                  <input id="evidence-upload" type="file" className="hidden" onChange={uploadEvidence} />
                  <button onClick={addNote} disabled={saving} className="btn-primary text-sm"><Send className="h-4 w-4" /> Add Note</button>
                </div>
              </div>
            </div>
          )}

          {tab === "Officer" && (
            <div className="card p-6">
              <h2 className="mb-4 font-display text-base font-bold text-police-900">Officer Assignment</h2>
              <div className="mb-5 flex items-center gap-3 rounded-xl bg-police-50 p-4">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-police-700 text-sm font-bold text-white">
                  {assigned.split(" ").map((w) => w[0]).slice(-2).join("")}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800">{assigned}</p>
                  <p className="text-xs text-slate-500">Lead Investigator · {caseData.station || "Koforidua"}</p>
                </div>
                <span className="badge bg-emerald-100 text-emerald-700">Active</span>
              </div>

              <label className="label">Reassign to officer</label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <select className="input" value={assigned} onChange={(e) => setAssigned(e.target.value)}>
                  {officers.map((o) => <option key={o.id} value={o.name}>{o.name}</option>)}
                </select>
                <button className="btn-primary whitespace-nowrap" disabled={saving} onClick={reassignOfficer}>
                  <RefreshCw className="h-4 w-4" /> Reassign
                </button>
              </div>
            </div>
          )}

          {tab === "Timeline" && (
            <div className="card p-6">
              <h2 className="mb-5 font-display text-base font-bold text-police-900">Case Timeline</h2>
              <ol className="relative">
                {timeline.map((t, i) => {
                  const isLast = i === timeline.length - 1;
                  const label = eventLabels[t.event] || formatStatus(t.event);
                  return (
                    <li key={`${t.event}-${i}`} className="relative flex gap-4 pb-7 last:pb-0">
                      {!isLast && <span className="absolute left-[18px] top-9 h-[calc(100%-1.5rem)] w-0.5 bg-emerald-500" />}
                      <div className={`relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full ${isLast ? "bg-police-700 text-white" : "bg-emerald-500 text-white"}`}>
                        {isLast ? <Clock className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                      </div>
                      <div className="pt-1">
                        <p className="font-semibold text-slate-800">{label}</p>
                        <p className="mt-0.5 text-sm text-slate-500">{t.note}</p>
                        {t.date && <p className="mt-0.5 text-xs text-slate-400">{formatDateTime(t.date)}</p>}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="card p-5">
            <h3 className="mb-3 font-display text-sm font-bold text-police-900">Case Summary</h3>
            <dl className="space-y-3 text-sm">
              <Row label="Priority" value={<span className={`badge ${priorityStyles[priorityLabel]}`}>{priorityLabel}</span>} />
              <Row label="Status" value={<span className={`badge ${statusStyles[statusLabel]}`}>{statusLabel}</span>} />
              <Row label="Officer" value={assigned} />
              <Row label="Zone" value={caseData.zone} />
              <Row label="Days Open" value={`${caseData.days_open} day${caseData.days_open !== 1 ? "s" : ""}`} />
              <Row label="Evidence" value={`${caseData.evidence?.length || 0} file(s)`} />
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

function Detail({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-police-50 text-police-700">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-sm font-medium text-slate-700">{value}</p>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-slate-400">{label}</dt>
      <dd className="font-medium text-slate-700">{value}</dd>
    </div>
  );
}

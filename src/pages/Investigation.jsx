import { useState } from "react";
import { Link } from "react-router-dom";
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
import { investigationNotes, officers, trackTimeline } from "../data/mock";
import { formatDateTime, statusStyles } from "../lib/utils";

const tabs = ["Incident", "Notes", "Officer", "Timeline"];

const evidence = [
  { name: "scene_photo_01.jpg", type: "image", size: "2.4 MB", icon: Image },
  { name: "scene_photo_02.jpg", type: "image", size: "1.9 MB", icon: Image },
  { name: "cctv_clip.mp4", type: "video", size: "18.2 MB", icon: Video },
  { name: "witness_statement.pdf", type: "doc", size: "320 KB", icon: File },
];

export default function Investigation() {
  const [tab, setTab] = useState("Incident");
  const [notes, setNotes] = useState(investigationNotes);
  const [draft, setDraft] = useState("");
  const [assigned, setAssigned] = useState("Insp. Kwame Mensah");

  const addNote = () => {
    if (!draft.trim()) return;
    setNotes((n) => [
      ...n,
      { author: "Insp. K. Mensah", date: new Date().toISOString(), text: draft.trim() },
    ]);
    setDraft("");
  };

  const currentIndex = trackTimeline.findIndex((t) => t.status === "Under Investigation");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Link to="/dashboard/reports" className="mb-2 inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-police-700">
            <ChevronLeft className="h-4 w-4" /> Back to Reports
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-2xl font-extrabold text-police-900">GPS-2026-489201</h1>
            <span className={`badge ${statusStyles["Under Investigation"]}`}>Under Investigation</span>
            <span className="badge bg-red-100 text-red-700"><ShieldAlert className="h-3 w-3" /> Critical</span>
          </div>
          <p className="mt-1 text-sm text-slate-500">Armed Robbery · Osu, Accra · Reported 02 Jun 2026</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-outline"><Download className="h-4 w-4" /> Export Case File</button>
          <button className="btn-primary"><Check className="h-4 w-4" /> Mark Resolved</button>
        </div>
      </div>

      {/* Tabs */}
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
          {/* INCIDENT TAB */}
          {tab === "Incident" && (
            <>
              <div className="card p-6">
                <h2 className="mb-4 font-display text-base font-bold text-police-900">Case Details</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Detail icon={FileText} label="Crime Type" value="Armed Robbery" />
                  <Detail icon={Calendar} label="Incident Date" value="01 Jun 2026, 22:40" />
                  <Detail icon={MapPin} label="Location" value="Oxford Street, Osu, Accra" />
                  <Detail icon={MapPin} label="GPS" value="5.5560° N, 0.1969° W" />
                </div>
                <div className="mt-5 rounded-xl bg-slate-50 p-4">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">Description</p>
                  <p className="text-sm leading-relaxed text-slate-600">
                    Two armed individuals on a motorcycle approached the victim near a retail shop and
                    demanded valuables at gunpoint. Mobile phone and cash were taken before the suspects
                    fled towards the Ring Road. No injuries reported. Nearby CCTV may have captured the incident.
                  </p>
                </div>
              </div>

              <div className="card p-6">
                <h2 className="mb-4 font-display text-base font-bold text-police-900">Reporter Details</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Detail icon={User} label="Name" value="Joseph Adjei" />
                  <Detail icon={Phone} label="Phone" value="+233 24 555 0110" />
                </div>
              </div>

              <div className="card p-6">
                <h2 className="mb-4 font-display text-base font-bold text-police-900">Evidence Files</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {evidence.map((e) => {
                    const Icon = e.icon;
                    return (
                      <div key={e.name} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 transition hover:border-police-300 hover:bg-police-50">
                        <div className="grid h-10 w-10 place-items-center rounded-lg bg-police-50 text-police-700">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-slate-700">{e.name}</p>
                          <p className="text-xs text-slate-400">{e.size}</p>
                        </div>
                        <button className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-white hover:text-police-700">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* NOTES TAB */}
          {tab === "Notes" && (
            <div className="card p-6">
              <h2 className="mb-4 font-display text-base font-bold text-police-900">Investigation Notes</h2>
              <div className="space-y-4">
                {notes.map((n, i) => (
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
                ))}
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
                  <button className="btn-ghost text-xs"><Paperclip className="h-4 w-4" /> Upload Document</button>
                  <button onClick={addNote} className="btn-primary text-sm"><Send className="h-4 w-4" /> Add Note</button>
                </div>
              </div>
            </div>
          )}

          {/* OFFICER TAB */}
          {tab === "Officer" && (
            <div className="card p-6">
              <h2 className="mb-4 font-display text-base font-bold text-police-900">Officer Assignment</h2>
              <div className="mb-5 flex items-center gap-3 rounded-xl bg-police-50 p-4">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-police-700 text-sm font-bold text-white">KM</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800">{assigned}</p>
                  <p className="text-xs text-slate-500">Lead Investigator · Accra Central</p>
                </div>
                <span className="badge bg-emerald-100 text-emerald-700">Active</span>
              </div>

              <label className="label">Reassign to officer</label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <select className="input" value={assigned} onChange={(e) => setAssigned(e.target.value)}>
                  {officers.map((o) => <option key={o}>{o}</option>)}
                </select>
                <button className="btn-primary whitespace-nowrap"><RefreshCw className="h-4 w-4" /> Reassign</button>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <button className="btn-outline justify-start"><UserPlus className="h-4 w-4" /> Add Supporting Officer</button>
                <button className="btn-outline justify-start"><User className="h-4 w-4" /> View Officer Profile</button>
              </div>
            </div>
          )}

          {/* TIMELINE TAB */}
          {tab === "Timeline" && (
            <div className="card p-6">
              <h2 className="mb-5 font-display text-base font-bold text-police-900">Case Timeline</h2>
              <ol className="relative">
                {trackTimeline.map((t, i) => {
                  const done = i < currentIndex;
                  const active = i === currentIndex;
                  return (
                    <li key={t.status} className="relative flex gap-4 pb-7 last:pb-0">
                      {i < trackTimeline.length - 1 && (
                        <span className={`absolute left-[18px] top-9 h-[calc(100%-1.5rem)] w-0.5 ${done ? "bg-emerald-500" : "bg-slate-200"}`} />
                      )}
                      <div className={`relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full ${done ? "bg-emerald-500 text-white" : active ? "bg-police-700 text-white" : "bg-slate-200 text-slate-400"}`}>
                        {done ? <Check className="h-4 w-4" /> : active ? <Clock className="h-4 w-4" /> : i + 1}
                      </div>
                      <div className="pt-1">
                        <p className={`font-semibold ${done || active ? "text-slate-800" : "text-slate-400"}`}>{t.status}</p>
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

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card p-5">
            <h3 className="mb-3 font-display text-sm font-bold text-police-900">Case Summary</h3>
            <dl className="space-y-3 text-sm">
              <Row label="Priority" value={<span className="badge bg-red-100 text-red-700">Critical</span>} />
              <Row label="Status" value={<span className={`badge ${statusStyles["Under Investigation"]}`}>Under Investigation</span>} />
              <Row label="Officer" value={assigned} />
              <Row label="Region" value="Greater Accra" />
              <Row label="Days Open" value="8 days" />
              <Row label="Evidence" value="4 files" />
            </dl>
          </div>

          <div className="card p-5">
            <h3 className="mb-3 font-display text-sm font-bold text-police-900">Quick Actions</h3>
            <div className="space-y-2">
              <button className="btn-outline w-full justify-start text-sm"><Send className="h-4 w-4" /> Message Reporter</button>
              <button className="btn-outline w-full justify-start text-sm"><RefreshCw className="h-4 w-4" /> Update Status</button>
              <button className="btn-outline w-full justify-start text-sm"><Paperclip className="h-4 w-4" /> Attach Document</button>
            </div>
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

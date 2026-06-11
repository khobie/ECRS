import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  AlignLeft,
  UploadCloud,
  UserCircle,
  ClipboardCheck,
  Check,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Crosshair,
  Image,
  Video,
  Mic,
  File,
  X,
  ShieldCheck,
  Copy,
  Printer,
} from "lucide-react";
import { crimeCategories, zones, municipality } from "../data/mock";
import { generateCaseId } from "../lib/utils";

const steps = [
  { id: 1, label: "Incident", icon: FileText },
  { id: 2, label: "Details", icon: AlignLeft },
  { id: 3, label: "Evidence", icon: UploadCloud },
  { id: 4, label: "Reporter", icon: UserCircle },
  { id: 5, label: "Review", icon: ClipboardCheck },
];

const evidenceTypes = [
  { key: "photos", label: "Photos", icon: Image, accept: "image/*" },
  { key: "videos", label: "Videos", icon: Video, accept: "video/*" },
  { key: "audio", label: "Audio Files", icon: Mic, accept: "audio/*" },
  { key: "documents", label: "Documents", icon: File, accept: ".pdf,.doc,.docx" },
];

function Stepper({ current }) {
  return (
    <div className="flex items-center justify-between">
      {steps.map((s, i) => {
        const Icon = s.icon;
        const done = current > s.id;
        const active = current === s.id;
        return (
          <div key={s.id} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`grid h-11 w-11 place-items-center rounded-full border-2 transition ${
                  done
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : active
                    ? "border-police-700 bg-police-700 text-white shadow-glow"
                    : "border-slate-200 bg-white text-slate-400"
                }`}
              >
                {done ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
              </div>
              <span
                className={`mt-2 hidden text-xs font-semibold sm:block ${
                  active ? "text-police-700" : done ? "text-emerald-600" : "text-slate-400"
                }`}
              >
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`mx-2 h-0.5 flex-1 rounded ${done ? "bg-emerald-500" : "bg-slate-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function ReportCrime() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [caseId] = useState(generateCaseId());
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({
    category: "",
    type: "",
    date: "",
    time: "",
    location: "",
    zone: "",
    gps: "",
    description: "",
    suspect: "",
    witness: "",
    anonymous: false,
    name: "",
    phone: "",
    email: "",
  });
  const [files, setFiles] = useState({ photos: [], videos: [], audio: [], documents: [] });

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const selectedCategory = crimeCategories.find((c) => c.id === form.category);

  const next = () => setStep((s) => Math.min(5, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  const addFiles = (key, list) => {
    const names = Array.from(list).map((f) => f.name);
    setFiles((prev) => ({ ...prev, [key]: [...prev[key], ...names] }));
  };
  const removeFile = (key, idx) =>
    setFiles((prev) => ({ ...prev, [key]: prev[key].filter((_, i) => i !== idx) }));

  const detectGps = () => update("gps", "6.0940° N, 0.2571° W");

  const copyId = () => {
    navigator.clipboard?.writeText(caseId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <div className="card overflow-hidden text-center">
          <div className="bg-gradient-to-br from-police-800 to-police-900 px-8 py-10 text-white">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-500 ring-8 ring-emerald-500/20">
              <Check className="h-8 w-8" />
            </div>
            <h1 className="mt-5 font-display text-2xl font-extrabold">Report Submitted Successfully</h1>
            <p className="mt-2 text-slate-300">
              Thank you for helping keep your community safe. Your report has been securely received.
            </p>
          </div>
          <div className="p-8">
            <p className="text-sm text-slate-500">Your unique Case ID</p>
            <div className="mt-2 flex items-center justify-center gap-3">
              <span className="font-display text-2xl font-extrabold tracking-wide text-police-900">{caseId}</span>
              <button onClick={copyId} className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50">
                {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
            <p className="mt-1 text-xs text-amber-600">Save this ID — you'll need it to track your report.</p>

            <div className="mt-6 rounded-xl bg-slate-50 p-4 text-left text-sm">
              <div className="flex justify-between border-b border-slate-100 py-2">
                <span className="text-slate-500">Crime Type</span>
                <span className="font-semibold text-slate-800">{form.type || "—"}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 py-2">
                <span className="text-slate-500">Location</span>
                <span className="font-semibold text-slate-800">{form.location || "—"}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500">Status</span>
                <span className="badge bg-slate-100 text-slate-700">Submitted</span>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/track" className="btn-primary">Track this Report</Link>
              <button className="btn-outline" onClick={() => window.print()}>
                <Printer className="h-4 w-4" /> Print Confirmation
              </button>
              <Link to="/" className="btn-ghost">Back to Home</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6 text-center">
        <h1 className="font-display text-3xl font-extrabold text-police-900">Report a Crime</h1>
        <p className="mt-2 text-slate-500">
          Complete the steps below. All information is encrypted and handled confidentially.
        </p>
      </div>

      <div className="card p-6 sm:p-8">
        <Stepper current={step} />

        <div className="mt-8">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <h2 className="font-display text-lg font-bold text-police-900">Step 1 · Incident Information</h2>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="label">Crime Category</label>
                  <select className="input" value={form.category} onChange={(e) => { update("category", e.target.value); update("type", ""); }}>
                    <option value="">Select a category</option>
                    {crimeCategories.map((c) => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Crime Type</label>
                  <select className="input" value={form.type} onChange={(e) => update("type", e.target.value)} disabled={!selectedCategory}>
                    <option value="">{selectedCategory ? "Select a type" : "Choose category first"}</option>
                    {selectedCategory?.types.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Incident Date</label>
                  <input type="date" className="input" value={form.date} onChange={(e) => update("date", e.target.value)} />
                </div>
                <div>
                  <label className="label">Incident Time</label>
                  <input type="time" className="input" value={form.time} onChange={(e) => update("time", e.target.value)} />
                </div>
                <div>
                  <label className="label">Zone / Area in Koforidua</label>
                  <select className="input" value={form.zone} onChange={(e) => update("zone", e.target.value)}>
                    <option value="">Select a zone</option>
                    {zones.map((z) => <option key={z} value={z}>{z}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Location / Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input className="input pl-9" placeholder={`e.g. Jackson's Park, ${municipality.name}`} value={form.location} onChange={(e) => update("location", e.target.value)} />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="label">GPS Coordinates (optional)</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Crosshair className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <input className="input pl-9" placeholder="Latitude, Longitude" value={form.gps} onChange={(e) => update("gps", e.target.value)} />
                    </div>
                    <button type="button" onClick={detectGps} className="btn-outline whitespace-nowrap">
                      <Crosshair className="h-4 w-4" /> Detect
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <h2 className="font-display text-lg font-bold text-police-900">Step 2 · Crime Details</h2>
              <div>
                <label className="label">Detailed Description</label>
                <textarea rows={5} className="input resize-none" placeholder="Describe what happened in as much detail as possible — what, when, where, and how." value={form.description} onChange={(e) => update("description", e.target.value)} />
              </div>
              <div>
                <label className="label">Suspect Information</label>
                <textarea rows={3} className="input resize-none" placeholder="Physical description, name (if known), clothing, vehicle, direction of escape, etc." value={form.suspect} onChange={(e) => update("suspect", e.target.value)} />
              </div>
              <div>
                <label className="label">Witness Information</label>
                <textarea rows={3} className="input resize-none" placeholder="Names and contact details of any witnesses, if available." value={form.witness} onChange={(e) => update("witness", e.target.value)} />
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <h2 className="font-display text-lg font-bold text-police-900">Step 3 · Evidence Upload</h2>
              <p className="text-sm text-slate-500">
                Attach any supporting evidence. Max 25MB per file. Files are scanned and encrypted.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {evidenceTypes.map((t) => {
                  const Icon = t.icon;
                  return (
                    <div key={t.key} className="rounded-xl border border-slate-200 p-4">
                      <div className="flex items-center gap-2 text-sm font-semibold text-police-900">
                        <Icon className="h-4 w-4 text-police-600" /> {t.label}
                      </div>
                      <label className="mt-3 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 px-3 py-5 text-center transition hover:border-police-400 hover:bg-police-50">
                        <UploadCloud className="h-6 w-6 text-slate-400" />
                        <span className="mt-1 text-xs text-slate-500">Click to upload</span>
                        <input type="file" multiple accept={t.accept} className="hidden" onChange={(e) => addFiles(t.key, e.target.files)} />
                      </label>
                      {files[t.key].length > 0 && (
                        <ul className="mt-3 space-y-1.5">
                          {files[t.key].map((name, idx) => (
                            <li key={idx} className="flex items-center justify-between rounded-md bg-slate-50 px-2.5 py-1.5 text-xs">
                              <span className="truncate text-slate-600">{name}</span>
                              <button onClick={() => removeFile(t.key, idx)} className="text-slate-400 hover:text-red-500">
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="space-y-5 animate-fade-in">
              <h2 className="font-display text-lg font-bold text-police-900">Step 4 · Reporter Information</h2>
              <div className="flex items-center justify-between rounded-xl border border-gold-200 bg-gold-50 p-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-gold-600" />
                  <div>
                    <p className="text-sm font-semibold text-police-900">Report Anonymously</p>
                    <p className="text-xs text-slate-500">Your identity will not be recorded or shared.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => update("anonymous", !form.anonymous)}
                  className={`relative h-6 w-11 rounded-full transition ${form.anonymous ? "bg-police-700" : "bg-slate-300"}`}
                >
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${form.anonymous ? "left-[1.4rem]" : "left-0.5"}`} />
                </button>
              </div>

              <div className={`grid gap-5 transition ${form.anonymous ? "pointer-events-none opacity-40" : ""}`}>
                <div>
                  <label className="label">Full Name</label>
                  <input className="input" placeholder="Your name" value={form.name} onChange={(e) => update("name", e.target.value)} />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="label">Phone Number</label>
                    <input className="input" placeholder="+233 ..." value={form.phone} onChange={(e) => update("phone", e.target.value)} />
                  </div>
                  <div>
                    <label className="label">Email Address</label>
                    <input type="email" className="input" placeholder="you@email.com" value={form.email} onChange={(e) => update("email", e.target.value)} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5 */}
          {step === 5 && (
            <div className="space-y-5 animate-fade-in">
              <h2 className="font-display text-lg font-bold text-police-900">Step 5 · Review & Submit</h2>
              <div className="space-y-4">
                <ReviewBlock title="Incident Information" items={[
                  ["Category", selectedCategory?.label],
                  ["Type", form.type],
                  ["Date & Time", [form.date, form.time].filter(Boolean).join(" ")],
                  ["Zone", form.zone],
                  ["Municipality", municipality.name],
                  ["Location", form.location],
                  ["GPS", form.gps],
                ]} />
                <ReviewBlock title="Crime Details" items={[
                  ["Description", form.description],
                  ["Suspect", form.suspect],
                  ["Witness", form.witness],
                ]} />
                <ReviewBlock title="Evidence" items={[
                  ["Photos", `${files.photos.length} file(s)`],
                  ["Videos", `${files.videos.length} file(s)`],
                  ["Audio", `${files.audio.length} file(s)`],
                  ["Documents", `${files.documents.length} file(s)`],
                ]} />
                <ReviewBlock title="Reporter" items={
                  form.anonymous
                    ? [["Mode", "Anonymous"]]
                    : [["Name", form.name], ["Phone", form.phone], ["Email", form.email]]
                } />
              </div>
              <label className="flex items-start gap-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                <input type="checkbox" className="mt-0.5 h-4 w-4 rounded border-slate-300 text-police-700" defaultChecked />
                <span>I confirm the information provided is true to the best of my knowledge. Filing a false report is a punishable offence.</span>
              </label>
            </div>
          )}
        </div>

        {/* Nav buttons */}
        <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
          <button onClick={back} disabled={step === 1} className="btn-ghost">
            <ChevronLeft className="h-4 w-4" /> Back
          </button>
          <span className="text-xs font-medium text-slate-400">Step {step} of 5</span>
          {step < 5 ? (
            <button onClick={next} className="btn-primary">
              Continue <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button onClick={() => setSubmitted(true)} className="btn-gold">
              <Check className="h-4 w-4" /> Submit Report
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ReviewBlock({ title, items }) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <h3 className="mb-2 text-sm font-bold text-police-900">{title}</h3>
      <dl className="space-y-1.5 text-sm">
        {items.map(([k, v]) => (
          <div key={k} className="flex gap-3">
            <dt className="w-28 shrink-0 text-slate-400">{k}</dt>
            <dd className="text-slate-700">{v || <span className="text-slate-300">—</span>}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

import { Link } from "react-router-dom";
import * as Icons from "lucide-react";
import { ShieldCheck, FileText, Search, MapPin, ArrowRight, Phone, CheckCircle2 } from "lucide-react";
import { landingStats, features } from "../data/mock";

function StatPill({ stat }) {
  const Icon = Icons[stat.icon] || Icons.Activity;
  return (
    <div className="card p-6 transition hover:shadow-card-hover hover:-translate-y-1">
      <div className="flex items-center gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-police-50 text-police-700">
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="font-display text-2xl font-extrabold text-police-900">{stat.value}</p>
          <p className="text-xs font-medium text-emerald-600">{stat.trend} this year</p>
        </div>
      </div>
      <p className="mt-4 text-sm font-medium text-slate-500">{stat.label}</p>
    </div>
  );
}

export default function Landing() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-police-900 text-white">
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "28px 28px" }} />
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-gold-400/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-police-500/20 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <span className="badge bg-white/10 text-gold-300 ring-1 ring-white/20">
              <ShieldCheck className="h-3.5 w-3.5" /> ECRS · Koforidua Crime Reporting Platform
            </span>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              Report Crime <span className="text-gold-400">Safely</span> and{" "}
              <span className="text-gold-400">Securely</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-slate-300">
            Helping Koforidua communities fight crime through timely reporting. File a report in minutes,
            track its progress, and reach emergency services across the municipality.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/report" className="btn-gold text-base">
                <FileText className="h-5 w-5" /> Report Crime
              </Link>
              <Link to="/track" className="btn bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/20">
                <Search className="h-5 w-5" /> Track Report
              </Link>
              <a href="tel:191" className="btn border border-gold-400/40 text-gold-300 hover:bg-gold-400 hover:text-police-900">
                <Phone className="h-5 w-5" /> Emergency Contact
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-300">
              {["End-to-end encrypted", "Anonymous option", "24/7 availability"].map((t) => (
                <span key={t} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-gold-400" /> {t}
                </span>
              ))}
            </div>
          </div>

          {/* Hero card */}
          <div className="relative">
            <div className="card relative z-10 mx-auto max-w-md p-6 text-slate-800">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-police-700 to-police-900 ring-2 ring-gold-400/60">
                    <ShieldCheck className="h-5 w-5 text-gold-400" />
                  </div>
                  <div>
                    <p className="font-display text-sm font-bold text-police-900">Case KFD-2026-489201</p>
                    <p className="text-xs text-slate-400">Filed 2 days ago · Jackson's Park, Koforidua</p>
                  </div>
                </div>
                <span className="badge bg-amber-100 text-amber-700">Investigating</span>
              </div>

              <div className="mt-4 space-y-4">
                {[
                  { label: "Submitted", done: true },
                  { label: "Assigned to Officer", done: true },
                  { label: "Under Investigation", done: true, active: true },
                  { label: "Resolved", done: false },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`grid h-7 w-7 place-items-center rounded-full text-xs ${s.done ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-400"} ${s.active ? "ring-4 ring-emerald-100" : ""}`}>
                      {s.done ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                    </div>
                    <p className={`text-sm ${s.done ? "font-semibold text-slate-800" : "text-slate-400"}`}>{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-xl bg-police-50 p-3 text-xs text-police-700">
                <span className="font-semibold">Live update:</span> Your assigned officer added a note 4 hours ago.
              </div>
            </div>
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-2xl bg-gold-400/20 blur-xl" />
          </div>
        </div>
      </section>

      {/* STATISTICS */}
      <section className="mx-auto -mt-10 max-w-7xl px-4">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {landingStats.map((s) => (
            <StatPill key={s.label} stat={s} />
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="badge bg-gold-100 text-gold-700">Why use this portal</span>
          <h2 className="mt-4 font-display text-3xl font-extrabold text-police-900 sm:text-4xl">
            Everything you need to report and follow up
          </h2>
          <p className="mt-3 text-slate-500">
            A secure, transparent platform built to make reporting effortless and keep you informed
            every step of the way.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => {
            const Icon = Icons[f.icon] || Icons.Activity;
            return (
              <div key={f.title} className="card group p-6 transition hover:shadow-card-hover hover:-translate-y-1">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-police-50 text-police-700 transition group-hover:bg-gold-400 group-hover:text-police-900">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-police-900">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <span className="badge bg-police-50 text-police-700">Simple process</span>
            <h2 className="mt-4 font-display text-3xl font-extrabold text-police-900 sm:text-4xl">
              Report in three easy steps
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { icon: FileText, step: "01", title: "File your report", desc: "Fill out a guided multi-step form with incident details and evidence." },
              { icon: Search, step: "02", title: "Get a Case ID", desc: "Receive a unique tracking ID instantly after submission." },
              { icon: MapPin, step: "03", title: "Track to resolution", desc: "Follow live status updates until your case is resolved." },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.step} className="relative rounded-2xl border border-slate-100 bg-slate-50 p-7">
                  <span className="absolute right-5 top-4 font-display text-4xl font-extrabold text-police-100">{s.step}</span>
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-police-700 text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold text-police-900">{s.title}</h3>
                  <p className="mt-2 text-sm text-slate-500">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-police-800 to-police-900 px-8 py-14 text-center text-white">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold-400/10 blur-3xl" />
          <h2 className="font-display text-3xl font-extrabold sm:text-4xl">See something? Say something.</h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-300">
            Your report could keep your community safe. It only takes a few minutes.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link to="/report" className="btn-gold text-base">
              Report a Crime <ArrowRight className="h-5 w-5" />
            </Link>
            <Link to="/track" className="btn bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/20">
              Track Existing Report
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

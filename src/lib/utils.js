import clsx from "clsx";

export function cn(...inputs) {
  return clsx(inputs);
}

export function formatDate(value) {
  const d = new Date(value);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(value) {
  const d = new Date(value);
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function generateCaseId() {
  const year = new Date().getFullYear();
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `GPS-${year}-${rand}`;
}

export const statusStyles = {
  Submitted: "bg-slate-100 text-slate-700",
  Assigned: "bg-blue-100 text-blue-700",
  "Under Investigation": "bg-amber-100 text-amber-700",
  "Pending Review": "bg-purple-100 text-purple-700",
  Resolved: "bg-emerald-100 text-emerald-700",
  Closed: "bg-slate-200 text-slate-600",
};

export const priorityStyles = {
  Low: "bg-slate-100 text-slate-600",
  Medium: "bg-blue-100 text-blue-700",
  High: "bg-amber-100 text-amber-800",
  Critical: "bg-red-100 text-red-700",
};

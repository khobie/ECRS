export const crimeCategories = [
  { id: "violent", label: "Violent Crime", types: ["Assault", "Armed Robbery", "Homicide", "Domestic Violence", "Kidnapping"] },
  { id: "property", label: "Property Crime", types: ["Burglary", "Theft", "Vandalism", "Arson", "Trespassing"] },
  { id: "financial", label: "Financial / Cyber", types: ["Fraud", "Online Scam", "Mobile Money Fraud", "Identity Theft", "Extortion"] },
  { id: "narcotics", label: "Narcotics", types: ["Drug Possession", "Drug Trafficking", "Illegal Substance Sale"] },
  { id: "traffic", label: "Traffic / Public", types: ["Reckless Driving", "Hit and Run", "Public Disturbance", "Illegal Parking"] },
  { id: "other", label: "Other", types: ["Missing Person", "Lost Property", "Suspicious Activity", "Other"] },
];

export const regions = [
  "Greater Accra",
  "Ashanti",
  "Western",
  "Eastern",
  "Central",
  "Northern",
  "Volta",
  "Bono",
  "Upper East",
  "Upper West",
];

export const landingStats = [
  { label: "Total Reports Received", value: "48,920", icon: "FileText", trend: "+12.4%" },
  { label: "Cases Under Investigation", value: "6,317", icon: "Search", trend: "+3.1%" },
  { label: "Cases Resolved", value: "31,540", icon: "ShieldCheck", trend: "+18.2%" },
  { label: "Registered Police Stations", value: "651", icon: "Building2", trend: "+5" },
];

export const features = [
  { icon: "EyeOff", title: "Anonymous Reporting", desc: "File a report without revealing your identity. Your safety comes first." },
  { icon: "Upload", title: "Upload Evidence", desc: "Attach photos, videos, audio and documents to strengthen your case." },
  { icon: "Activity", title: "Real-Time Tracking", desc: "Follow your case from submission to resolution with live updates." },
  { icon: "Lock", title: "Secure Communication", desc: "End-to-end encrypted messaging between you and investigating officers." },
  { icon: "BellRing", title: "Emergency Alerts", desc: "Receive critical safety alerts and broadcasts in your region." },
  { icon: "RefreshCw", title: "Case Updates", desc: "Get notified via SMS, email and in-app whenever your case progresses." },
];

export const dashboardStats = [
  { label: "Total Reports", value: "48,920", icon: "FileText", trend: "+12.4%", tone: "police" },
  { label: "New Reports Today", value: "184", icon: "FilePlus", trend: "+8.0%", tone: "gold" },
  { label: "Open Cases", value: "6,317", icon: "FolderOpen", trend: "-2.1%", tone: "blue" },
  { label: "Resolved Cases", value: "31,540", icon: "CheckCircle2", trend: "+18.2%", tone: "emerald" },
  { label: "High Priority", value: "212", icon: "AlertTriangle", trend: "+4", tone: "red" },
];

export const crimeTrend = [
  { month: "Jan", reports: 3200, resolved: 2100 },
  { month: "Feb", reports: 3500, resolved: 2400 },
  { month: "Mar", reports: 4100, resolved: 2900 },
  { month: "Apr", reports: 3900, resolved: 3100 },
  { month: "May", reports: 4500, resolved: 3300 },
  { month: "Jun", reports: 4200, resolved: 3600 },
  { month: "Jul", reports: 4800, resolved: 3900 },
  { month: "Aug", reports: 5100, resolved: 4200 },
  { month: "Sep", reports: 4700, resolved: 4000 },
  { month: "Oct", reports: 5300, resolved: 4500 },
  { month: "Nov", reports: 4900, resolved: 4300 },
  { month: "Dec", reports: 5600, resolved: 4900 },
];

export const reportsByRegion = [
  { region: "Gt. Accra", reports: 14200 },
  { region: "Ashanti", reports: 11800 },
  { region: "Western", reports: 5400 },
  { region: "Eastern", reports: 4900 },
  { region: "Central", reports: 4100 },
  { region: "Northern", reports: 3300 },
  { region: "Volta", reports: 2600 },
  { region: "Bono", reports: 2620 },
];

export const categoryDistribution = [
  { name: "Property Crime", value: 32, color: "#003366" },
  { name: "Violent Crime", value: 24, color: "#F4B400" },
  { name: "Financial / Cyber", value: 21, color: "#1f5d99" },
  { name: "Narcotics", value: 12, color: "#7099c2" },
  { name: "Traffic / Public", value: 7, color: "#d99e00" },
  { name: "Other", value: 4, color: "#9db7d4" },
];

export const resolutionRates = [
  { region: "Gt. Accra", rate: 71 },
  { region: "Ashanti", rate: 66 },
  { region: "Western", rate: 58 },
  { region: "Eastern", rate: 62 },
  { region: "Central", rate: 55 },
  { region: "Northern", rate: 49 },
];

export const officers = [
  "Insp. Kwame Mensah",
  "Sgt. Ama Boateng",
  "C/Insp. Yaw Owusu",
  "Insp. Akosua Darko",
  "Sgt. Kofi Asante",
  "DSP. Esi Quartey",
];

const statuses = ["Submitted", "Assigned", "Under Investigation", "Pending Review", "Resolved", "Closed"];
const priorities = ["Low", "Medium", "High", "Critical"];
const crimeTypes = ["Armed Robbery", "Burglary", "Online Scam", "Assault", "Theft", "Fraud", "Vandalism", "Drug Possession", "Hit and Run", "Domestic Violence"];
const locations = ["Osu, Accra", "Adum, Kumasi", "Takoradi", "Koforidua", "Cape Coast", "Tamale", "Ho", "Sunyani", "Madina, Accra", "Tema"];

export const reports = Array.from({ length: 28 }).map((_, i) => {
  const date = new Date(2026, 5, 9 - (i % 25));
  return {
    id: `GPS-2026-${(489201 + i).toString()}`,
    crimeType: crimeTypes[i % crimeTypes.length],
    dateReported: date.toISOString(),
    location: locations[i % locations.length],
    region: regions[i % regions.length],
    priority: priorities[i % priorities.length],
    status: statuses[i % statuses.length],
    officer: i % 4 === 0 ? "Unassigned" : officers[i % officers.length],
    anonymous: i % 3 === 0,
    reporter: i % 3 === 0 ? "Anonymous" : ["Joseph Adjei", "Fatima Iddrisu", "Grace Owusu", "Daniel Tetteh"][i % 4],
    phone: i % 3 === 0 ? "—" : "+233 24 555 01" + (10 + i),
    description:
      "Reporter describes an incident requiring police attention. Details captured at the time of filing including circumstances, persons involved and immediate impact.",
  };
});

export const trackTimeline = [
  { status: "Submitted", date: "2026-06-02T09:14:00", note: "Report received and logged into the system.", done: true },
  { status: "Assigned", date: "2026-06-02T15:40:00", note: "Case assigned to Insp. Kwame Mensah, Accra Central.", done: true },
  { status: "Under Investigation", date: "2026-06-04T10:05:00", note: "Investigation opened. Evidence under review.", done: true },
  { status: "Pending Review", date: "2026-06-08T13:22:00", note: "Findings submitted for supervisory review.", done: false },
  { status: "Resolved", date: null, note: "Case to be marked resolved upon approval.", done: false },
  { status: "Closed", date: null, note: "Case archived.", done: false },
];

export const investigationNotes = [
  { author: "Insp. Kwame Mensah", date: "2026-06-04T10:30:00", text: "Visited the scene at Osu. Collected CCTV footage from nearby shop. Two potential witnesses identified." },
  { author: "Sgt. Ama Boateng", date: "2026-06-06T14:15:00", text: "Interviewed witness 1. Statement recorded and attached. Suspect description matches earlier report." },
  { author: "Insp. Kwame Mensah", date: "2026-06-08T09:00:00", text: "Forensics confirmed fingerprints. Preparing case file for supervisory review." },
];

export const users = [
  { id: 1, name: "Nana Adusei", email: "n.adusei@ecrs.gov", role: "Super Admin", station: "HQ Accra", status: "Active", lastActive: "2026-06-10T08:20:00" },
  { id: 2, name: "DCOP Mary Asante", email: "m.asante@ecrs.gov", role: "Police Commander", station: "Ashanti Region", status: "Active", lastActive: "2026-06-10T07:55:00" },
  { id: 3, name: "Insp. Kwame Mensah", email: "k.mensah@ecrs.gov", role: "Investigator", station: "Accra Central", status: "Active", lastActive: "2026-06-09T19:40:00" },
  { id: 4, name: "Sgt. Ama Boateng", email: "a.boateng@ecrs.gov", role: "Station Officer", station: "Osu Station", status: "Active", lastActive: "2026-06-10T06:10:00" },
  { id: 5, name: "C/Insp. Yaw Owusu", email: "y.owusu@ecrs.gov", role: "Investigator", station: "Kumasi Central", status: "Disabled", lastActive: "2026-05-28T12:00:00" },
  { id: 6, name: "Insp. Akosua Darko", email: "a.darko@ecrs.gov", role: "Station Officer", station: "Takoradi Station", status: "Active", lastActive: "2026-06-09T22:05:00" },
  { id: 7, name: "Joseph Adjei", email: "joseph.adjei@gmail.com", role: "Citizen", station: "—", status: "Active", lastActive: "2026-06-08T15:30:00" },
];

export const hotspots = [
  { name: "Osu", x: 58, y: 62, level: "high", count: 142 },
  { name: "Madina", x: 70, y: 48, level: "high", count: 118 },
  { name: "Adum", x: 32, y: 40, level: "medium", count: 86 },
  { name: "Takoradi", x: 22, y: 78, level: "medium", count: 64 },
  { name: "Tamale", x: 48, y: 18, level: "low", count: 29 },
  { name: "Tema", x: 76, y: 64, level: "high", count: 103 },
];

export const stations = [
  { name: "Accra Central Station", x: 60, y: 58 },
  { name: "Kumasi Central Station", x: 34, y: 38 },
  { name: "Takoradi Station", x: 24, y: 76 },
  { name: "Tamale Station", x: 50, y: 20 },
];

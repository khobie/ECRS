export const municipality = {
  name: "Koforidua",
  region: "Eastern Region",
  country: "Ghana",
};

export const crimeCategories = [
  { id: "violent", label: "Violent Crime", types: ["Assault", "Armed Robbery", "Homicide", "Domestic Violence", "Kidnapping"] },
  { id: "property", label: "Property Crime", types: ["Burglary", "Theft", "Vandalism", "Arson", "Trespassing"] },
  { id: "financial", label: "Financial / Cyber", types: ["Fraud", "Online Scam", "Mobile Money Fraud", "Identity Theft", "Extortion"] },
  { id: "narcotics", label: "Narcotics", types: ["Drug Possession", "Drug Trafficking", "Illegal Substance Sale"] },
  { id: "traffic", label: "Traffic / Public", types: ["Reckless Driving", "Hit and Run", "Public Disturbance", "Illegal Parking"] },
  { id: "other", label: "Other", types: ["Missing Person", "Lost Property", "Suspicious Activity", "Other"] },
];

// Koforidua zones / neighborhoods (replaces national regions)
export const zones = [
  "Central Koforidua",
  "Oyoko",
  "Jumapo",
  "Betom",
  "Srodae",
  "Adweso",
  "Effiduase",
  "Old Estates",
  "Pentecost Junction",
  "Koforidua Technical Area",
];

// Alias for backward compatibility in forms
export const regions = zones;

export const landingStats = [
  { label: "Total Reports Received", value: "2,840", icon: "FileText", trend: "+9.2%" },
  { label: "Cases Under Investigation", value: "186", icon: "Search", trend: "+2.4%" },
  { label: "Cases Resolved", value: "2,104", icon: "ShieldCheck", trend: "+14.1%" },
  { label: "Police Stations in Koforidua", value: "6", icon: "Building2", trend: "+1" },
];

export const features = [
  { icon: "EyeOff", title: "Anonymous Reporting", desc: "File a report without revealing your identity. Your safety comes first." },
  { icon: "Upload", title: "Upload Evidence", desc: "Attach photos, videos, audio and documents to strengthen your case." },
  { icon: "Activity", title: "Real-Time Tracking", desc: "Follow your case from submission to resolution with live updates." },
  { icon: "Lock", title: "Secure Communication", desc: "End-to-end encrypted messaging between you and investigating officers." },
  { icon: "BellRing", title: "Emergency Alerts", desc: "Receive critical safety alerts and broadcasts in Koforidua." },
  { icon: "RefreshCw", title: "Case Updates", desc: "Get notified via SMS, email and in-app whenever your case progresses." },
];

export const dashboardStats = [
  { label: "Total Reports", value: "2,840", icon: "FileText", trend: "+9.2%", tone: "police" },
  { label: "New Reports Today", value: "12", icon: "FilePlus", trend: "+5.0%", tone: "gold" },
  { label: "Open Cases", value: "186", icon: "FolderOpen", trend: "-1.8%", tone: "blue" },
  { label: "Resolved Cases", value: "2,104", icon: "CheckCircle2", trend: "+14.1%", tone: "emerald" },
  { label: "High Priority", value: "14", icon: "AlertTriangle", trend: "+2", tone: "red" },
];

export const crimeTrend = [
  { month: "Jan", reports: 198, resolved: 142 },
  { month: "Feb", reports: 214, resolved: 158 },
  { month: "Mar", reports: 236, resolved: 171 },
  { month: "Apr", reports: 221, resolved: 180 },
  { month: "May", reports: 248, resolved: 192 },
  { month: "Jun", reports: 232, resolved: 201 },
  { month: "Jul", reports: 256, resolved: 214 },
  { month: "Aug", reports: 271, resolved: 228 },
  { month: "Sep", reports: 245, resolved: 219 },
  { month: "Oct", reports: 263, resolved: 236 },
  { month: "Nov", reports: 251, resolved: 224 },
  { month: "Dec", reports: 278, resolved: 249 },
];

export const reportsByZone = [
  { zone: "Central", reports: 620 },
  { zone: "Oyoko", reports: 410 },
  { zone: "Jumapo", reports: 380 },
  { zone: "Betom", reports: 340 },
  { zone: "Srodae", reports: 310 },
  { zone: "Adweso", reports: 285 },
  { zone: "Effiduase", reports: 260 },
  { zone: "Old Estates", reports: 235 },
];

// Alias for charts still using region key
export const reportsByRegion = reportsByZone.map((z) => ({ region: z.zone, reports: z.reports }));

export const categoryDistribution = [
  { name: "Property Crime", value: 34, color: "#003366" },
  { name: "Violent Crime", value: 22, color: "#F4B400" },
  { name: "Financial / Cyber", value: 20, color: "#1f5d99" },
  { name: "Narcotics", value: 11, color: "#7099c2" },
  { name: "Traffic / Public", value: 9, color: "#d99e00" },
  { name: "Other", value: 4, color: "#9db7d4" },
];

export const resolutionRates = [
  { zone: "Central", rate: 74 },
  { zone: "Oyoko", rate: 68 },
  { zone: "Jumapo", rate: 71 },
  { zone: "Betom", rate: 65 },
  { zone: "Srodae", rate: 69 },
  { zone: "Adweso", rate: 63 },
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
const locations = [
  "Jackson's Park, Koforidua",
  "Oyoko Main Road",
  "Jumapo Market",
  "Betom Junction",
  "Srodae High Street",
  "Adweso Lorry Station",
  "Effiduase Road",
  "Old Estates",
  "Pentecost Junction",
  "Koforidua Technical University Area",
];

export const reports = Array.from({ length: 28 }).map((_, i) => {
  const date = new Date(2026, 5, 9 - (i % 25));
  return {
    id: `KFD-2026-${(489201 + i).toString()}`,
    crimeType: crimeTypes[i % crimeTypes.length],
    dateReported: date.toISOString(),
    location: locations[i % locations.length],
    zone: zones[i % zones.length],
    region: zones[i % zones.length],
    priority: priorities[i % priorities.length],
    status: statuses[i % statuses.length],
    officer: i % 4 === 0 ? "Unassigned" : officers[i % officers.length],
    anonymous: i % 3 === 0,
    reporter: i % 3 === 0 ? "Anonymous" : ["Joseph Adjei", "Fatima Iddrisu", "Grace Owusu", "Daniel Tetteh"][i % 4],
    phone: i % 3 === 0 ? "—" : "+233 24 555 01" + (10 + i),
    description:
      "Reporter describes an incident in Koforidua requiring police attention. Details captured at the time of filing including circumstances, persons involved and immediate impact.",
  };
});

export const trackTimeline = [
  { status: "Submitted", date: "2026-06-02T09:14:00", note: "Report received and logged into ECRS Koforidua.", done: true },
  { status: "Assigned", date: "2026-06-02T15:40:00", note: "Case assigned to Insp. Kwame Mensah, Koforidua Central.", done: true },
  { status: "Under Investigation", date: "2026-06-04T10:05:00", note: "Investigation opened. Evidence under review.", done: true },
  { status: "Pending Review", date: "2026-06-08T13:22:00", note: "Findings submitted for supervisory review.", done: false },
  { status: "Resolved", date: null, note: "Case to be marked resolved upon approval.", done: false },
  { status: "Closed", date: null, note: "Case archived.", done: false },
];

export const investigationNotes = [
  { author: "Insp. Kwame Mensah", date: "2026-06-04T10:30:00", text: "Visited the scene at Jackson's Park, Koforidua. Collected CCTV footage from nearby shop. Two potential witnesses identified." },
  { author: "Sgt. Ama Boateng", date: "2026-06-06T14:15:00", text: "Interviewed witness 1. Statement recorded and attached. Suspect description matches earlier report in Oyoko." },
  { author: "Insp. Kwame Mensah", date: "2026-06-08T09:00:00", text: "Forensics confirmed fingerprints. Preparing case file for supervisory review." },
];

export const users = [
  { id: 1, name: "Nana Adusei", email: "n.adusei@ecrs.gov", role: "Super Admin", station: "Koforidua HQ", status: "Active", lastActive: "2026-06-10T08:20:00" },
  { id: 2, name: "DCOP Mary Asante", email: "m.asante@ecrs.gov", role: "Police Commander", station: "Koforidua Division", status: "Active", lastActive: "2026-06-10T07:55:00" },
  { id: 3, name: "Insp. Kwame Mensah", email: "k.mensah@ecrs.gov", role: "Investigator", station: "Koforidua Central", status: "Active", lastActive: "2026-06-09T19:40:00" },
  { id: 4, name: "Sgt. Ama Boateng", email: "a.boateng@ecrs.gov", role: "Station Officer", station: "Oyoko Post", status: "Active", lastActive: "2026-06-10T06:10:00" },
  { id: 5, name: "C/Insp. Yaw Owusu", email: "y.owusu@ecrs.gov", role: "Investigator", station: "Jumapo Post", status: "Disabled", lastActive: "2026-05-28T12:00:00" },
  { id: 6, name: "Insp. Akosua Darko", email: "a.darko@ecrs.gov", role: "Station Officer", station: "Effiduase Post", status: "Active", lastActive: "2026-06-09T22:05:00" },
  { id: 7, name: "Joseph Adjei", email: "joseph.adjei@gmail.com", role: "Citizen", station: "—", status: "Active", lastActive: "2026-06-08T15:30:00" },
];

export const hotspots = [
  { name: "Jackson's Park", x: 52, y: 48, level: "high", count: 48 },
  { name: "Oyoko", x: 68, y: 35, level: "high", count: 41 },
  { name: "Jumapo Market", x: 38, y: 58, level: "medium", count: 36 },
  { name: "Betom Junction", x: 45, y: 72, level: "medium", count: 29 },
  { name: "Srodae", x: 62, y: 65, level: "high", count: 33 },
  { name: "Adweso", x: 28, y: 42, level: "low", count: 18 },
];

export const stations = [
  { name: "Koforidua Central Station", x: 52, y: 50 },
  { name: "Koforidua Divisional HQ", x: 48, y: 44 },
  { name: "Oyoko Police Post", x: 68, y: 36 },
  { name: "Effiduase Police Post", x: 30, y: 55 },
];

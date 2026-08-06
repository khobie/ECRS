import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import PublicLayout from "./components/PublicLayout";
import DashboardLayout from "./components/DashboardLayout";
import Landing from "./pages/Landing";
import ReportCrime from "./pages/ReportCrime";
import TrackReport from "./pages/TrackReport";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import Investigation from "./pages/Investigation";
import Analytics from "./pages/Analytics";
import Users from "./pages/Users";
import NotFound from "./pages/NotFound";

function LegacyOfficerRedirect() {
  const location = useLocation();
  const rest = location.pathname.replace(/^\/dashboard/, "") || "";
  return <Navigate to={`/officer${rest}${location.search}`} replace />;
}

export default function App() {
  return (
    <Routes>
      {/* Citizen portal — public only, no officer links */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/report" element={<ReportCrime />} />
        <Route path="/track" element={<TrackReport />} />
      </Route>

      {/* Officer portal — separate URL, not linked from citizen pages */}
      <Route path="/officer/login" element={<Login />} />
      <Route path="/officer" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="reports" element={<Reports />} />
        <Route path="investigation" element={<Investigation />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="users" element={<Users />} />
      </Route>

      {/* Legacy URLs redirect to officer portal */}
      <Route path="/login" element={<Navigate to="/officer/login" replace />} />
      <Route path="/dashboard/*" element={<LegacyOfficerRedirect />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, Smartphone } from "lucide-react";
import Logo from "../components/Logo";
import { api } from "../lib/api";

export default function Login() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [step, setStep] = useState("credentials");
  const [email, setEmail] = useState("k.mensah@ecrs.gov");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCredentials = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.login(email, password);
      setStep("2fa");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    navigate("/officer");
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-police-900 lg:block">
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "28px 28px" }} />
        <div className="absolute -right-32 top-20 h-96 w-96 rounded-full bg-gold-400/10 blur-3xl" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <Logo variant="light" />
          <div>
            <h2 className="font-display text-4xl font-extrabold leading-tight">
              Command Center for <span className="text-gold-400">safer communities</span>
            </h2>
            <p className="mt-4 max-w-md text-slate-300">
              Secure access for authorized police personnel. Manage reports, investigations and
              analytics from one trusted platform.
            </p>
            <div className="mt-8 space-y-3">
              {["Token-secured sessions", "Role-based access control", "Two-factor authentication", "Full audit logging"].map((f) => (
                <div key={f} className="flex items-center gap-3 text-sm">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-white/10 text-gold-400"><ShieldCheck className="h-4 w-4" /></span>
                  {f}
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-slate-400">© {new Date().getFullYear()} ECRS · Electronic Crime Reporting System</p>
        </div>
      </div>

      <div className="flex items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden"><Logo /></div>

          {step === "credentials" ? (
            <>
              <h1 className="font-display text-2xl font-extrabold text-police-900">Officer Sign In</h1>
              <p className="mt-1 text-sm text-slate-500">Enter your credentials to access the portal.</p>

              {error && (
                <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
              )}

              <form onSubmit={handleCredentials} className="mt-8 space-y-5">
                <div>
                  <label className="label">Official Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      className="input pl-9"
                      placeholder="name@ecrs.gov"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label className="label mb-0">Password</label>
                    <a href="#" className="text-xs font-medium text-police-700 hover:underline">Forgot password?</a>
                  </div>
                  <div className="relative mt-1.5">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type={showPass ? "text" : "password"}
                      required
                      className="input px-9"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="button" onClick={() => setShowPass((s) => !s)} className="absolute right-3 top-3 text-slate-400 hover:text-slate-600">
                      {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-police-700" /> Keep me signed in
                </label>
                <button type="submit" disabled={loading} className="btn-primary w-full text-base">
                  {loading ? "Signing in…" : "Continue"} <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-police-50 text-police-700">
                <Smartphone className="h-7 w-7" />
              </div>
              <h1 className="mt-5 font-display text-2xl font-extrabold text-police-900">Two-Factor Verification</h1>
              <p className="mt-1 text-sm text-slate-500">Enter the 6-digit code sent to your registered device.</p>

              <form onSubmit={handleVerify} className="mt-8 space-y-5">
                <div className="flex justify-between gap-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <input
                      key={i}
                      maxLength={1}
                      className="input h-14 w-full text-center text-xl font-bold"
                      defaultValue={i < 3 ? [1, 9, 1][i] : ""}
                    />
                  ))}
                </div>
                <button type="submit" className="btn-primary w-full text-base">
                  Verify & Sign In <ArrowRight className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => setStep("credentials")} className="btn-ghost w-full">
                  Back to login
                </button>
              </form>
            </>
          )}

          <p className="mt-8 text-center text-sm text-slate-500">
            Not an officer?{" "}
            <Link to="/report" className="font-semibold text-police-700 hover:underline">Report a crime instead</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
import { ShieldAlert, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-police-900 p-6 text-center text-white">
      <div>
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-2xl bg-white/10 text-gold-400">
          <ShieldAlert className="h-10 w-10" />
        </div>
        <h1 className="mt-6 font-display text-6xl font-extrabold">404</h1>
        <p className="mt-2 text-xl font-semibold">Page not found</p>
        <p className="mx-auto mt-2 max-w-md text-slate-300">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn-gold mt-7 inline-flex">
          <Home className="h-4 w-4" /> Back to Home
        </Link>
      </div>
    </div>
  );
}

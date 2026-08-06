const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
const TOKEN_KEY = "ecrs_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function isLoggedIn() {
  return !!getToken();
}

async function request(path, options = {}) {
  const headers = {
    Accept: "application/json",
    ...options.headers,
  };

  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    if (res.status === 401) setToken(null);
    if (data.errors) {
      const msg = Object.values(data.errors).flat().join(" ");
      throw new Error(msg);
    }
    throw new Error(data.message || `Request failed (${res.status})`);
  }

  return data;
}

export const api = {
  login: async (email, password) => {
    const data = await request("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setToken(data.token);
    return data;
  },

  logout: async () => {
    try {
      await request("/logout", { method: "POST" });
    } finally {
      setToken(null);
    }
  },

  getMe: () => request("/user"),

  getZones: () => request("/zones"),
  getCategories: () => request("/categories"),
  getLandingStats: () => request("/landing/stats"),
  getDashboard: () => request("/dashboard"),
  getAnalytics: () => request("/analytics"),
  getReports: () => request("/reports"),
  getReport: (caseId) => request(`/reports/${encodeURIComponent(caseId.trim())}`),
  getUsers: () => request("/users"),
  getOfficers: () => request("/officers"),

  submitReport: (payload) =>
    request("/reports", { method: "POST", body: JSON.stringify(payload) }),

  trackReport: (caseId) =>
    request(`/reports/track/${encodeURIComponent(caseId.trim())}`),

  updateReport: (caseId, payload) =>
    request(`/reports/${encodeURIComponent(caseId.trim())}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  addNote: (caseId, note) =>
    request(`/reports/${encodeURIComponent(caseId.trim())}/notes`, {
      method: "POST",
      body: JSON.stringify({ note }),
    }),

  uploadEvidence: (caseId, file) => {
    const form = new FormData();
    form.append("file", file);
    return request(`/reports/${encodeURIComponent(caseId.trim())}/evidence`, {
      method: "POST",
      body: form,
    });
  },

  createUser: (payload) =>
    request("/users", { method: "POST", body: JSON.stringify(payload) }),

  updateUser: (id, payload) =>
    request(`/users/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
};

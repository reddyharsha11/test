import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT from localStorage on each request
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("auth-store");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const token = parsed?.state?.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch {
        // ignore
      }
    }
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("auth-store");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),

  signup: (name: string, email: string, password: string) =>
    api.post("/auth/signup", { name, email, password }),

  me: () => api.get("/auth/me"),

  forgotPassword: (email: string) =>
    api.post("/auth/forgot-password", { email }),

  logout: () => api.post("/auth/logout"),
};

// ─── Progress ─────────────────────────────────────────────────────────────────
export const progressApi = {
  getAll: () => api.get("/progress"),
  update: (moduleId: string, data: Record<string, unknown>) =>
    api.put(`/progress/${moduleId}`, data),
};

// ─── Settings ─────────────────────────────────────────────────────────────────
export const settingsApi = {
  get: () => api.get("/settings"),
  update: (data: Record<string, unknown>) => api.put("/settings", data),
};

// ─── Achievements ─────────────────────────────────────────────────────────────
export const achievementsApi = {
  getAll: () => api.get("/achievements"),
};

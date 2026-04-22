import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setAuth } from "../features/authSlice";
import { apiRequest, getApiBaseUrl } from "../lib/api";

const initialForm = {
  name: "",
  email: "alex@worktrack.demo",
  password: "demo12345",
};

export default function AuthScreen() {
  const dispatch = useDispatch();
  const [mode, setMode] = useState("login");
  const [formData, setFormData] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
      const payload =
        mode === "login"
          ? { email: formData.email, password: formData.password }
          : formData;
      const response = await apiRequest(endpoint, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      dispatch(setAuth({ user: response, token: response.token }));
      toast.success(mode === "login" ? "Signed in successfully" : "Account created successfully");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#dbeafe,_#f8fafc_40%,_#ffffff_70%)] dark:bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl grid lg:grid-cols-[1.15fr_0.85fr] overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white shadow-2xl shadow-blue-100/50 dark:bg-zinc-950">
        <div className="p-10 bg-slate-950 text-white">
          <p className="text-sm uppercase tracking-[0.3em] text-blue-200">WorkTrack</p>
          <h1 className="mt-6 text-4xl font-semibold leading-tight">A working project space for teams, projects, and tasks.</h1>
          <p className="mt-4 text-sm text-slate-300 leading-6">
            This local build uses your Express API directly. A demo account is already seeded so you
            can log in and verify the full flow quickly.
          </p>
          <div className="mt-8 rounded-2xl bg-white/5 p-5 text-sm text-slate-200">
            <p>Demo email: `alex@worktrack.demo`</p>
            <p className="mt-2">Demo password: `demo12345`</p>
            <p className="mt-4 text-slate-400">API base: {getApiBaseUrl()}</p>
          </div>
        </div>

        <div className="p-8 sm:p-10">
          <div className="inline-flex rounded-full bg-zinc-100 p-1 text-sm dark:bg-zinc-900">
            <button
              onClick={() => setMode("login")}
              className={`rounded-full px-4 py-2 ${mode === "login" ? "bg-white shadow dark:bg-zinc-800" : ""}`}
            >
              Login
            </button>
            <button
              onClick={() => setMode("register")}
              className={`rounded-full px-4 py-2 ${mode === "register" ? "bg-white shadow dark:bg-zinc-800" : ""}`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {mode === "register" && (
              <input
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-900"
                placeholder="Your name"
                value={formData.name}
                onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                required
              />
            )}
            <input
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-900"
              placeholder="Email"
              type="email"
              value={formData.email}
              onChange={(event) => setFormData({ ...formData, email: event.target.value })}
              required
            />
            <input
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-900"
              placeholder="Password"
              type="password"
              value={formData.password}
              onChange={(event) => setFormData({ ...formData, password: event.target.value })}
              required
              minLength={8}
            />

            <button
              disabled={isSubmitting}
              className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              {isSubmitting ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

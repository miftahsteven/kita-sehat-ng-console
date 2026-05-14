"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop')`,
        }}
      >
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white/90 p-10 shadow-2xl backdrop-blur-xl border border-white/20">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-[#0098b0]">
            Kita-Sehat<span className="text-[#103174]">.id</span>
          </h1>
          <p className="mt-3 text-slate-600 font-medium">Admin Panel CMS</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100 animate-shake">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Email Address</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white/50 p-4 text-slate-900 outline-none transition-all focus:border-[#0098b0] focus:ring-4 focus:ring-[#0098b0]/10"
                placeholder="email address"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white/50 p-4 text-slate-900 outline-none transition-all focus:border-[#0098b0] focus:ring-4 focus:ring-[#0098b0]/10"
              placeholder="••••••••••••"
              required
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
              <input type="checkbox" className="rounded border-slate-300 text-[#0098b0] focus:ring-[#0098b0]" />
              Remember me
            </label>
            <a href="#" className="font-medium text-[#0098b0] hover:underline">Forgot password?</a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full overflow-hidden rounded-xl bg-[#0098b0] p-4 font-bold text-white shadow-lg shadow-cyan-500/30 transition-all hover:bg-[#007a8d] hover:shadow-cyan-500/40 active:scale-[0.98] disabled:opacity-50"
          >
            <span className="relative z-10">
              {loading ? "Verifying..." : "Login to Dashboard"}
            </span>
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full"></div>
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} Kita-Sehat.id NG. All rights reserved.
        </div>
      </div>
    </div>
  );
}

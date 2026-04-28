"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/dashboard/bookings";

  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [shake, setShake] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password.trim()) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push(from);
        router.refresh();
      } else {
        const data = await res.json();
        setStatus("error");
        setErrorMsg(data.error || "كلمة المرور غير صحيحة");
        setPassword("");
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    } catch {
      setStatus("error");
      setErrorMsg("تعذر الاتصال بالخادم");
    }
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 px-4"
    >
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-sky-600/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl" />
      </div>

      <div
        className={`relative w-full max-w-sm transition-all ${shake ? "animate-[shake_0.4s_ease]" : ""}`}
        style={shake ? { animation: "shake 0.4s ease" } : {}}
      >
        {/* Card */}
        <div className="rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-8">

          {/* Logo / Icon */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-3xl mb-4 shadow-lg">
              🏖️
            </div>
            <h1 className="text-2xl font-black text-white">Moodstay</h1>
            <p className="text-sky-300 text-sm mt-1 font-medium">لوحة تحكم المالك</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-white/70 mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setStatus("idle"); setErrorMsg(""); }}
                  placeholder="••••••••"
                  autoFocus
                  className="w-full rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all"
                />
                {/* Toggle show password */}
                <button
                  type="button"
                  onClick={() => setShow(s => !s)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors text-lg"
                  tabIndex={-1}
                >
                  {show ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Error */}
            {errorMsg && (
              <div className="flex items-center gap-2 rounded-xl bg-red-500/20 border border-red-400/30 px-4 py-3 text-sm text-red-300">
                <span>❌</span>
                {errorMsg}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={status === "loading" || !password.trim()}
              className="w-full py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm transition-all shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2"
            >
              {status === "loading" ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="white" strokeOpacity=".3" strokeWidth="4"/>
                    <path d="M4 12a8 8 0 018-8" stroke="white" strokeWidth="4" strokeLinecap="round"/>
                  </svg>
                  جارٍ التحقق...
                </>
              ) : (
                <>🔐 دخول للداشبورد</>
              )}
            </button>
          </form>

          <p className="text-center text-white/30 text-xs mt-6">
            للمالك فقط · Moodstay Admin
          </p>
        </div>
      </div>

      {/* Shake keyframe */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-8px); }
          40%       { transform: translateX(8px); }
          60%       { transform: translateX(-5px); }
          80%       { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
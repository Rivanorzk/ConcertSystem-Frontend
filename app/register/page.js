"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CalendarDays,
  ShieldCheck,
  CheckCircle2,
  Phone,
  XCircle,
  AlertCircle,
  Sparkles,
} from "lucide-react";

import AuthLogo from "@/components/authLogo";
import AuthInput from "@/components/authInput";
import useAuth from "@/hooks/useAuth";
import { register as registerService } from "@/services/authService";

const STRENGTH_LABELS = ["Sangat lemah", "Lemah", "Cukup", "Kuat", "Sangat kuat"];
const STRENGTH_COLORS = ["#D8A7A7", "#D8A7A7", "#D4A537", "#7A1F2B", "#5B0F18"];

function getPasswordStrength(password) {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return Math.min(score, 4);
}

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState(null);

  const [usernameValid, setUsernameValid] = useState(null);
  const [emailValid, setEmailValid] = useState(null);
  const [phoneValid, setPhoneValid] = useState(null);
  const [passwordValid, setPasswordValid] = useState(null);
  const [confirmValid, setConfirmValid] = useState(null);

  // ... setelah state lainnya
  const [dots, setDots] = useState([]);

  useEffect(() => {
    // Hanya berjalan di klien
    const newDots = Array.from({ length: 20 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 12 + Math.random() * 18,
      delay: Math.random() * 12,
      opacity: 0.2 + Math.random() * 0.3,
    }));
    setDots(newDots);
  }, []);

  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Spotlight interaktif yang mengikuti kursor di sisi branding
  const brandRef = useRef(null);
  const [spot, setSpot] = useState({ x: 50, y: 50 });
  const handleBrandMouseMove = (e) => {
    const rect = brandRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setSpot({ x, y });
  };

  const strength = useMemo(
    () => getPasswordStrength(form.password),
    [form.password]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "username") setUsernameValid(value.length >= 3);
    if (name === "email") {
      setEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
    }
    if (name === "phone") {
      setPhoneValid(/^08[0-9]{8,11}$/.test(value));
    }
    if (name === "password") {
      setPasswordValid(value.length >= 8);
      if (form.confirmPassword) {
        setConfirmValid(value === form.confirmPassword);
      }
    }
    if (name === "confirmPassword") {
      setConfirmValid(value === form.password);
    }
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !form.username ||
      !form.email ||
      !form.phone ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("Semua field wajib diisi.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Password dan konfirmasi password tidak sama.");
      return;
    }
    if (!agreeTerms) {
      setError("Kamu harus menyetujui Terms of Service dan Privacy Policy.");
      return;
    }

    setLoading(true);

    try {
      const response = await registerService({
        username: form.username,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });

      const token = response?.data?.token || response?.token;
      const userData = response?.data?.user || response?.user || null;

      if (token) {
        const authenticatedUser = await login(token, userData);
        const target =
          authenticatedUser?.role === "admin"
            ? "/admin/dashboard"
            : authenticatedUser?.role === "superadmin"
            ? "/superadmin/dashboard"
            : "/customer/dashboard";
        router.replace(target);
        router.refresh();
        return;
      }

      router.replace("/login?registered=true");
    } catch (err) {
      console.error("Registration failed:", err);
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Registrasi gagal. Silakan coba lagi."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[#F8F1E7]">
      {/* Background dekoratif dinamis */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#F8F1E7] via-[#F1E4DA] to-[#E8D5CC]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom_right,_#D8A7A7_0%,_transparent_60%)] opacity-40" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,_#D4A537_0%,_transparent_50%)] opacity-20" />

      <div className="absolute left-8 top-8 h-48 w-48 rounded-full bg-[#D8A7A7]/10 blur-3xl animate-pulse" />
      <div className="absolute bottom-8 right-8 h-56 w-56 rounded-full bg-[#D4A537]/10 blur-3xl animate-pulse delay-1000" />
      <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7A1F2B]/5 blur-3xl animate-pulse delay-700" />

      <div
        className={`grid h-full w-full grid-cols-1 lg:grid-cols-2 transition-all duration-700 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* SISI KIRI - Branding interaktif */}
        <section
          ref={brandRef}
          onMouseMove={handleBrandMouseMove}
          className="relative hidden h-full flex-col justify-between overflow-hidden bg-gradient-to-br from-[#5B0F18] via-[#7A1F2B] to-[#3A0810] p-10 text-[#F8F1E7] lg:flex xl:p-14"
        >
          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-300"
            style={{
              background: `radial-gradient(600px circle at ${spot.x}% ${spot.y}%, rgba(212,165,55,0.15), transparent 40%)`,
            }}
          />

          <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-[#D4A537]/10 blur-2xl animate-spin-slow" />
          <div className="absolute -bottom-12 -left-12 h-56 w-56 rounded-full bg-[#D8A7A7]/10 blur-2xl animate-spin-slower" />

          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {dots.map((dot, i) => (
              <div
                key={i}
                className="absolute h-1 w-1 rounded-full bg-white/30 animate-float"
                style={{
                  left: dot.left + "%",
                  top: dot.top + "%",
                  animationDuration: dot.duration + "s",
                  animationDelay: dot.delay + "s",
                  opacity: dot.opacity,
                }}
              />
            ))}
          </div>

          <div className="relative z-10">
            <AuthLogo dark />
          </div>

          <div className="relative z-10 max-w-sm animate-fade-up">
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[#D8A7A7]/20 bg-[#D8A7A7]/10 px-3 py-1 text-xs font-medium backdrop-blur-sm">
              <Sparkles className="h-3 w-3" />
              Your events, your experience.
            </span>
            <h1 className="text-3xl font-bold leading-tight tracking-tight">
              {["Your next", "experience", "starts here."].map((line, idx) => (
                <span
                  key={idx}
                  className="block animate-fade-up"
                  style={{ animationDelay: `${idx * 120}ms` }}
                >
                  {line}
                </span>
              ))}
            </h1>
            <p className="mt-3 text-sm text-[#D8A7A7] leading-relaxed">
              Buat akun Eventify dan mulai temukan berbagai
              event menarik yang sesuai dengan minatmu.
            </p>
            <div className="mt-5 space-y-2">
              {[
                { icon: CalendarDays, text: "Temukan event favoritmu" },
                { icon: ShieldCheck, text: "Pesan tiket dengan mudah" },
                { icon: CheckCircle2, text: "Kelola semua tiketmu" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="group flex items-center gap-2.5 transition-transform duration-300 hover:translate-x-1.5"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#D8A7A7]/15 transition-colors duration-300 group-hover:bg-[#D4A537]/25">
                    <item.icon className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs text-[#F8F1E7]/90">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-2 text-xs text-[#D8A7A7] animate-fade-up">
            <div className="flex -space-x-1.5">
              <div className="h-6 w-6 rounded-full border-2 border-[#5B0F18] bg-[#D8A7A7] transition-transform duration-300 hover:z-10 hover:scale-110" />
              <div className="h-6 w-6 rounded-full border-2 border-[#5B0F18] bg-[#7A1F2B] transition-transform duration-300 hover:z-10 hover:scale-110" />
              <div className="h-6 w-6 rounded-full border-2 border-[#5B0F18] bg-[#F8F1E7] transition-transform duration-300 hover:z-10 hover:scale-110" />
            </div>
            <span>Join thousands of event enthusiasts</span>
          </div>
        </section>

        {/* SISI KANAN - Form, fullscreen, scrollable jika perlu */}
        <section className="flex h-full items-center justify-center overflow-y-auto bg-white/40 px-6 py-8 backdrop-blur-sm sm:px-10 lg:px-14 xl:px-20">
          <div className="w-full max-w-sm">
            <div className="mb-4 flex justify-center lg:hidden animate-fade-up">
              <AuthLogo />
            </div>

            <div className="mb-4 animate-fade-up">
              <h2 className="text-2xl font-bold text-[#1E1E1E] tracking-tight">
                Create your account
              </h2>
              <p className="text-xs text-[#737373]">
                Start your journey with Eventify today.
              </p>
            </div>

            <div
              className={`transition-all duration-300 overflow-hidden ${
                error ? "max-h-20 mb-3 opacity-100" : "max-h-0 mb-0 opacity-0"
              }`}
            >
              <div className="flex items-start gap-2 rounded-lg border border-[#E8B8B8] bg-[#FFF4F4] px-3 py-2 animate-shake">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#7A1F2B]" />
                <p className="text-xs text-[#7A1F2B] leading-relaxed">{error}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-2.5">
              <div className="animate-fade-up" style={{ animationDelay: "60ms" }}>
                <AuthInput
                  id="username"
                  name="username"
                  type="text"
                  label="Username"
                  placeholder="Your username"
                  icon={User}
                  value={form.username}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("username")}
                  onBlur={() => setFocusedField(null)}
                  autoComplete="username"
                  disabled={loading}
                  className={`transition-all duration-300 focus-within:ring-2 focus-within:ring-[#D4A537] focus-within:border-transparent ${
                    focusedField === "username" ? "scale-[1.01]" : ""
                  }`}
                  rightElement={
                    usernameValid !== null && form.username.length > 0 && (
                      <div className="flex items-center">
                        {usernameValid ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                        ) : (
                          <XCircle className="h-3.5 w-3.5 text-red-400" />
                        )}
                      </div>
                    )
                  }
                />
              </div>

              <div className="animate-fade-up" style={{ animationDelay: "100ms" }}>
                <AuthInput
                  id="email"
                  name="email"
                  type="email"
                  label="Email address"
                  placeholder="you@example.com"
                  icon={Mail}
                  value={form.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  autoComplete="email"
                  disabled={loading}
                  className={`transition-all duration-300 focus-within:ring-2 focus-within:ring-[#D4A537] focus-within:border-transparent ${
                    focusedField === "email" ? "scale-[1.01]" : ""
                  }`}
                  rightElement={
                    emailValid !== null && form.email.length > 0 && (
                      <div className="flex items-center">
                        {emailValid ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                        ) : (
                          <XCircle className="h-3.5 w-3.5 text-red-400" />
                        )}
                      </div>
                    )
                  }
                />
              </div>

              <div className="animate-fade-up" style={{ animationDelay: "140ms" }}>
                <AuthInput
                  id="phone"
                  name="phone"
                  type="tel"
                  label="Phone number"
                  placeholder="08xxxxxxxxxx"
                  icon={Phone}
                  value={form.phone}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("phone")}
                  onBlur={() => setFocusedField(null)}
                  autoComplete="tel"
                  disabled={loading}
                  className={`transition-all duration-300 focus-within:ring-2 focus-within:ring-[#D4A537] focus-within:border-transparent ${
                    focusedField === "phone" ? "scale-[1.01]" : ""
                  }`}
                  rightElement={
                    phoneValid !== null && form.phone.length > 0 && (
                      <div className="flex items-center">
                        {phoneValid ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                        ) : (
                          <XCircle className="h-3.5 w-3.5 text-red-400" />
                        )}
                      </div>
                    )
                  }
                />
              </div>

              <div className="animate-fade-up" style={{ animationDelay: "180ms" }}>
                <AuthInput
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  placeholder="Create a password"
                  icon={Lock}
                  value={form.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  autoComplete="new-password"
                  disabled={loading}
                  className={`transition-all duration-300 focus-within:ring-2 focus-within:ring-[#D4A537] focus-within:border-transparent ${
                    focusedField === "password" ? "scale-[1.01]" : ""
                  }`}
                  rightElement={
                    <>
                      {passwordValid !== null && form.password.length > 0 && (
                        <div className="mr-1 flex items-center">
                          {passwordValid ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                          ) : (
                            <XCircle className="h-3.5 w-3.5 text-red-400" />
                          )}
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="text-[#A68C8C] transition-all duration-200 hover:text-[#5B0F18] hover:scale-110"
                      >
                        {showPassword ? (
                          <EyeOff className="h-3.5 w-3.5" />
                        ) : (
                          <Eye className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </>
                  }
                />

                {/* Indikator kekuatan password, dinamis mengikuti input */}
                <div
                  className={`mt-1 flex items-center gap-1.5 overflow-hidden transition-all duration-300 ${
                    form.password.length > 0
                      ? "max-h-6 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="flex flex-1 gap-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-1 flex-1 rounded-full bg-[#E5D6D0] transition-colors duration-300"
                        style={{
                          backgroundColor:
                            i < strength
                              ? STRENGTH_COLORS[strength]
                              : "#E5D6D0",
                        }}
                      />
                    ))}
                  </div>
                  <span
                    className="text-[9px] font-medium transition-colors duration-300"
                    style={{ color: STRENGTH_COLORS[strength] }}
                  >
                    {STRENGTH_LABELS[strength]}
                  </span>
                </div>
              </div>

              <div className="animate-fade-up" style={{ animationDelay: "220ms" }}>
                <AuthInput
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  label="Confirm password"
                  placeholder="Confirm your password"
                  icon={Lock}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("confirmPassword")}
                  onBlur={() => setFocusedField(null)}
                  autoComplete="new-password"
                  disabled={loading}
                  className={`transition-all duration-300 focus-within:ring-2 focus-within:ring-[#D4A537] focus-within:border-transparent ${
                    focusedField === "confirmPassword" ? "scale-[1.01]" : ""
                  }`}
                  rightElement={
                    <>
                      {confirmValid !== null &&
                        form.confirmPassword.length > 0 && (
                          <div className="mr-1 flex items-center">
                            {confirmValid ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                            ) : (
                              <XCircle className="h-3.5 w-3.5 text-red-400" />
                            )}
                          </div>
                        )}
                      <button
                        type="button"
                        onClick={() => setShowConfirm((prev) => !prev)}
                        className="text-[#A68C8C] transition-all duration-200 hover:text-[#5B0F18] hover:scale-110"
                      >
                        {showConfirm ? (
                          <EyeOff className="h-3.5 w-3.5" />
                        ) : (
                          <Eye className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </>
                  }
                />
              </div>

              <div className="flex items-start gap-1.5 pt-0.5">
                <input
                  id="terms"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  disabled={loading}
                  className="mt-0.5 h-3 w-3 shrink-0 rounded border-[#D8A7A7] accent-[#7A1F2B] transition-all duration-200 hover:scale-110"
                />
                <label
                  htmlFor="terms"
                  className="cursor-pointer text-[8px] leading-relaxed text-[#737373] transition hover:text-[#1E1E1E]"
                >
                  I agree to Eventify's{" "}
                  <Link
                    href="/terms"
                    className="font-medium text-[#7A1F2B] transition hover:text-[#5B0F18] underline-offset-2 hover:underline"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="font-medium text-[#7A1F2B] transition hover:text-[#5B0F18] underline-offset-2 hover:underline"
                  >
                    Privacy Policy
                  </Link>
                  .
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative flex h-9 w-full items-center justify-center gap-1.5 overflow-hidden rounded-lg bg-[#5B0F18] text-[11px] font-semibold text-[#F8F1E7] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#7A1F2B] hover:shadow-lg hover:shadow-[#5B0F18]/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {loading ? (
                  <>
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-[#F8F1E7]/30 border-t-[#F8F1E7]" />
                    Creating...
                  </>
                ) : (
                  <>
                    Create account
                    <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shimmer" />
              </button>
            </form>

            <div className="mt-3 text-center">
              <p className="text-[10px] text-[#737373]">
                Sudah memiliki akun?{" "}
                <Link
                  href="/login"
                  className="relative font-semibold text-[#7A1F2B] transition hover:text-[#5B0F18] after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:bg-[#7A1F2B] after:transition-all after:duration-300 hover:after:w-full"
                >
                  Login
                </Link>
              </p>
            </div>

            <p className="mt-2 text-center text-[8px] leading-relaxed text-[#A68C8C]">
              By creating an account, you agree to Eventify's{" "}
              <Link
                href="/terms"
                className="text-[#7A1F2B] transition hover:underline underline-offset-2"
              >
                Terms
              </Link>{" "}
              &{" "}
              <Link
                href="/privacy"
                className="text-[#7A1F2B] transition hover:underline underline-offset-2"
              >
                Privacy
              </Link>
            </p>
          </div>
        </section>
      </div>

      <style jsx>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.2; }
          50% { transform: translateY(-20px) scale(1.5); opacity: 0.6; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-slower {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        .animate-fade-up { opacity: 0; animation: fadeUp 0.6s ease-out forwards; }
        .animate-shake { animation: shake 0.3s ease-in-out; }
        .animate-shimmer { animation: shimmer 1.2s infinite; }
        .animate-float { animation: float ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .animate-spin-slower { animation: spin-slower 30s linear infinite; }
      `}</style>
    </main>
  );
}
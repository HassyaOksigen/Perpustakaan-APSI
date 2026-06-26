import React, { useState, useEffect, useRef } from "react";
import {
  BookOpen,
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  GraduationCap,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient"; // Pastikan path import ini benar

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!cardRef.current) return;
      const xAxis = (window.innerWidth / 2 - e.pageX) / 100;
      const yAxis = (window.innerHeight / 2 - e.pageY) / 100;
      cardRef.current.style.transform = `perspective(1000px) rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1. Cek di tabel admin
      const { data: adminData } = await supabase
        .from("admin")
        .select("*")
        .eq("email", email)
        .eq("password", password)
        .single();

      if (adminData) {
        localStorage.setItem("user_email", adminData.email);
        localStorage.setItem("role", "admin");
        navigate("/admin");
        return;
      }

      // 2. Cek di tabel anggota
      const { data: anggotaData } = await supabase
        .from("anggota")
        .select("*")
        .eq("email", email)
        .eq("password", password)
        .single();

      if (anggotaData) {
        localStorage.setItem("user_email", anggotaData.email);
        localStorage.setItem("role", "user");
        navigate("/catalog");
        return;
      }

      // 3. Jika tidak ditemukan
      alert("Akses Ditolak! Email atau password salah.");
    } catch (error) {
      console.error("Login Error:", error);
      alert("Terjadi kesalahan saat login, silakan coba lagi.");
    }
  };

  return (
    <div className="bg-background min-h-screen flex flex-col font-body text-on-background antialiased selection:bg-primary selection:text-white">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(177,209,253,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,47,89,0.05),transparent_40%)]"></div>
      </div>

      <main className="flex-grow flex items-center justify-center px-6 py-12 relative z-10">
        <div className="w-full max-w-[480px]">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary mb-6 shadow-xl shadow-primary/20">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-display font-bold text-primary mb-2 tracking-tight">UNAIR Library</h1>
            <p className="text-on-surface-variant">Access the gateway to academic excellence.</p>
          </div>

          <div ref={cardRef} className="glass-card rounded-[32px] p-10 shadow-2xl shadow-primary/5 transition-transform duration-75 ease-out">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-on-surface">Welcome Back</h2>
              <p className="text-on-surface-variant mt-1 text-sm">Please enter your credentials to continue.</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="identifier" className="text-sm font-semibold text-on-surface flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  Username or Email
                </label>
                <div className="relative group">
                  <input
                    id="identifier"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. nim@student.unair.ac.id"
                    className="w-full px-4 py-3.5 bg-surface-container-low border border-outline-variant/50 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-200 text-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="text-sm font-semibold text-on-surface flex items-center gap-2">
                    <Lock className="w-4 h-4 text-primary" />
                    Password
                  </label>
                </div>
                <div className="relative group">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3.5 bg-surface-container-low border border-outline-variant/50 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-200 text-sm"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/60 hover:text-primary transition-colors p-1">
                    {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <input id="remember" type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer" />
                <label htmlFor="remember" className="ml-3 text-sm text-on-surface-variant cursor-pointer select-none">Remember me on this device</label>
              </div>

              <button type="submit" className="w-full py-4 bg-primary text-white font-semibold rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary-container transition-all flex items-center justify-center gap-2 text-sm cursor-pointer">
                Log In to Dashboard <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-outline-variant/30"></div></div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest font-semibold">
                <span className="bg-white/80 px-4 text-on-surface-variant/50 backdrop-blur-sm rounded">Or Securely Join With</span>
              </div>
            </div>

            <button type="button" className="w-full py-3.5 bg-surface-container-highest/50 border border-outline-variant/30 text-on-surface font-semibold rounded-2xl hover:bg-surface-container-highest transition-all flex items-center justify-center gap-3 text-sm cursor-pointer">
              <GraduationCap className="w-5 h-5 text-primary" />
              Sign in with AirlanggaID
            </button>
          </div>

          <div className="mt-8 text-center text-sm">
            <p className="text-on-surface-variant">Don't have an account? <Link to="/register" className="font-semibold text-primary hover:underline">Register with University ID</Link></p>
          </div>
        </div>
      </main>

      <footer className="w-full py-12 relative z-10 border-t border-outline-variant/50 bg-surface-container/30 backdrop-blur-sm text-sm text-center">
        <p className="text-xs text-on-surface-variant">© 2024 Universitas Airlangga Library. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
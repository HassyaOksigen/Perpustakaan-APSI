import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient"; // Pastikan path import ini benar
import {
  BookOpen,
  Check,
  User,
  IdCard,
  Phone,
  AtSign,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";

export default function Register() {
  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    identifier: "",
    phone: "",
    username: "",
    email: "",
    password: "",
    terms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Menghubungkan ke tabel 'anggota' di Supabase
      const { error } = await supabase.from("anggota").insert([
        {
          nama_anggota: formData.fullName,
          username_anggota: formData.username,
          no_hp: formData.phone,
          email: formData.email,
          password: formData.password,
          tanggal_daftar: new Date().toISOString().split('T')[0],
          status_anggota: true,
        },
      ]);

      if (error) throw error;

      setIsSuccess(true);
      alert("Pendaftaran berhasil! Akun telah terdaftar di database.");
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal mendaftar: " + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 lg:p-8 bg-background font-body text-on-background overflow-x-hidden selection:bg-primary selection:text-white">
      <div className="fixed inset-0 z-[-1] opacity-40 bg-[radial-gradient(#b1d1fd_1px,transparent_1px)] [background-size:16px_16px]"></div>

      <main className="w-full max-w-[1100px] bg-surface-container-lowest rounded-[32px] overflow-hidden flex flex-col lg:flex-row shadow-2xl border border-outline-variant/30">
        <section className="lg:w-[42%] bg-primary p-6 lg:p-12 text-white relative flex flex-col justify-between">
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_0.5px,transparent_0.5px)] [background-size:24px_24px]"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-16">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/20">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight">UNAIR Library</span>
            </div>

            <h1 className="font-display font-bold text-3xl lg:text-5xl mb-6 leading-tight">
              Begin Your Academic Journey
            </h1>
            <p className="text-white/80 mb-10 max-w-sm text-sm leading-relaxed">
              Join the Universitas Airlangga library community to access millions of global research resources.
            </p>

            <ul className="space-y-5">
              {["Institutional Journal Access", "E-Book Lending & Reservations", "Global Research Repository"].map((item, index) => (
                <li key={index} className="flex items-center gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-blue-200" strokeWidth={3} />
                  </div>
                  <span className="text-sm font-medium text-white/90">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-20 lg:mt-0 relative z-10">
            <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <p className="text-white/70 mb-3 italic text-xs leading-relaxed">"Information is the catalyst of innovation."</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-surface-variant overflow-hidden shrink-0 border border-white/20">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBK7igCM9FPaUaFNlvQKDQaCkW1t_UmgX9FcVlPPCV6Ca5jBr7s3ynAsJ1pHTLaG8uIrv_jV5ftT-B4Y8mx57V1R8Jrs5dGCsM2_yFO5dfhbq98Dl5aZ7Ae7qvumJrRIKDyo-3knKSi8vm2UA9_LHpyEY9JnyabU_XA2a2TDggPqEPu-OQCE3hkAnc4OOE9Xz3CA25FR7hzP562eZ0tJLFncv4Muaiit6riS70ZuN7G6P-iiTmlN0uePAvwkqT0zH3BG7EYgmFITTQ" alt="Rector UNAIR" className="w-full h-full object-cover" />
                </div>
                <span className="text-xs font-semibold text-white">— Rector, Universitas Airlangga</span>
              </div>
            </div>
          </div>
        </section>

        <section className="flex-1 p-6 lg:p-16 bg-surface-container-lowest flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <header className="mb-8 text-center lg:text-left">
              <h2 className="font-display font-bold text-3xl text-on-surface mb-1">Create Account</h2>
              <p className="text-sm text-on-surface-variant">Step into our digital knowledge ecosystem.</p>
            </header>

            <div className="bg-surface-container-low p-1.5 rounded-2xl flex mb-8 border border-outline-variant/30">
              <button type="button" onClick={() => setRole("student")} className={`flex-1 py-3 px-4 rounded-xl font-semibold text-xs transition-all duration-200 cursor-pointer ${role === "student" ? "bg-surface-container-lowest shadow-sm text-primary" : "text-on-surface-variant hover:text-on-surface"}`}>Student</button>
              <button type="button" onClick={() => setRole("staff")} className={`flex-1 py-3 px-4 rounded-xl font-semibold text-xs transition-all duration-200 cursor-pointer ${role === "staff" ? "bg-surface-container-lowest shadow-sm text-primary" : "text-on-surface-variant hover:text-on-surface"}`}>Staff / Faculty</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="font-semibold text-on-surface block ml-1 text-xs">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/40" />
                    <input name="fullName" value={formData.fullName} onChange={handleChange} type="text" placeholder="Airlangga Satria" required className="w-full pl-11 pr-4 py-3 rounded-xl border border-outline-variant/50 bg-surface-container-lowest focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all outline-none text-xs" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-on-surface block ml-1 text-xs">{role === "student" ? "NIM *" : "NIP *"}</label>
                  <div className="relative">
                    <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/40" />
                    <input name="identifier" value={formData.identifier} onChange={handleChange} type="text" placeholder={role === "student" ? "e.g. 123456789" : "e.g. 198012..."} required className="w-full pl-11 pr-4 py-3 rounded-xl border border-outline-variant/50 bg-surface-container-lowest focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all outline-none text-xs" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="font-semibold text-on-surface block ml-1 text-xs">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/40" />
                    <input name="phone" value={formData.phone} onChange={handleChange} type="tel" placeholder="+62 812..." className="w-full pl-11 pr-4 py-3 rounded-xl border border-outline-variant/50 bg-surface-container-lowest focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all outline-none text-xs" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-on-surface block ml-1 text-xs">Username *</label>
                  <div className="relative">
                    <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/40" />
                    <input name="username" value={formData.username} onChange={handleChange} type="text" placeholder="airlangga.s" required className="w-full pl-11 pr-4 py-3 rounded-xl border border-outline-variant/50 bg-surface-container-lowest focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all outline-none text-xs" />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-on-surface block ml-1 text-xs">Email Address (@unair.ac.id) *</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/40" />
                  <input name="email" value={formData.email} onChange={handleChange} type="email" placeholder="example@student.unair.ac.id" required className="w-full pl-11 pr-4 py-3 rounded-xl border border-outline-variant/50 bg-surface-container-lowest focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all outline-none text-xs" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-on-surface block ml-1 text-xs">Password *</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/40" />
                  <input name="password" value={formData.password} onChange={handleChange} type={showPassword ? "text" : "password"} placeholder="••••••••••••" required className="w-full pl-11 pr-11 py-3 rounded-xl border border-outline-variant/50 bg-surface-container-lowest focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all outline-none text-xs" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 hover:text-primary transition-colors p-1">
                    {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-3 py-1">
                <input id="terms" name="terms" checked={formData.terms} onChange={handleChange} type="checkbox" required className="mt-0.5 w-4 h-4 rounded border-outline-variant/50 text-primary focus:ring-primary/20 bg-surface-container-lowest cursor-pointer shrink-0" />
                <label htmlFor="terms" className="text-xs text-on-surface-variant leading-relaxed cursor-pointer select-none">
                  I agree to the <a href="#" className="text-primary font-semibold hover:underline">Terms of Service</a> and <a href="#" className="text-primary font-semibold hover:underline">Library Ethics Policy</a>.
                </label>
              </div>

              <button type="submit" disabled={isProcessing || isSuccess} className={`w-full py-3.5 px-6 rounded-xl font-semibold shadow-lg transition-all duration-200 flex items-center justify-center gap-2 text-xs cursor-pointer ${isSuccess ? "bg-emerald-600 text-white shadow-emerald-600/20" : "bg-primary text-white shadow-primary/20 hover:bg-primary-container active:scale-[0.99]"}`}>
                {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
                {isProcessing ? "Processing..." : isSuccess ? "Account Created!" : "Create Membership"}
              </button>

              <p className="text-center text-on-surface-variant mt-6 text-xs">
                Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Login here</Link>
              </p>
            </form>
          </div>
        </section>
      </main>

      <footer className="fixed bottom-4 w-full text-center pointer-events-none hidden lg:block">
        <p className="text-xs font-semibold text-on-surface-variant/60">© 2024 Universitas Airlangga Library. Digital Excellence.</p>
      </footer>
    </div>
  );
}
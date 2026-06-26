import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Handshake,
  Banknote,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  Plus,
  User,
  Fingerprint,
  Layers,
  Mail,
  Home,
  Info,
  CheckCircle2,
  History,
  CheckCheck,
  Loader2,
  BookCheck,
} from "lucide-react";

export default function MemberManagement() {
  const navigate = useNavigate();

  // State untuk Data Input Form
  const [formData, setFormData] = useState({
    name: "",
    idNumber: "",
    category: "",
    email: "",
    address: "",
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // State untuk Daftar Aktivitas Terkini (Bisa bertambah otomatis saat submit!)
  const [recentActivity, setRecentActivity] = useState([
    { id: 1, name: "Ahmad Subarjo", role: "Student", time: "2 mins ago" },
    { id: 2, name: "Dr. Siti Aminah", role: "Staff", time: "1 hour ago" },
  ]);

  const handleAdminLogout = () => {
    if (
      confirm(
        "Apakah Anda yakin ingin keluar dari portal Admin (admin@gmail.com)?",
      )
    ) {
      localStorage.clear();
      navigate("/login");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Terjemahan & Peningkatan dari script submit aslimu:
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setShowToast(true);

      const newEntry = {
        id: Date.now(),
        name: formData.name,
        role:
          formData.category.charAt(0).toUpperCase() +
          formData.category.slice(1),
        time: "Just now",
      };
      setRecentActivity((prev) => [newEntry, ...prev]);
      setFormData({
        name: "",
        idNumber: "",
        category: "",
        email: "",
        address: "",
      });

      setTimeout(() => {
        setShowToast(false);

        navigate("/edit-member");
      }, 1500);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background font-body text-on-surface antialiased overflow-x-hidden selection:bg-secondary-container">
      {/* SIDEBAR KIRI (Tetap melayang fixed) */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-surface-container-low shadow-sm flex flex-col py-6 space-y-2 border-r border-outline-variant/30 z-40">
        <div className="px-6 mb-8">
          <h1 className="font-display font-bold text-2xl text-primary tracking-tight">
            UNAIR Admin
          </h1>
          <p className="text-xs font-semibold text-on-surface-variant/70 tracking-wider uppercase mt-0.5">
            Staff Portal
          </p>
        </div>

        <nav className="flex-1 px-3 space-y-1 text-xs font-semibold">
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3.5 text-on-surface-variant hover:bg-surface-container-highest transition-colors rounded-xl"
          >
            <LayoutDashboard className="w-4 h-4 text-primary" />
            <span>Dashboard</span>
          </a>
          <Link
            to="/catalog-admin"
            className="flex items-center gap-3 px-4 py-3.5 text-on-surface-variant hover:bg-surface-container-highest transition-colors rounded-xl"
          >
            <BookOpen className="w-4 h-4 text-primary" />
            <span>Catalog Admin</span>
          </Link>

          {/* MENU AKTIF: Member Management */}
          <Link
            to="/member-management"
            className="flex items-center gap-3 px-4 py-3.5 bg-secondary-container text-on-secondary-container font-bold rounded-xl shadow-sm"
          >
            <Users className="w-4 h-4 text-primary font-extrabold" />
            <span>Member Management</span>
          </Link>

          <Link
            to="/admin"
            className="flex items-center gap-3 px-4 py-3.5 text-on-surface-variant hover:bg-surface-container-highest transition-colors rounded-xl"
          >
            <Handshake className="w-4 h-4 text-primary" />
            <span>Loan Processing</span>
          </Link>
          <Link
            to="/fine-management"
            className="flex items-center gap-3 px-4 py-3.5 text-on-surface-variant hover:bg-surface-container-highest transition-colors rounded-xl"
          >
            <Banknote className="w-4 h-4 text-primary" />
            <span>Returns & Fines</span>
          </Link>
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3.5 text-on-surface-variant hover:bg-surface-container-highest transition-colors rounded-xl"
          >
            <BarChart3 className="w-4 h-4 text-primary" />
            <span>Analytics</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3.5 text-on-surface-variant hover:bg-surface-container-highest transition-colors rounded-xl"
          >
            <Settings className="w-4 h-4 text-primary" />
            <span>System Settings</span>
          </a>
        </nav>

        <div className="px-6 py-4 border-t border-outline-variant/20">
          <button className="w-full bg-primary text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary-container active:scale-[0.98] transition-all cursor-pointer">
            <Plus className="w-4 h-4" />
            <span>New Entry</span>
          </button>
        </div>

        <div className="px-3 pt-2 mt-auto border-t border-outline-variant/20 text-xs font-semibold space-y-1">
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-primary transition-colors rounded-xl"
          >
            <HelpCircle className="w-4 h-4 text-primary" />
            <span>Help Center</span>
          </a>
          <button
            onClick={handleAdminLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors rounded-xl cursor-pointer text-left font-bold"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Portal</span>
          </button>
        </div>
      </aside>

      {/* WRAPPER KERJA KANAN */}
      <div className="ml-64 flex flex-col min-h-screen">
        <main className="flex-1 p-8 lg:p-12 max-w-[1400px] w-full mx-auto">
          <header className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <nav className="flex mb-2 text-xs font-semibold text-on-surface-variant/70 gap-2">
                <span>Admin</span> <span>/</span> <span>Members</span>{" "}
                <span>/</span>{" "}
                <span className="text-primary font-bold">Add New Member</span>
              </nav>
              <h2 className="font-display font-bold text-3xl text-primary tracking-tight">
                Member Registration
              </h2>
              <p className="text-xs md:text-sm text-on-surface-variant mt-1 font-medium">
                Manual registration for Universitas Airlangga library membership
                (Seq 8.2.13).
              </p>
            </div>

            <div className="flex items-center gap-3.5 bg-white px-5 py-2.5 rounded-full shadow-sm border border-outline-variant/30 shrink-0">
              <div className="w-9 h-9 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop"
                  alt="Admin"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col text-xs">
                <span className="font-bold text-on-surface">
                  Staff ID: 10882
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-on-surface-variant">
                  Registration Desk
                </span>
              </div>
            </div>
          </header>

          {/* Asymmetric Bento Layout (8 : 4) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* KOLOM KIRI (8/12): Form Registrasi */}
            <div className="lg:col-span-8">
              <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-sm border border-outline-variant/30">
                <form onSubmit={handleSubmit} className="space-y-8 text-xs">
                  {/* Personal Details Section */}
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-9 h-9 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                        <User className="w-4 h-4" />
                      </div>
                      <h3 className="font-display font-bold text-xl text-primary">
                        Personal Details
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2 font-semibold">
                        <label className="text-on-surface block ml-1">
                          Full Name *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-outline/60" />
                          <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            type="text"
                            required
                            placeholder="Enter full legal name"
                            className="w-full pl-11 pr-4 py-3.5 bg-surface-container-lowest border border-outline-variant/60 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium"
                          />
                        </div>
                      </div>

                      <div className="space-y-2 font-semibold">
                        <label className="text-on-surface block ml-1">
                          ID Number (NIM / NIP) *
                        </label>
                        <div className="relative">
                          <Fingerprint className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-outline/60" />
                          <input
                            name="idNumber"
                            value={formData.idNumber}
                            onChange={handleChange}
                            type="text"
                            required
                            placeholder="NIM / NIP / Staff ID"
                            className="w-full pl-11 pr-4 py-3.5 bg-surface-container-lowest border border-outline-variant/60 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium font-mono"
                          />
                        </div>
                      </div>

                      <div className="space-y-2 font-semibold">
                        <label className="text-on-surface block ml-1">
                          Category *
                        </label>
                        <div className="relative">
                          <Layers className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-outline/60" />
                          <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="w-full pl-11 pr-4 py-3.5 bg-surface-container-lowest border border-outline-variant/60 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium cursor-pointer"
                          >
                            <option value="" disabled>
                              Select Membership Type
                            </option>
                            <option value="student">Student</option>
                            <option value="staff">Staff</option>
                            <option value="faculty">Faculty</option>
                            <option value="external">External Member</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2 font-semibold">
                        <label className="text-on-surface block ml-1">
                          Email Address (@unair.ac.id) *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-outline/60" />
                          <input
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            type="email"
                            required
                            placeholder="university@email.ac.id"
                            className="w-full pl-11 pr-4 py-3.5 bg-surface-container-lowest border border-outline-variant/60 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info Section */}
                  <div className="pt-6 border-t border-outline-variant/30 font-semibold">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-9 h-9 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                        <Home className="w-4 h-4" />
                      </div>
                      <h3 className="font-display font-bold text-xl text-primary">
                        Contact Information
                      </h3>
                    </div>

                    <div className="space-y-2">
                      <label className="text-on-surface block ml-1">
                        Residential / Dormitory Address *
                      </label>
                      <div className="relative">
                        <Home className="absolute left-3.5 top-4 w-4 h-4 text-outline/60" />
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          required
                          rows="3"
                          placeholder="Enter complete home or dormitory address"
                          className="w-full pl-11 pr-4 py-3.5 bg-surface-container-lowest border border-outline-variant/60 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium leading-relaxed"
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 flex items-center justify-end gap-3 font-bold">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          name: "",
                          idNumber: "",
                          category: "",
                          email: "",
                          address: "",
                        })
                      }
                      className="px-8 py-3.5 rounded-2xl border border-outline-variant/80 text-on-surface-variant hover:bg-surface-container transition-all cursor-pointer"
                    >
                      Clear Form
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="px-10 py-3.5 rounded-2xl bg-primary text-white hover:bg-primary-container shadow-lg shadow-primary/20 active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
                    >
                      {isProcessing && (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      )}
                      <span>
                        {isProcessing
                          ? "Verifying Sequence..."
                          : "Register Member"}
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* KOLOM KANAN (4/12): Rules, Activity & 3D Visual */}
            <div className="lg:col-span-4 space-y-6">
              {/* Registration Rules Card */}
              <div className="bg-primary text-white p-8 rounded-3xl shadow-xl relative overflow-hidden space-y-4">
                <div className="relative z-10 space-y-2">
                  <Info className="w-8 h-8 text-blue-200 mb-2" />
                  <h4 className="font-display font-bold text-xl">
                    Registration Rules
                  </h4>
                  <ul className="space-y-2.5 text-xs text-white/90 font-medium pt-1">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-blue-200 shrink-0 mt-0.5" />
                      <span>Ensure ID Number matches University records.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-blue-200 shrink-0 mt-0.5" />
                      <span>Staff members require a valid NIP.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-blue-200 shrink-0 mt-0.5" />
                      <span>
                        Valid email required for digital repository access.
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
                  <BookOpen className="w-64 h-64 text-white" />
                </div>
              </div>

              {/* Recent Activity List (Reaktif!) */}
              <div className="bg-surface-container-lowest p-7 rounded-3xl border border-outline-variant/30 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-primary font-display font-bold text-base border-b border-outline-variant/20 pb-3">
                  <History className="w-4 h-4 text-primary" />
                  <span>Recent Registration Activity</span>
                </div>

                <div className="space-y-3">
                  {recentActivity.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3.5 bg-surface-container-low/50 rounded-2xl border border-outline-variant/20 animate-fade-in"
                    >
                      <div className="space-y-0.5">
                        <p className="font-display font-bold text-xs text-on-surface">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-on-surface-variant font-medium">
                          {item.role} • {item.time}
                        </p>
                      </div>
                      <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 uppercase tracking-wider shrink-0">
                        Success
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3D Visual Illustration */}
              <div className="rounded-3xl overflow-hidden shadow-md border border-outline-variant/30 aspect-video bg-surface-container">
                <img
                  src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=600&auto=format&fit=crop"
                  alt="Library Hall"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </main>

        <footer className="w-full mt-auto bg-surface-container py-12 text-xs text-on-surface-variant border-t border-outline-variant/30">
          <div className="max-w-[1400px] mx-auto px-8 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-4 font-medium">
            <div className="flex items-center gap-2 font-display font-bold text-sm text-primary">
              <BookCheck className="w-4 h-4" />
              <span>UNAIR Library Staff Portal</span>
            </div>
            <div className="flex gap-8">
              <a href="#" className="hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Contact Support
              </a>
            </div>
            <div>
              © 2024 Universitas Airlangga Library. All rights reserved.
            </div>
          </div>
        </footer>
      </div>

      {/* SUCCESS TOAST */}
      {showToast && (
        <div className="fixed bottom-8 right-8 z-50 bg-inverse-surface text-inverse-on-surface px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold border border-white/10 animate-slide-up">
          <CheckCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>Member registered successfully! Sequence 8.2.13 logged.</span>
        </div>
      )}
    </div>
  );
}

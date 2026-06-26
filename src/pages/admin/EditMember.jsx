import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom"; // Tambahkan useParams
import { supabase } from "../../lib/supabaseClient"; // Pastikan path ini benar!
import {
  LayoutDashboard, BookOpen, Users, Handshake, Banknote,
  BarChart3, Settings, HelpCircle, LogOut, Plus, ChevronRight,
  User, Camera, LogIn, Pencil, School, CreditCard, Info, Save,
  Loader2, CheckCircle2, BookCheck, History,
} from "lucide-react";

export default function EditMember() {
  const navigate = useNavigate();
  const { id } = useParams(); // Menangkap ID anggota dari URL (misal: /edit-member/xxx-uuid-xxx)

  // State Form terhubung ke DB
  const [formData, setFormData] = useState({
    fullName: "",
    memberId: "", // Dalam ERD disebut: username_anggota atau no_hp
    email: "",
    phone: "",
    faculty: "Sains dan Teknologi", // Hardcode karena tidak ada di tabel ERD asli
    studyProgram: "S1 Sistem Informasi", // Hardcode karena tidak ada di tabel ERD asli
    category: "Undergraduate Student", // Hardcode
    expiryDate: "2025-08-31", // Hardcode
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // ================= 1. FETCH DATA ANGGOTA DARI SUPABASE =================
  useEffect(() => {
    async function fetchMember() {
      if (!id) return; // Jika tidak ada ID, jangan lakukan apa-apa
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("anggota")
          .select("*")
          .eq("id_anggota", id)
          .single(); // Ambil 1 baris secara spesifik

        if (error) throw error;

        if (data) {
          // Petakan data dari database ke form state kita
          setFormData((prev) => ({
            ...prev,
            fullName: data.nama_anggota || "",
            memberId: data.username_anggota || "BELUM-ADA-ID", 
            email: data.email || "",
            phone: data.no_hp || "",
            // Catatan: Faculty, StudyProgram, Category, ExpiryDate tidak ada di ERD asli tabel 'anggota'
            // Jadi tetap dibiarkan menggunakan nilai default
          }));
        }
      } catch (err) {
        console.error("Gagal menarik data anggota:", err);
        alert("Gagal memuat profil anggota. Pastikan ID valid.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchMember();
  }, [id]);

  const handleAdminLogout = () => {
    if (confirm("Apakah Anda yakin ingin keluar dari portal Admin?")) {
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

  // ================= 2. UPDATE DATA KE SUPABASE =================
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!id) {
      alert("Error: ID Anggota tidak ditemukan.");
      return;
    }

    setIsSaving(true);

    try {
      // Petakan kembali dari Form State ke struktur Kolom Tabel DB
      const { error } = await supabase
        .from("anggota")
        .update({
          nama_anggota: formData.fullName,
          email: formData.email,
          no_hp: formData.phone,
          // 'username_anggota' (Member ID) sengaja tidak di-update karena dikunci (Read-Only)
        })
        .eq("id_anggota", id);

      if (error) throw error;

      setIsSaving(false);
      setIsSaved(true);

      setTimeout(() => {
        setIsSaved(false);
        navigate("/member-directory");
      }, 1500);

    } catch (err) {
      console.error("Gagal update profil:", err);
      alert("Gagal menyimpan perubahan: " + err.message);
      setIsSaving(false);
    }
  };

  // Layar Loading Awal
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3 text-primary font-body">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="font-bold text-sm tracking-wider uppercase animate-pulse">Menarik Data Profil Anggota...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-body text-on-surface antialiased overflow-x-hidden selection:bg-secondary-container">
      {/* SIDEBAR KIRI */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-surface-container-low shadow-sm flex flex-col py-6 space-y-2 border-r border-outline-variant/30 z-50">
        <div className="px-6 mb-8">
          <h1 className="font-display font-bold text-2xl text-primary tracking-tight">UNAIR Admin</h1>
          <p className="text-xs font-semibold text-on-surface-variant/70 tracking-wider uppercase mt-0.5">Staff Portal</p>
        </div>

        <nav className="flex-1 px-3 space-y-1 text-xs font-semibold">
          <a href="#" className="flex items-center gap-3 px-4 py-3.5 text-on-surface-variant hover:bg-surface-container-highest transition-colors rounded-xl">
            <LayoutDashboard className="w-4 h-4 text-primary" /><span>Dashboard</span>
          </a>
          <Link to="/catalog-admin" className="flex items-center gap-3 px-4 py-3.5 text-on-surface-variant hover:bg-surface-container-highest transition-colors rounded-xl">
            <BookOpen className="w-4 h-4 text-primary" /><span>Catalog Admin</span>
          </Link>
          <Link to="/member-management" className="flex items-center gap-3 px-4 py-3.5 bg-secondary-container text-on-secondary-container font-bold rounded-xl shadow-sm">
            <Users className="w-4 h-4 text-primary font-extrabold" /><span>Member Management</span>
          </Link>
          <Link to="/admin" className="flex items-center gap-3 px-4 py-3.5 text-on-surface-variant hover:bg-surface-container-highest transition-colors rounded-xl">
            <Handshake className="w-4 h-4 text-primary" /><span>Loan Processing</span>
          </Link>
          <Link to="/fine-management" className="flex items-center gap-3 px-4 py-3.5 text-on-surface-variant hover:bg-surface-container-highest transition-colors rounded-xl">
            <Banknote className="w-4 h-4 text-primary" /><span>Returns & Fines</span>
          </Link>
        </nav>

        <div className="px-6 py-4 border-t border-outline-variant/20">
          <Link to="/member-management" className="w-full bg-primary text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary-container active:scale-[0.98] transition-all cursor-pointer">
            <Plus className="w-4 h-4" /><span>New Entry</span>
          </Link>
        </div>

        <div className="px-3 pt-2 mt-auto border-t border-outline-variant/20 text-xs font-semibold space-y-1">
          <button onClick={handleAdminLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors rounded-xl cursor-pointer text-left font-bold">
            <LogOut className="w-4 h-4" /><span>Logout Portal</span>
          </button>
        </div>
      </aside>

      {/* KONTEN UTAMA */}
      <div className="ml-64 flex flex-col min-h-screen">
        <main className="flex-1 p-8 lg:p-12 max-w-[1400px] w-full mx-auto">
          <header className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <nav className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant/70 mb-2">
                <Link to="/member-management" className="hover:text-primary transition-colors">Member Management</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-on-surface font-bold">Edit Member</span>
              </nav>
              <h2 className="font-display font-bold text-3xl text-primary tracking-tight">Edit Member Profile</h2>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* KOLOM KIRI (Avatar) */}
            <div className="lg:col-span-4 space-y-8 font-medium">
              <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-sm border border-outline-variant/30 flex flex-col items-center text-center">
                <div className="relative w-32 h-32 mb-5 group cursor-pointer">
                  <div className="w-full h-full rounded-full border-4 border-secondary-container overflow-hidden shadow-md bg-surface-container">
                    <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&auto=format&fit=crop" alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                </div>

                <h3 className="font-display font-bold text-2xl text-primary">{formData.fullName}</h3>
                <p className="text-xs text-on-surface-variant font-mono mt-0.5">NIM: {formData.memberId}</p>

                <div className="mt-4 px-4 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold inline-flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Active Member</span>
                </div>
              </div>
            </div>

            {/* KOLOM KANAN (Form) */}
            <div className="lg:col-span-8">
              <form onSubmit={handleFormSubmit} className="bg-surface-container-lowest p-8 lg:p-10 rounded-3xl shadow-sm border border-outline-variant/30 space-y-8 text-xs">
                
                {/* 1. Personal Information */}
                <div className="space-y-5">
                  <h4 className="font-display font-bold text-xl text-primary flex items-center gap-2.5 border-b border-outline-variant/20 pb-4">
                    <User className="w-5 h-5 text-primary" /><span>Personal Information</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-semibold">
                    <div className="space-y-2">
                      <label className="text-on-surface block ml-1">Full Name</label>
                      <input name="fullName" value={formData.fullName} onChange={handleChange} required type="text" className="w-full px-4 py-3.5 rounded-xl border border-outline-variant/60 focus:border-primary outline-none transition-all font-medium" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-on-surface block ml-1">Member ID (Locked)</label>
                      <input name="memberId" value={formData.memberId} readOnly type="text" className="w-full px-4 py-3.5 rounded-xl border border-outline-variant/40 bg-surface-container-high/60 text-on-surface-variant opacity-75 cursor-not-allowed outline-none font-mono font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-on-surface block ml-1">Email Address</label>
                      <input name="email" value={formData.email} onChange={handleChange} required type="email" className="w-full px-4 py-3.5 rounded-xl border border-outline-variant/60 focus:border-primary outline-none transition-all font-medium" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-on-surface block ml-1">Phone Number</label>
                      <input name="phone" value={formData.phone} onChange={handleChange} required type="tel" className="w-full px-4 py-3.5 rounded-xl border border-outline-variant/60 focus:border-primary outline-none transition-all font-medium font-mono" />
                    </div>
                  </div>
                </div>

                {/* Academic & Membership (Static Mockups sesuai ERD yang tidak punya field ini) */}
                <div className="space-y-5 pt-2">
                  <h4 className="font-display font-bold text-xl text-primary flex items-center gap-2.5 border-b border-outline-variant/20 pb-4">
                    <School className="w-5 h-5 text-primary" /><span>Academic & Status (ReadOnly)</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-semibold opacity-70">
                    <div className="space-y-2">
                      <label className="text-on-surface block ml-1">Faculty</label>
                      <input value={formData.faculty} readOnly className="w-full px-4 py-3.5 rounded-xl border bg-gray-100 outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-on-surface block ml-1">Category</label>
                      <input value={formData.category} readOnly className="w-full px-4 py-3.5 rounded-xl border bg-gray-100 outline-none" />
                    </div>
                  </div>
                </div>

                {/* Tombol Aksi */}
                <div className="mt-12 pt-8 border-t border-outline-variant/30 flex justify-end gap-3 font-bold">
                  <button type="button" onClick={() => navigate("/member-directory")} className="px-8 py-3.5 rounded-2xl border text-on-surface-variant hover:bg-surface-container cursor-pointer">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSaving || isSaved} className="px-10 py-3.5 rounded-2xl font-bold text-white bg-primary hover:bg-primary-container shadow-lg flex items-center justify-center gap-2 cursor-pointer">
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : isSaved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                    <span>{isSaving ? "Saving..." : isSaved ? "Saved!" : "Save Changes"}</span>
                  </button>
                </div>
              </form>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
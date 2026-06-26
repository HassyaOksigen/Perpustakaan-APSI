import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient"; // Pastikan path ini benar
import {
  LayoutDashboard, BookOpen, Users, Handshake, Banknote,
  BarChart3, Settings, HelpCircle, LogOut, Plus, Search,
  Bell, Filter, Download, TrendingUp, AlertTriangle,
  UserPlus, Trash2, ChevronLeft, ChevronRight, Info,
  BookCheck, Loader2, CheckCircle2
} from "lucide-react";

export default function MemberDirectory() {
  const navigate = useNavigate();

  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // State untuk Modal Hapus Anggota
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [confirmInput, setConfirmInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAdminLogout = () => {
    if (confirm("Apakah Anda yakin ingin keluar dari portal Admin?")) {
      localStorage.clear();
      navigate("/login");
    }
  };

  // ================= 1. FETCH DATA ANGGOTA =================
  useEffect(() => {
    async function fetchMembers() {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("view_member_directory")
          .select("*")
          .order("name", { ascending: true }); // Urutkan sesuai abjad

        if (error) throw error;
        if (data) setMembers(data);
      } catch (err) {
        console.error("Gagal menarik data anggota:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMembers();
  }, []);

  // ================= 2. EKSEKUSI HAPUS ANGGOTA =================
  const openDeleteModal = (member) => {
    setDeleteTarget(member);
    setConfirmInput("");
  };

  const handleDeleteConfirm = async () => {
    if (confirmInput !== "CONFIRM") return;
    setIsDeleting(true);

    try {
      // Hapus data dari tabel asli 'anggota'
      const { error } = await supabase
        .from("anggota")
        .delete()
        .eq("id_anggota", deleteTarget.id);

      if (error) throw error;

      // Update UI secara real-time
      setMembers((prev) => prev.filter((m) => m.id !== deleteTarget.id));
      setDeleteTarget(null);
      alert(`Anggota ${deleteTarget.name} berhasil dihapus permanen dari sistem.`);
    } catch (err) {
      console.error(err);
      alert(
        "Gagal menghapus anggota. Pastikan anggota ini tidak memiliki riwayat denda atau peminjaman yang masih nyangkut di database! \n\nError: " + err.message
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // ================= MATEMATIKA STATISTIK DINAMIS =================
  const totalMembers = members.length;
  const totalActiveLoans = members.reduce((sum, m) => sum + Number(m.active_loans || 0), 0);
  
  // Hitung member yang mendaftar di bulan yang sama dengan bulan ini
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const newThisMonth = members.filter(m => {
    if(!m.tanggal_daftar) return false;
    const d = new Date(m.tanggal_daftar);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }).length;

  const filteredMembers = members.filter(
    (m) =>
      (m.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.id_number || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.email || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background font-body text-on-surface antialiased overflow-x-hidden selection:bg-secondary-container">
      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-surface-container-low shadow-sm flex flex-col py-6 space-y-2 border-r border-outline-variant/30 z-40">
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
          
          <Link to="/member-directory" className="flex items-center gap-3 px-4 py-3.5 bg-secondary-container text-on-secondary-container font-bold rounded-xl shadow-sm">
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
        <header className="h-16 flex items-center justify-between px-8 bg-surface-container-lowest border-b border-outline-variant/20 sticky top-0 z-30 shadow-xs">
          <h2 className="font-display font-bold text-lg text-primary">Member Directory</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/50" />
              <input
                type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or ID..."
                className="bg-surface-container-low border border-outline-variant/40 rounded-full pl-10 pr-4 py-2 w-64 sm:w-72 text-xs focus:outline-none focus:border-primary transition-all font-medium shadow-inner"
              />
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 lg:p-12 max-w-[1400px] w-full mx-auto space-y-8">
          
          {/* STATS BENTO GRID (Otomatis Dihitung) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/30 shadow-sm flex flex-col justify-between">
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Total Members</p>
              <div className="flex items-baseline justify-between">
                <span className="font-display font-bold text-4xl text-primary font-mono">{totalMembers}</span>
                <Users className="w-6 h-6 text-primary opacity-40" />
              </div>
            </div>

            <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/30 shadow-sm flex flex-col justify-between">
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Active Loans</p>
              <div className="flex items-baseline justify-between">
                <span className="font-display font-bold text-4xl text-secondary font-mono">{totalActiveLoans}</span>
                <BookOpen className="w-6 h-6 text-secondary opacity-40" />
              </div>
            </div>

            <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/30 shadow-sm flex flex-col justify-between">
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">New This Month</p>
              <div className="flex items-baseline justify-between">
                <span className="font-display font-bold text-4xl text-emerald-600 font-mono">{newThisMonth}</span>
                <UserPlus className="w-6 h-6 text-emerald-600 opacity-40" />
              </div>
            </div>

            <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/30 shadow-sm flex flex-col justify-between">
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Pending Renewals</p>
              <div className="flex items-baseline justify-between">
                <span className="font-display font-bold text-4xl text-red-600 font-mono">0</span>
                <AlertTriangle className="w-6 h-6 text-red-600 opacity-40" />
              </div>
            </div>
          </div>

          {/* TABEL DIREKTORI */}
          <div className="bg-surface-container-lowest rounded-3xl shadow-sm border border-outline-variant/30 overflow-hidden">
            <div className="p-6 md:px-8 border-b border-outline-variant/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container-low/30">
              <div>
                <h3 className="font-display font-bold text-xl text-on-surface">Member Directory</h3>
                <p className="text-on-surface-variant text-xs mt-0.5 font-medium">Manage and review library memberships from Supabase</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-surface-container-low/50 border-b border-outline-variant/20 font-bold text-on-surface-variant uppercase tracking-wider">
                    <th className="px-8 py-4.5">Member Details</th>
                    <th className="px-6 py-4.5">ID Number</th>
                    <th className="px-6 py-4.5">Status</th>
                    <th className="px-6 py-4.5">Active Loans</th>
                    <th className="px-8 py-4.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/15 font-medium">
                  {isLoading ? (
                    <tr><td colSpan="5" className="px-8 py-16 text-center text-primary"><Loader2 className="w-8 h-8 animate-spin mx-auto mb-2"/>Mengambil data anggota...</td></tr>
                  ) : filteredMembers.length === 0 ? (
                    <tr><td colSpan="5" className="px-8 py-16 text-center text-on-surface-variant/60">Tidak ada anggota yang cocok dengan pencarian.</td></tr>
                  ) : (
                    filteredMembers.map((m) => {
                      // Styling dinamis
                      const isWarning = m.active_loans > 0;
                      const statusColor = m.status_anggota ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-surface-variant text-on-surface-variant';

                      return (
                        <tr key={m.id} className="hover:bg-surface-container-low/40 transition-colors group">
                          <td className="px-8 py-4.5">
                            <div className="flex items-center gap-3.5">
                              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-xs border border-primary/20 bg-primary-fixed text-primary-container">
                                {m.initials}
                              </div>
                              <div>
                                <span className="font-display font-bold text-sm text-on-surface group-hover:text-primary transition-colors block">{m.name}</span>
                                <span className="text-[11px] text-on-surface-variant/70 block mt-0.5">{m.email}</span>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4.5 font-mono text-on-surface-variant font-semibold">{m.id_number}</td>

                          <td className="px-6 py-4.5">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider inline-block ${statusColor}`}>
                              {m.status_text}
                            </span>
                          </td>

                          <td className="px-6 py-4.5">
                            <div className={`flex items-center gap-1.5 ${isWarning ? "text-amber-600 font-bold" : "text-on-surface-variant"}`}>
                              <BookOpen className="w-4 h-4 shrink-0" />
                              <span>{m.active_loans} Books</span>
                            </div>
                          </td>

                          <td className="px-8 py-4.5 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Link to={`/edit-member/${m.id}`} className="px-3 py-1.5 bg-surface-container-low hover:bg-primary hover:text-white rounded-xl text-on-surface font-bold transition-all cursor-pointer">
                                Edit
                              </Link>
                              <button onClick={() => openDeleteModal(m)} className="p-2 text-on-surface-variant hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-8 py-5 bg-surface-container-low/40 border-t border-outline-variant/20 flex justify-between items-center text-xs font-medium text-on-surface-variant">
              <p>Showing {filteredMembers.length} library members</p>
            </div>
          </div>
        </main>
      </div>

      {/* DIALOG MODAL HAPUS */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div onClick={() => setDeleteTarget(null)} className="absolute inset-0 bg-primary/40 backdrop-blur-xs"></div>
          <div className="relative bg-surface-container-lowest rounded-3xl shadow-2xl max-w-md w-full overflow-hidden text-center z-10 animate-scale-up border border-outline-variant/30 space-y-4">
            
            <div className="p-8 pb-2 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center mx-auto border border-red-200 shadow-inner animate-pulse">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-display font-bold text-2xl text-on-surface mb-1">Delete Member?</h3>
                <p className="text-xs text-on-surface-variant font-medium leading-relaxed px-2">
                  You are about to permanently remove <span className="font-bold text-on-surface">{deleteTarget.name}</span> from the database.
                </p>
              </div>
            </div>

            <div className="px-8 space-y-3 text-left">
              <div className="flex items-start gap-3 bg-surface-container-low p-4 rounded-2xl border border-outline-variant/30 text-xs text-on-surface-variant font-medium">
                <Info className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <p className="leading-relaxed">This action is irreversible. All historical records will be wiped.</p>
              </div>

              {deleteTarget.active_loans > 0 && (
                <div className="flex items-start gap-3 bg-red-50 p-4 rounded-2xl border border-red-200 text-xs text-red-900 font-medium">
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-red-800">Active Loans Detected</p>
                    <p className="text-red-950/80 mt-0.5 leading-relaxed">This member has <span className="font-bold">{deleteTarget.active_loans} active items</span>. Supabase will block deletion to protect data integrity unless loans are returned.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="px-8 pt-2">
              <p className="text-[10px] font-extrabold text-on-surface-variant mb-2 uppercase tracking-widest text-center">Type CONFIRM to proceed</p>
              <input
                type="text" value={confirmInput} onChange={(e) => setConfirmInput(e.target.value)}
                placeholder="CONFIRM"
                className="w-full border-2 border-outline-variant/80 rounded-xl py-3 px-4 focus:border-red-600 outline-none transition-all text-center font-mono font-bold tracking-widest text-xs"
              />
            </div>

            <div className="p-8 pt-4 flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-3.5 bg-surface-container text-on-surface font-bold text-xs rounded-2xl hover:bg-surface-container-highest transition-all cursor-pointer">
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={confirmInput !== "CONFIRM" || isDeleting}
                className={`flex-1 py-3.5 font-bold text-xs rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  confirmInput === "CONFIRM" && !isDeleting ? "bg-red-600 text-white shadow-lg shadow-red-600/30 hover:bg-red-700" : "bg-surface-variant text-outline cursor-not-allowed shadow-none"
                }`}
              >
                {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{isDeleting ? "Purging..." : "Delete Permanently"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient"; // Sesuaikan path ../ jika berbeda
import {
  LayoutDashboard, BookOpen, Users, Handshake,
  Banknote, BarChart3, Settings, HelpCircle,
  LogOut, Search, Printer, Clock, CheckCircle2,
  ArrowRight, CheckCheck, X, ChevronLeft,
  ChevronRight, Plus, Loader2
} from "lucide-react";

export default function FineManagement() {
  const navigate = useNavigate();

  const [fines, setFines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [payModal, setPayModal] = useState(null); 
  const [showToast, setShowToast] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAdminLogout = () => {
    if (confirm("Apakah Anda yakin ingin keluar dari portal Admin?")) {
      localStorage.clear();
      navigate("/login");
    }
  };

  // ================= 1. FETCH DATA DARI SQL VIEW =================
  useEffect(() => {
    async function fetchAdminFines() {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("view_admin_denda")
          .select("*");

        if (error) throw error;
        if (data) setFines(data);
      } catch (err) {
        console.error("Gagal menarik data denda:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAdminFines();
  }, []);

  // ================= 2. PROSES KONFIRMASI PEMBAYARAN =================
  const handleConfirmPayment = async () => {
    if (!payModal) return;
    setIsProcessing(true);

    try {
      const tglBayar = new Date().toISOString();

      // Update tabel denda di Supabase
      const { error } = await supabase
        .from("denda")
        .update({
          status_bayar: true,
          tanggal_bayar: tglBayar
        })
        .eq("id_denda", payModal.id_denda);

      if (error) throw error;

      // Update UI secara lokal (Real-time update)
      setFines((prev) =>
        prev.map((f) =>
          f.id_denda === payModal.id_denda
            ? { ...f, status_bayar: true, tanggal_bayar: tglBayar }
            : f
        )
      );

      setPayModal(null);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3500);

    } catch (err) {
      alert("Gagal memproses pembayaran: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper Format Rupiah
  const formatRp = (angka) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(angka || 0);
  };

  // Filter Search
  const filteredFines = fines.filter((f) =>
      (f.nama_anggota || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.id_number || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.judul_buku || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ================= MATEMATIKA OTOMATIS =================
  const totalUnpaid = fines.filter(f => !f.status_bayar).reduce((sum, f) => sum + Number(f.jumlah_denda), 0);
  
  // Hitung uang yang masuk (LUNAS) khusus di tanggal hari ini
  const todayDateStr = new Date().toISOString().split("T")[0];
  const collectedToday = fines
    .filter(f => f.status_bayar && f.tanggal_bayar && f.tanggal_bayar.startsWith(todayDateStr))
    .reduce((sum, f) => sum + Number(f.jumlah_denda), 0);


  return (
    <div className="min-h-screen bg-background font-body text-on-surface antialiased overflow-x-hidden selection:bg-secondary-container">
      
      {/* SIDEBAR ADMIN */}
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
          <Link to="/member-directory" className="flex items-center gap-3 px-4 py-3.5 text-on-surface-variant hover:bg-surface-container-highest transition-colors rounded-xl">
            <Users className="w-4 h-4 text-primary" /><span>Member Management</span>
          </Link>
          <Link to="/admin" className="flex items-center gap-3 px-4 py-3.5 text-on-surface-variant hover:bg-surface-container-highest transition-colors rounded-xl">
            <Handshake className="w-4 h-4 text-primary" /><span>Loan Processing</span>
          </Link>

          {/* TAB AKTIF */}
          <Link to="/fine-management" className="flex items-center gap-3 px-4 py-3.5 bg-secondary-container text-on-secondary-container font-bold rounded-xl shadow-sm">
            <Banknote className="w-4 h-4 text-primary font-extrabold" /><span>Returns & Fines</span>
          </Link>
        </nav>

        <div className="px-3 pt-2 mt-auto border-t border-outline-variant/20 text-xs font-semibold space-y-1">
          <button onClick={handleAdminLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors rounded-xl cursor-pointer text-left font-bold">
            <LogOut className="w-4 h-4" /><span>Logout Portal</span>
          </button>
        </div>
      </aside>

      {/* KONTEN UTAMA */}
      <div className="ml-64 flex flex-col min-h-screen">
        <main className="flex-1 p-8 lg:p-12 max-w-[1400px] w-full mx-auto">
          <header className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="font-display font-bold text-3xl text-primary tracking-tight">Fine Management</h2>
              <p className="text-xs md:text-sm text-on-surface-variant mt-1 font-medium max-w-2xl leading-relaxed">
                Process outstanding penalties and late return fees at the circulation desk. Follow Sequence 8.2.12 for secure payment logging.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/40" />
                <input
                  type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari member / buku..."
                  className="pl-10 pr-4 py-2.5 bg-surface-container-lowest border border-outline-variant/60 rounded-xl focus:outline-none focus:border-primary text-xs w-60 sm:w-72 shadow-inner"
                />
              </div>
            </div>
          </header>

          {/* STATS OVERVIEW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="p-6 rounded-3xl bg-surface-container-lowest shadow-sm border border-outline-variant/30 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="p-3 bg-red-100 text-red-700 rounded-2xl"><Clock className="w-5 h-5" /></span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Total Unpaid Fines</h4>
                <p className="font-display font-bold text-2xl lg:text-3xl text-red-600 mt-1 font-mono">
                  {formatRp(totalUnpaid)}
                </p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-surface-container-lowest shadow-sm border border-outline-variant/30 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="p-3 bg-emerald-100 text-emerald-700 rounded-2xl"><CheckCircle2 className="w-5 h-5" /></span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Collected Today</h4>
                <p className="font-display font-bold text-2xl lg:text-3xl text-emerald-700 mt-1 font-mono">
                  {formatRp(collectedToday)}
                </p>
              </div>
            </div>

            <div className="sm:col-span-2 p-8 rounded-3xl bg-primary text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
              <div className="relative z-10 space-y-2">
                <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest">Connectivity Status</span>
                <p className="font-display font-bold text-xl leading-snug pt-1 max-w-md">
                  System Syncing with UNAIR Central Finance Bureau is Active.
                </p>
              </div>
              <button className="mt-6 relative z-10 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 py-2.5 rounded-xl transition-all text-xs font-bold w-fit cursor-pointer flex items-center gap-1.5">
                <span>View Bureau Logs</span> <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none"><Banknote className="w-64 h-64 text-white" /></div>
            </div>
          </div>

          {/* TABEL DENDA */}
          <div className="bg-surface-container-lowest rounded-3xl shadow-sm overflow-hidden border border-outline-variant/30">
            <div className="px-8 py-6 border-b border-outline-variant/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container-low/30">
              <h3 className="font-display font-bold text-xl text-primary">Member Outstanding Ledger</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-surface-container-low/50 border-b border-outline-variant/20 font-bold text-on-surface-variant uppercase tracking-wider">
                    <th className="px-8 py-4.5">Member Details</th>
                    <th className="px-6 py-4.5">ID Number</th>
                    <th className="px-6 py-4.5">Book Detail</th>
                    <th className="px-6 py-4.5">Amount Due</th>
                    <th className="px-6 py-4.5">Status</th>
                    <th className="px-8 py-4.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20 font-medium">
                  {isLoading ? (
                    <tr><td colSpan="6" className="px-8 py-16 text-center text-primary"><Loader2 className="w-8 h-8 animate-spin mx-auto mb-2"/><span>Menarik log denda dari Supabase...</span></td></tr>
                  ) : filteredFines.length === 0 ? (
                    <tr><td colSpan="6" className="px-8 py-16 text-center text-on-surface-variant/60 font-semibold text-sm">Tidak ada tagihan denda mahasiswa yang tercatat.</td></tr>
                  ) : (
                    filteredFines.map((m) => (
                      <tr key={m.id_denda} className="hover:bg-surface-container-low/40 transition-colors group">
                        
                        <td className="px-8 py-4.5">
                          <div className="flex items-center gap-3.5">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-sm border ${m.status_bayar ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-secondary-fixed text-primary border-secondary-fixed'}`}>
                              {m.inisial}
                            </div>
                            <div>
                              <div className="font-display font-bold text-sm text-on-surface group-hover:text-primary transition-colors">{m.nama_anggota}</div>
                              <div className="text-[11px] text-on-surface-variant/70 mt-0.5">{m.email}</div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4.5 font-mono text-on-surface-variant font-semibold">
                          {m.id_number}
                        </td>

                        <td className="px-6 py-4.5 text-on-surface-variant font-medium">
                          {m.judul_buku}
                        </td>

                        <td className={`px-6 py-4.5 font-bold font-mono text-sm ${m.status_bayar ? 'text-emerald-700 line-through opacity-70' : 'text-primary'}`}>
                          {formatRp(m.jumlah_denda)}
                        </td>

                        <td className="px-6 py-4.5">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                            m.status_bayar ? "bg-emerald-100 text-emerald-800 border border-emerald-200" : "bg-red-100 text-red-800 border border-red-200"
                          }`}>
                            {m.status_bayar ? "PAID" : "UNPAID"}
                          </span>
                        </td>

                        <td className="px-8 py-4.5 text-right">
                          {!m.status_bayar ? (
                            <button
                              onClick={() => setPayModal(m)}
                              className="bg-primary text-white font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-primary-container shadow-md shadow-primary/20 active:scale-[0.98] transition-all cursor-pointer inline-flex items-center gap-1.5 ml-auto"
                            >
                              <Banknote className="w-4 h-4 text-blue-200" /><span>Mark as Paid</span>
                            </button>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200">
                              <CheckCheck className="w-4 h-4 text-emerald-600" /><span>Cleared</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="px-8 py-5 border-t border-outline-variant/20 flex justify-between items-center bg-surface-container-low/20 text-xs font-medium text-on-surface-variant">
              <p>Menampilkan {filteredFines.length} log denda dari database.</p>
            </div>
          </div>
        </main>
      </div>

      {/* DIALOG MODAL KONFIRMASI */}
      {payModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div onClick={() => setPayModal(null)} className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
          <div className="relative w-full max-w-md rounded-3xl bg-surface-container-lowest p-8 border border-outline-variant/40 shadow-2xl text-center z-10 space-y-6">
            <div className="w-16 h-16 bg-red-100 text-red-700 rounded-2xl flex items-center justify-center mx-auto border border-red-200 shadow-inner">
              <Banknote className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-display font-bold text-2xl text-primary mb-1">Confirm Payment</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed px-2 font-medium">
                Konfirmasi pelunasan <span className="font-mono font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">{formatRp(payModal.jumlah_denda)}</span> untuk denda buku <span className="font-bold text-on-surface">"{payModal.judul_buku}"</span> milik {payModal.nama_anggota}.
              </p>
            </div>
            <div className="space-y-2.5 pt-2">
              <button
                onClick={handleConfirmPayment}
                disabled={isProcessing}
                className="w-full bg-primary text-white py-3.5 rounded-2xl font-bold text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isProcessing ? <><Loader2 className="w-4 h-4 animate-spin"/> Processing...</> : "Complete & Log Transaction"}
              </button>
              <button onClick={() => setPayModal(null)} className="w-full bg-surface-container text-on-surface-variant py-3 rounded-2xl font-bold text-xs hover:bg-surface-container-highest transition-all cursor-pointer">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {showToast && (
        <div className="fixed bottom-8 right-8 z-[110] bg-inverse-surface text-inverse-on-surface px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold border border-white/10 animate-slide-up">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>Transaksi pelunasan berhasil diproses ke database!</span>
        </div>
      )}
    </div>
  );
}
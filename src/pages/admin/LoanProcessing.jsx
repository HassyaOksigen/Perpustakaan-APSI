import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient"; // Sesuaikan path ../ jika berbeda
import {
  LayoutDashboard, BookOpen, Users, Handshake,
  Banknote, BarChart3, Settings, Plus, HelpCircle,
  LogOut, Search, Filter, Clock, BookCheck,
  AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight, X, Loader2
} from "lucide-react";

export default function LoanProcessing() {
  const navigate = useNavigate();

  const [queue, setQueue] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [toast, setToast] = useState({
    show: false,
    title: "",
    message: "",
    type: "success",
  });

  const handleAdminLogout = () => {
    if (confirm("Apakah Anda yakin ingin keluar dari portal Admin?")) {
      localStorage.clear();
      navigate("/login");
    }
  };

  const showToast = (title, message, type = "success") => {
    setToast({ show: true, title, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3500);
  };

  // ================= 1. FETCH ANTREAN PENGAJUAN DARI SQL VIEW =================
  useEffect(() => {
    async function fetchPendingQueue() {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("view_antrean_peminjaman")
          .select("*")
          .order("req_date", { ascending: true }); // Pengantre paling lama ditaruh atas

        if (error) throw error;

        if (data) {
          const formatted = data.map((row) => {
            const hasStock = Number(row.current_stock) > 0;
            return {
              id: row.id, // id_peminjaman
              id_buku: row.id_buku,
              memberName: row.member_name || "Anggota Tanpa Nama",
              memberId: row.member_id || row.member_email || "ID-0000",
              memberAvatar: row.member_avatar,
              bookTitle: row.book_title || "Judul Buku Tidak Terbaca",
              bookAuthor: `By ${row.book_author || "Anonim"}`,
              bookCover: row.book_cover || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=400&auto=format&fit=crop",
              statusText: hasStock ? `Available (${row.current_stock})` : "Out of Stock",
              statusBg: hasStock ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800",
              statusDot: hasStock ? "bg-emerald-500" : "bg-red-600",
              reqDate: row.req_date,
              reqTime: row.req_time,
              canApprove: hasStock, 
            };
          });
          setQueue(formatted);
        }
      } catch (err) {
        console.error("Gagal menarik antrean:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPendingQueue();
  }, []);

  // ================= 2. EKSEKUSI APPROVAL PINJAMAN =================
  const handleApprove = async (item) => {
    try {
      // A. Sahkan statusnya di tabel peminjaman menjadi 'approved' dan status bawa = true
      const { error: updErr } = await supabase
        .from("peminjaman")
        .update({
          status_pengajuan: "approved",
          status_peminjaman: true, // Resmi dipinjam user
        })
        .eq("id_peminjaman", item.id);

      if (updErr) throw updErr;

      // B. Kurangi fisik stok buku di rak sebanyak 1
      const { data: bData } = await supabase
        .from("buku")
        .select("stok")
        .eq("id_buku", item.id_buku)
        .single();

      if (bData && bData.stok > 0) {
        await supabase
          .from("buku")
          .update({ stok: bData.stok - 1 })
          .eq("id_buku", item.id_buku);
      }

      // C. Hilangkan barisnya dari UI antrean seketika
      setQueue((prev) => prev.filter((q) => q.id !== item.id));
      showToast("Loan Approved! 🎉", `Pengajuan buku "${item.bookTitle}" untuk ${item.memberName} resmi disetujui.`);

    } catch (err) {
      alert("Gagal memproses persetujuan: " + err.message);
    }
  };

  // ================= 3. EKSEKUSI PENOLAKAN (REJECT) =================
  const handleReject = async (item) => {
    if (!confirm(`Tolak pengajuan pinjaman "${item.bookTitle}" dari ${item.memberName}?`)) return;

    try {
      // Ubah status pengajuan jadi 'rejected', status bawa tetap false
      const { error: rejErr } = await supabase
        .from("peminjaman")
        .update({
          status_pengajuan: "rejected",
          status_peminjaman: false,
        })
        .eq("id_peminjaman", item.id);

      if (rejErr) throw rejErr;

      setQueue((prev) => prev.filter((q) => q.id !== item.id));
      showToast("Request Rejected ❌", `Pengajuan pinjaman atas nama ${item.memberName} telah dibatalkan.`, "error");

    } catch (err) {
      alert("Gagal menolak pengajuan: " + err.message);
    }
  };

  const filteredQueue = queue.filter(
    (item) =>
      item.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.memberId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-background font-body text-on-surface antialiased">
      
      {/* SIDEBAR ADMIN */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-surface-container-low flex flex-col py-6 space-y-2 border-r border-outline-variant/40 z-40 shadow-sm">
        <div className="px-6 mb-8">
          <h1 className="font-display font-bold text-2xl text-primary tracking-tight">UNAIR Admin</h1>
          <p className="text-xs font-semibold text-on-surface-variant/80 tracking-wider uppercase mt-0.5">Staff Portal</p>
        </div>

        <nav className="flex-1 space-y-1 px-3 text-xs font-semibold">
          <a href="#" className="flex items-center gap-3 px-4 py-3.5 text-on-surface-variant hover:bg-surface-container-highest rounded-xl">
            <LayoutDashboard className="w-4 h-4 text-primary" /><span>Dashboard</span>
          </a>
          <Link to="/catalog-admin" className="flex items-center gap-3 px-4 py-3.5 text-on-surface-variant hover:bg-surface-container-highest rounded-xl">
            <BookOpen className="w-4 h-4 text-primary" /><span>Catalog Admin</span>
          </Link>
          <Link to="/member-directory" className="flex items-center gap-3 px-4 py-3.5 text-on-surface-variant hover:bg-surface-container-highest rounded-xl">
            <Users className="w-4 h-4 text-primary" /><span>Member Management</span>
          </Link>

          {/* ACTIVE MENU */}
          <a href="#" className="flex items-center gap-3 px-4 py-3.5 bg-primary-container text-white font-bold rounded-xl shadow-md">
            <Handshake className="w-4 h-4 text-blue-200" /><span>Loan Processing</span>
          </a>

          <Link to="/fine-management" className="flex items-center gap-3 px-4 py-3.5 text-on-surface-variant hover:bg-surface-container-highest rounded-xl">
            <Banknote className="w-4 h-4 text-primary" /><span>Returns & Fines</span>
          </Link>
        </nav>

        <div className="px-3 space-y-1 text-xs font-semibold border-t border-outline-variant/20 pt-2 mt-auto">
          <button onClick={handleAdminLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl cursor-pointer text-left font-bold">
            <LogOut className="w-4 h-4" /><span>Logout Portal</span>
          </button>
        </div>
      </aside>

      {/* KONTEN UTAMA */}
      <main className="flex-1 ml-64 p-8 md:p-12 max-w-[1400px]">
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="font-display font-bold text-3xl text-primary tracking-tight">Loan Processing Queue</h2>
            <p className="text-xs md:text-sm text-on-surface-variant mt-1 font-medium">Verifikasi dan otorisasi permohonan sirkulasi pustaka dari civitas akademika.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/40" />
              <input
                type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari pemohon / judul..."
                className="pl-10 pr-4 py-2.5 bg-surface-container-lowest border border-outline-variant/50 rounded-full text-xs outline-none focus:border-primary w-60 sm:w-72 shadow-inner font-medium"
              />
            </div>
          </div>
        </header>

        {/* TABEL ANTREAN */}
        <section className="bg-surface-container-lowest rounded-3xl shadow-sm border border-outline-variant/30 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-surface-container-low/60 border-b border-outline-variant/30 font-bold text-on-surface-variant uppercase tracking-wider">
                  <th className="px-6 py-4.5">Member Details</th>
                  <th className="px-6 py-4.5">Book Requested</th>
                  <th className="px-6 py-4.5">Stock Status</th>
                  <th className="px-6 py-4.5">Timestamp</th>
                  <th className="px-6 py-4.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 font-medium">
                {isLoading ? (
                  <tr><td colSpan="5" className="px-6 py-16 text-center text-primary"><Loader2 className="w-8 h-8 animate-spin mx-auto mb-2"/><span>Memeriksa loket pengajuan online...</span></td></tr>
                ) : filteredQueue.length === 0 ? (
                  <tr><td colSpan="5" className="px-6 py-16 text-center text-on-surface-variant/60 font-semibold text-sm">Tidak ada antrean permohonan pinjaman baru saat ini.</td></tr>
                ) : (
                  filteredQueue.map((item) => (
                    <tr key={item.id} className="hover:bg-surface-container-low/40 transition-colors group">
                      <td className="px-6 py-4.5">
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-outline-variant/40 bg-gray-100">
                            <img src={item.memberAvatar} alt={item.memberName} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <span className="block font-display font-bold text-sm text-on-surface group-hover:text-primary transition-colors">{item.memberName}</span>
                            <span className="block font-mono text-[11px] text-on-surface-variant/70 mt-0.5">{item.memberId}</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4.5">
                        <div className="flex items-center gap-3.5">
                          <div className="w-11 h-15 rounded-lg overflow-hidden shrink-0 shadow-sm bg-gray-100">
                            <img src={item.bookCover} alt={item.bookTitle} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <span className="block font-display font-bold text-sm text-on-surface leading-snug">{item.bookTitle}</span>
                            <span className="block text-[11px] text-on-surface-variant/70 italic mt-0.5">{item.bookAuthor}</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4.5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase ${item.statusBg}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${item.statusDot}`}></span><span>{item.statusText}</span>
                        </span>
                      </td>

                      <td className="px-6 py-4.5 text-on-surface-variant font-mono">
                        <span className="block font-bold text-on-surface">{item.reqDate}</span>
                        <span className="block text-[11px] mt-0.5 opacity-80">{item.reqTime}</span>
                      </td>

                      <td className="px-6 py-4.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleApprove(item)}
                            disabled={!item.canApprove}
                            className={`px-4 py-2 rounded-xl font-bold shadow-sm transition-all text-xs cursor-pointer ${
                              item.canApprove ? "bg-primary text-white hover:bg-primary-container active:scale-[0.98]" : "bg-surface-variant text-outline cursor-not-allowed shadow-none"
                            }`}
                          >Approve</button>
                          <button
                            onClick={() => handleReject(item)}
                            className="px-4 py-2 rounded-xl font-bold border border-red-200 text-red-600 hover:bg-red-50 transition-all text-xs cursor-pointer"
                          >Reject</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 bg-surface-container-low/50 flex justify-between items-center border-t border-outline-variant/30 text-xs text-on-surface-variant font-medium">
            <span>Menampilkan {queue.length} antrean permohonan</span>
          </div>
        </section>
      </main>

      {/* TOAST NOTIFICATION */}
      {toast.show && (
        <div className={`fixed bottom-8 right-8 px-6 py-4 rounded-2xl shadow-2xl z-50 flex items-center gap-3 text-white text-xs font-bold animate-slide-up border ${toast.type === "error" ? "bg-red-700 border-red-500" : "bg-primary border-primary-container"}`}>
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div><p className="font-display font-bold text-sm">{toast.title}</p><p className="text-xs font-normal opacity-90 mt-0.5">{toast.message}</p></div>
          <button onClick={() => setToast((prev) => ({ ...prev, show: false }))} className="ml-2 opacity-60 hover:opacity-100 cursor-pointer"><X className="w-4 h-4" /></button>
        </div>
      )}
    </div>
  );
}
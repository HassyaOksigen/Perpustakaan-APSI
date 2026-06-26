import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient'; 
import { 
  Landmark, Bell, ChevronRight, AlertTriangle, 
  Banknote, Filter, Download, Calendar, Clock, MapPin, 
  CheckCircle2, BookOpenCheck, Loader2, Mail, Phone, MessageSquare
} from 'lucide-react';

export default function InformationFine() {
  const [fines, setFines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);

  // State untuk Dispute (Mockup bawaanmu)
  const [isDisputing, setIsDisputing] = useState(false);
  const [disputeSuccess, setDisputeSuccess] = useState(false);

  const LOGGED_IN_EMAIL = "hassya@gmail.com";

  // ================= 1. FETCH DATA DENDA DARI SQL VIEW =================
  useEffect(() => {
    async function fetchUserFines() {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('view_informasi_denda')
          .select('*')
          .eq('user_email', LOGGED_IN_EMAIL)
          .order('status_bayar', { ascending: true }); // Yang belum bayar (false) ditaruh paling atas

        if (error) throw error;
        if (data) setFines(data);
      } catch (err) {
        console.error("Gagal menarik arsip denda:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserFines();
  }, []);

  // ================= 2. PROSES PEMBAYARAN BATCH KE SUPABASE =================
  const handlePayment = async () => {
    // Kumpulkan semua id_denda yang statusnya masih belum dibayar (false)
    const unpaidIds = fines.filter(item => !item.status_bayar).map(item => item.id_denda);
    
    if (unpaidIds.length === 0) return;

    setIsPaying(true);
    try {
      // Tembak tabel asli 'denda', ubah seluruh ID yang nunggak menjadi Lunas
      const { error } = await supabase
        .from('denda')
        .update({ 
          status_bayar: true,
          tanggal_bayar: new Date().toISOString() 
        })
        .in('id_denda', unpaidIds); // <-- Fitur .in() untuk update banyak baris sekaligus!

      if (error) throw error;

      // Ubah tampilan di layar secara instan tanpa perlu refresh browser
      setFines(prev => prev.map(item => ({ ...item, status_bayar: true })));
      alert('🎉 Pembayaran berhasil diverifikasi! Hak akses peminjaman perpustakaan Anda telah dipulihkan seketika.');

    } catch (err) {
      alert("Gagal memproses pembayaran: " + err.message);
    } finally {
      setIsPaying(false);
    }
  };

  const handleDispute = () => {
    setIsDisputing(true);
    setTimeout(() => {
      setIsDisputing(false);
      setDisputeSuccess(true);
    }, 1500);
  };

  // Helper pengubah angka 18000 menjadi format "Rp 18.000"
  const formatRp = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka);
  };

  // --- MATEMATIKA OTOMATIS UNTUK KOTAK SUMMARY ATAS ---
  const unpaidFines = fines.filter(item => !item.status_bayar);
  const isAllPaid = unpaidFines.length === 0 && fines.length > 0;
  
  // Total tagihan = hasil penjumlahan seluruh kolom jumlah_denda yang belum lunas
  const totalOutstanding = unpaidFines.reduce((sum, item) => sum + Number(item.jumlah_denda || 0), 0);
  const longestOverdueDays = unpaidFines.length > 0 ? Math.max(...unpaidFines.map(item => item.hari_terlambat)) : 0;

  return (
    <div className="bg-background min-h-screen font-body text-on-surface antialiased pb-20">
      
      {/* Top Navbar */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[1280px] rounded-full bg-surface/80 backdrop-blur-xl shadow-lg z-50 flex justify-between items-center px-8 h-16 border border-outline-variant/30">
        <div className="flex items-center gap-2">
          <BookOpenCheck className="w-6 h-6 text-primary" />
          <span className="font-display font-bold text-lg text-primary tracking-tight">UNAIR Library</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
          <Link to="/catalog" className="text-on-surface-variant hover:text-primary transition-colors">Catalog</Link>
          <Link to="/my-loans" className="text-on-surface-variant hover:text-primary transition-colors">My Loans</Link>
          <Link to="/information-fine" className="text-primary border-b-2 border-primary pb-1 font-bold">Information Fine</Link>
          <a href="#" className="text-on-surface-variant hover:text-primary transition-colors">E-Resources</a>
        </nav>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-primary/5 rounded-full text-on-surface-variant"><Bell className="w-5 h-5" /></button>
          <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant/30">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" alt="User" />
          </div>
        </div>
      </header>

      <main className="pt-32 max-w-[1280px] mx-auto px-6 md:px-16">
        
        <section className="mb-12">
          <nav className="flex items-center gap-2 text-xs text-on-surface-variant mb-4 font-semibold">
            <Link to="/catalog" className="hover:text-primary">Dashboard</Link><ChevronRight className="w-3.5 h-3.5" />
            <Link to="/my-loans" className="hover:text-primary">My Loans</Link><ChevronRight className="w-3.5 h-3.5" />
            <span className="text-primary font-bold">Fines & Penalties</span>
          </nav>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-primary mb-2 tracking-tight">Member Fine Information</h1>
          <p className="text-sm md:text-base text-on-surface-variant max-w-2xl leading-relaxed">
            Periksa rincian denda keterlambatan pengembalian pustaka Anda. Segera lakukan pelunasan agar portal akademik Anda tidak terblokir.
          </p>
        </section>

        {/* SUMMARY BENTO BOX */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          <div className={`md:col-span-1 p-8 rounded-3xl shadow-sm flex flex-col justify-between border border-outline-variant/30 transition-all ${
            isAllPaid ? 'bg-emerald-50 border-l-4 border-l-emerald-500' : 'bg-surface-container-lowest border-l-4 border-l-red-600'
          }`}>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isAllPaid ? 'bg-emerald-200 text-emerald-800' : 'bg-red-100 text-red-700'}`}>
                  <Banknote className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Total Outstanding</span>
              </div>
              <div className={`font-display font-bold text-4xl md:text-5xl ${isAllPaid ? 'text-emerald-700 opacity-80' : 'text-primary'}`}>
                {formatRp(totalOutstanding)}
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-xs font-bold">
                {!isAllPaid ? (
                  <><AlertTriangle className="w-4 h-4 text-red-600 shrink-0" /><span className="text-red-600">Menunggu Pelunasan</span></>
                ) : (
                  <><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /><span className="text-emerald-700">Seluruh Tagihan Lunas!</span></>
                )}
              </div>
            </div>

            <button 
              onClick={handlePayment}
              disabled={isAllPaid || isPaying || unpaidFines.length === 0}
              className={`mt-8 w-full py-4 font-bold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 ${
                isAllPaid || unpaidFines.length === 0 ? 'bg-surface-variant text-on-surface-variant cursor-not-allowed shadow-none' : 
                isPaying ? 'bg-primary/70 text-white cursor-wait' : 'bg-primary text-white hover:bg-primary-container cursor-pointer'
              }`}
            >
              {isPaying ? <><Loader2 className="w-4 h-4 animate-spin"/> Memproses QRIS...</> : isAllPaid ? 'Status: Lunas' : 'Pay All Fines Now'}
            </button>
          </div>

          <div className="md:col-span-2 bg-surface-container-lowest p-8 rounded-3xl shadow-sm border border-outline-variant/30 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="flex flex-col justify-center border-b sm:border-b-0 sm:border-r border-outline-variant/30 pb-6 sm:pb-0 sm:pr-8">
              <span className="text-xs font-bold text-on-surface-variant mb-2 uppercase tracking-wider">Overdue Items</span>
              <div className="flex items-baseline gap-2">
                <span className="font-display font-bold text-5xl text-primary">{unpaidFines.length}</span>
                <span className="text-on-surface-variant font-medium text-sm">Buku Tertunggak</span>
              </div>
              <div className="mt-4 h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(unpaidFines.length / 5) * 100}%` }}></div>
              </div>
              <p className="mt-2 text-xs text-on-surface-variant/80 italic font-medium">Batas maksimal keterlambatan: 5 buku</p>
            </div>

            <div className="flex flex-col justify-center">
              <span className="text-xs font-bold text-on-surface-variant mb-2 uppercase tracking-wider">Longest Overdue</span>
              <div className="flex items-baseline gap-2">
                <span className="font-display font-bold text-5xl text-red-600">{longestOverdueDays}</span>
                <span className="text-on-surface-variant font-medium text-sm">Hari</span>
              </div>
              <p className="mt-4 text-xs font-medium text-on-surface-variant leading-relaxed">Dihitung dari tanggal jatuh tempo paling lama</p>
            </div>
          </div>

        </div>

        {/* RINCIAN DAFTAR DENDA (TERKONEKSI DATABASE) */}
        <section className="mb-12 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="font-display font-bold text-2xl text-primary">Overdue Item Details</h2>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <div className="py-16 text-center text-primary flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 animate-spin"/>
                <span className="text-xs font-bold uppercase tracking-wider">Menghitung akumulasi denda harian...</span>
              </div>
            ) : fines.length === 0 ? (
              <div className="bg-surface-container-lowest p-12 rounded-3xl border border-dashed border-outline-variant/60 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3 opacity-80 animate-bounce"/>
                <h3 className="font-display font-bold text-lg text-on-surface">Catatan Bersih</h3>
                <p className="text-xs text-on-surface-variant mt-1">Anda tidak memiliki riwayat pelanggaran atau denda keterlambatan di perpustakaan.</p>
              </div>
            ) : (
              fines.map((item) => {
                const isItemPaid = item.status_bayar;

                return (
                  <div 
                    key={item.id_denda} 
                    className={`p-6 rounded-2xl shadow-sm transition-all border group font-medium ${
                      isItemPaid ? 'bg-emerald-50/30 border-emerald-200 opacity-65' : 'bg-surface-container-lowest border-outline-variant/30 hover:border-red-400'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                      <div className="w-16 h-24 rounded-xl shrink-0 overflow-hidden shadow-md bg-surface-container bg-gray-100">
                        <img src={item.image_url || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=400&auto=format&fit=crop"} alt="Cover" className="w-full h-full object-cover" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase ${isItemPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700'}`}>
                                {isItemPaid ? 'LUNAS' : 'BELUM BAYAR'}
                              </span>
                              <span className="text-xs text-on-surface-variant font-mono">{item.lokasi_rak}</span>
                            </div>
                            <h3 className="font-display font-bold text-base md:text-lg text-primary">
                              {item.judul_buku}
                            </h3>
                            <p className="text-xs text-on-surface-variant mt-0.5">Penulis: {item.pengarang}</p>
                          </div>

                          <div className="sm:text-right shrink-0">
                            <div className={`font-display font-bold text-lg ${isItemPaid ? 'text-emerald-700' : 'text-red-600'}`}>
                              {formatRp(item.jumlah_denda)}
                            </div>
                            <span className="text-[11px] text-on-surface-variant/80 font-mono">
                              Tarif: {item.hari_terlambat} hari × Rp1.500
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-5 border-t border-outline-variant/20 pt-4 text-xs text-on-surface-variant">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-outline" />
                            <span>Jatuh Tempo: {item.tgl_jatuh_tempo}</span>
                          </div>
                          <div className={`flex items-center gap-1.5 font-bold ${isItemPaid ? 'text-emerald-700' : 'text-red-600'}`}>
                            <Clock className="w-3.5 h-3.5" />
                            <span>{item.hari_terlambat} Hari Terlambat</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-outline" />
                            <span>{item.cabang || "Perpustakaan Pusat"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* ... Bagian Bawah (How to Pay & Dispute) tetap sama seperti kodemu ... */}

      </main>
    </div>
  );
}
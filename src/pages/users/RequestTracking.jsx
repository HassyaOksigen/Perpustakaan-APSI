import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient'; // Sesuaikan path ../ jika berbeda
import { 
  Bell, User, Sparkles, QrCode, MapPin, Clock, 
  Loader2, CheckCircle2, Repeat, History, Search, BookOpen, BookOpenCheck, X, Calendar
} from 'lucide-react';

export default function RequestTracking() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQR, setSelectedQR] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Hardcode simulasi user yang sedang login (Nanti bisa diganti pakai localStorage)
  const LOGGED_IN_EMAIL = "hassya@gmail.com";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ================= FETCH DATA DARI SUPABASE =================
  useEffect(() => {
    async function fetchTrackingHistory() {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('view_request_tracking')
          .select('*')
          .eq('user_email', LOGGED_IN_EMAIL)
          .order('raw_borrow_date', { ascending: false });

        if (error) throw error;
        if (data) setRequests(data);
      } catch (err) {
        console.error("Gagal menarik riwayat tracking:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTrackingHistory();
  }, []);

  // --- MATEMATIKA UNTUK BENTO BOX ATAS ---
  const totalEverBorrowed = requests.length; // Berapa kali user pernah pinjam seumur hidup
  const activeLoansCount = requests.filter(r => r.is_active).length;
  const returnedCount = requests.filter(r => !r.is_active).length;

  return (
    <div className="bg-background min-h-screen text-on-background font-body antialiased pb-16">
      
      {/* Top Navigation Bar */}
      <nav className={`fixed left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[1280px] rounded-full bg-surface/80 backdrop-blur-xl transition-all duration-300 z-50 flex justify-between items-center px-8 h-16 ${
        isScrolled ? 'top-2 shadow-xl border border-outline-variant/30' : 'top-4 shadow-lg border border-transparent'
      }`}>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <BookOpenCheck className="w-6 h-6 text-primary" />
            <span className="font-display font-bold text-lg text-primary tracking-tight">UNAIR Library</span>
          </div>
          <div className="hidden md:flex items-center gap-6 font-semibold text-sm">
            <Link to="/catalog" className="text-on-surface-variant hover:text-primary transition-colors">Catalog</Link>
            <Link to="/my-loans" className="text-on-surface-variant hover:text-primary transition-colors">My Loans</Link>
            <Link to="/collections" className="text-primary border-b-2 border-primary pb-1 font-bold">Collections</Link>
            <a href="#" className="text-on-surface-variant hover:text-primary transition-colors">Journals</a>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-primary/5 rounded-full text-on-surface-variant cursor-pointer"><Bell className="w-5 h-5" /></button>
          <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant/30">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" alt="User" />
          </div>
        </div>
      </nav>

      <main className="max-w-[1280px] mx-auto px-6 md:px-16 pt-32 pb-20">
        
        <header className="mb-12">
          <h1 className="font-display font-bold text-4xl md:text-5xl text-primary mb-4 tracking-tight">Request & Loan Tracking</h1>
          <p className="text-sm md:text-base text-on-surface-variant max-w-2xl leading-relaxed">
            Pantau seluruh aktivitas sirkulasi Anda. Terdata secara waktu nyata (*real-time*) dari basis data perpustakaan pusat.
          </p>
        </header>

        {/* STATUS SUMMARY BENTO GRID (Terhubung ke Database) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-secondary-container p-6 rounded-2xl shadow-sm flex flex-col gap-2 border-l-4 border-primary">
            <span className="text-on-secondary-container text-xs font-bold uppercase tracking-wider">Total Peminjaman</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-primary font-display font-bold text-3xl md:text-4xl">{totalEverBorrowed}</span>
              <span className="text-xs font-bold text-primary/70 uppercase">Kali Pinjam</span>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col gap-2">
            <span className="text-on-surface-variant text-xs font-bold uppercase tracking-wider">Active Loans</span>
            <span className="text-primary font-display font-bold text-3xl md:text-4xl">{activeLoansCount}</span>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col gap-2">
            <span className="text-on-surface-variant text-xs font-bold uppercase tracking-wider">Telah Dikembalikan</span>
            <span className="text-emerald-600 font-display font-bold text-3xl md:text-4xl">{returnedCount}</span>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col gap-2">
            <span className="text-on-surface-variant text-xs font-bold uppercase tracking-wider">Status Akun</span>
            <span className="text-primary font-display font-bold text-xl mt-2">Active / Clear</span>
          </div>
        </div>

        {/* TIMELINE RIWAYAT PEMINJAMAN */}
        <div className="flex flex-col gap-8">
          <h2 className="font-display font-bold text-2xl text-primary">Circulation Timeline History</h2>
          
          <div className="space-y-12 relative before:absolute before:inset-0 before:left-[19px] before:w-0.5 before:bg-outline-variant/40">
            
            {isLoading ? (
              <div className="pl-12 py-12 text-center text-primary flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 animate-spin text-primary"/>
                <span className="text-xs font-bold uppercase tracking-wider">Menyinkronkan arsip sirkulasi...</span>
              </div>
            ) : requests.length === 0 ? (
              <div className="pl-12 py-8 text-on-surface-variant italic font-medium text-sm">Belum ada riwayat peminjaman buku yang tercatat di database.</div>
            ) : (
              requests.map((item) => {
                const isActive = item.is_active;

                return (
                  <div key={item.id_transaksi} className="relative pl-12 group">
                    
                    {/* Ikon Bulat Kiri */}
                    <div className={`absolute left-0 top-1 w-10 h-10 rounded-full flex items-center justify-center ring-4 ring-background z-10 shadow ${
                      isActive ? 'bg-primary text-white' : 'bg-surface-container-highest text-on-surface-variant'
                    }`}>
                      {isActive ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <History className="w-5 h-5" />}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      
                      {/* Kartu Utama */}
                      <div className={`lg:col-span-8 flex flex-col sm:flex-row gap-6 p-6 rounded-2xl border transition-all ${
                        isActive 
                          ? 'bg-white shadow-lg border-outline-variant/40 hover:shadow-xl' 
                          : 'bg-surface-container-lowest shadow-sm border-outline-variant/20 opacity-75 grayscale hover:grayscale-0'
                      }`}>
                        <div className="w-full sm:w-28 aspect-[3/4] rounded-xl bg-surface-container overflow-hidden shrink-0 shadow bg-gray-100">
                          <img src={item.cover || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=400&auto=format&fit=crop"} alt={item.title} className="w-full h-full object-cover" />
                        </div>

                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${
                                isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-surface-container-highest text-on-surface-variant'
                              }`}>
                                {isActive ? 'Active Loan' : 'Returned'}
                              </span>
                              <span className="text-xs font-mono font-bold text-primary">
                                Tanggal Pinjam: {item.borrow_date}
                              </span>
                            </div>
                            
                            <h3 className="font-display font-bold text-lg text-on-surface leading-snug">{item.title}</h3>
                            <p className="text-xs text-on-surface-variant font-medium mt-1">Penulis: {item.author || "Tidak Diketahui"}</p>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t border-outline-variant/20 text-xs text-on-surface-variant">
                            <div className="flex items-center gap-1.5 font-mono">
                              <Calendar className="w-3.5 h-3.5 text-primary" />
                              <span>Jatuh Tempo: {item.due_date}</span>
                            </div>
                            
                            {isActive && (
                              <button 
                                onClick={() => setSelectedQR(item.title)}
                                className="ml-auto bg-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-primary-container transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                              >
                                <QrCode className="w-3.5 h-3.5" /> <span>Locker QR</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Panel Petunjuk Kanan */}
                      <div className="lg:col-span-4 bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 shadow-2xs">
                        <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">Informasi Loket</p>
                        <ul className="space-y-2.5 text-xs font-medium text-on-surface-variant">
                          <li className="flex items-start gap-2.5">
                            <MapPin className="w-4 h-4 text-primary shrink-0" />
                            <span>Perpustakaan Kampus B (Lantai 1)</span>
                          </li>
                          <li className="flex items-start gap-2.5">
                            <Clock className="w-4 h-4 text-primary shrink-0" />
                            <span>{isActive ? "Wajib dikembalikan sebelum jam 16:00 WIB" : "Telah disahkan oleh Pustakawan"}</span>
                          </li>
                        </ul>
                      </div>

                    </div>
                  </div>
                );
              })
            )}

          </div>
        </div>

      </main>

      {/* Footer Standar */}
      <footer className="w-full mt-20 bg-surface-container border-t border-outline-variant/40 py-12 text-xs text-on-surface-variant">
        <div className="max-w-[1280px] mx-auto px-6 md:px-16 flex justify-between items-center font-medium">
          <div><span className="font-display font-bold text-primary">UNAIR Library</span> | © 2024 Universitas Airlangga.</div>
        </div>
      </footer>

      {/* MODAL QR CODE LOCKER */}
      {selectedQR && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-outline-variant/20 text-center relative">
            <button onClick={() => setSelectedQR(null)} className="absolute top-5 right-5 text-on-surface-variant/50 hover:text-on-surface cursor-pointer p-1"><X className="w-5 h-5" /></button>
            <h3 className="font-display font-bold text-xl text-primary mb-1">Locker / Gate QR</h3>
            <p className="text-xs text-on-surface-variant font-semibold mb-6 line-clamp-1">{selectedQR}</p>
            <div className="w-52 h-52 bg-surface-container rounded-2xl p-3 mx-auto mb-6 shadow-inner border border-outline-variant/30 flex items-center justify-center">
              <QrCode className="w-full h-full text-primary" />
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed px-2">Pindai kode ini di **Gate Sirkulasi** atau **Smart Locker** untuk membuka pintu penyimpanan buku Anda secara otomatis.</p>
          </div>
        </div>
      )}

    </div>
  );
}
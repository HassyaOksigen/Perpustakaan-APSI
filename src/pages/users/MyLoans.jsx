import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient'; 
import { 
  Search, Bell, User, RotateCcw, Info, BookOpen, 
  Clock, Headphones, CheckCircle2, X, BookOpenCheck, Loader2
} from 'lucide-react';

export default function MyLoans() {
  const [loans, setLoans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Menyimpan KTP/Objek lengkap dari buku yang mau dikembalikan
  const [selectedLoan, setSelectedLoan] = useState(null);
  
  const [toastMessage, setToastMessage] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Email hardcode simulasi login (Ganti pakai localStorage.getItem('email') nanti)
  const LOGGED_IN_EMAIL = "hassya@gmail.com"; 

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ================= 1. TARIK DATA DARI SQL VIEW =================
  useEffect(() => {
    async function fetchActiveCirculation() {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('view_daftar_pinjaman')
          .select('*')
          .eq('user_email', LOGGED_IN_EMAIL)
          .eq('is_active', true); // Hanya tampilkan yang belum dikembalikan

        if (error) throw error;
        if (data) setLoans(data);
      } catch (err) {
        console.error("Gagal memuat pinjaman:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchActiveCirculation();
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // ================= 2. LOGIKA KEMBALIKAN BUKU KE RAK =================
  const handleConfirmReturn = async () => {
    if (!selectedLoan) return;

    try {
      // A. Matikan status peminjaman di tabel 'peminjaman' menjadi false
      const { error: updErr } = await supabase
        .from('peminjaman')
        .update({ status_peminjaman: false })
        .eq('id_peminjaman', selectedLoan.id_peminjaman);

      if (updErr) throw updErr;

      // B. Intip stok buku saat ini, lalu kembalikan +1
      const { data: bData } = await supabase
        .from('buku')
        .select('stok')
        .eq('id_buku', selectedLoan.id_buku)
        .single();

      if (bData) {
        await supabase
          .from('buku')
          .update({ stok: bData.stok + 1 })
          .eq('id_buku', selectedLoan.id_buku);
      }

      // C. Usir buku tersebut dari state React agar hilang dari layar seketika
      setLoans(prev => prev.filter(item => item.id_peminjaman !== selectedLoan.id_peminjaman));
      
      triggerToast(`Buku "${selectedLoan.title}" berhasil dikembalikan ke Perpustakaan!`);
      setSelectedLoan(null);

    } catch (err) {
      alert("Gagal mengembalikan buku: " + err.message);
    }
  };

  const filteredLoans = loans.filter(l => 
    l.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Perhitungan buku yang jatuh temponya sisa <= 3 hari
  const dueSoonCount = loans.filter(l => {
    if (!l.due_date) return false;
    const diffDays = Math.ceil((new Date(l.due_date) - new Date()) / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
  }).length;

  return (
    <div className="bg-background min-h-screen font-body text-on-surface antialiased overflow-x-hidden selection:bg-secondary-container">
      
      <header className={`fixed left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[1280px] rounded-full bg-surface/80 backdrop-blur-xl flex justify-between items-center px-8 h-16 z-50 transition-all duration-300 ${
        isScrolled ? 'top-2 shadow-xl border border-outline-variant/30' : 'top-4 shadow-lg border border-transparent'
      }`}>
        <div className="flex items-center gap-2">
          <BookOpenCheck className="w-6 h-6 text-primary" />
          <span className="font-display font-bold text-lg text-primary tracking-tight">UNAIR Library</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold">
          <Link to="/catalog" className="text-on-surface-variant hover:text-primary transition-colors">Catalog</Link>
          <Link to="/my-loans" className="text-primary border-b-2 border-primary pb-1 font-bold">My Loans</Link>
          <Link to="/information-fine" className="text-on-surface-variant hover:text-primary transition-colors">Information Fine</Link>
          <a href="#" className="text-on-surface-variant hover:text-primary transition-colors">E-Resources</a>
        </nav>

        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-primary/5 rounded-full text-primary"><Bell className="w-5 h-5" /></button>
          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary/20"><img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" alt="User" /></div>
        </div>
      </header>

      <main className="pt-32 pb-20 px-6 md:px-16 max-w-[1280px] mx-auto">
        <section className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="font-display font-bold text-4xl md:text-5xl text-primary mb-2 tracking-tight">My Loans</h1>
              <p className="text-sm md:text-base text-on-surface-variant max-w-2xl leading-relaxed">
                Pantau sirkulasi peminjaman aktifmu. Kembalikan buku tepat waktu untuk menghindari sanksi pemblokiran portal.
              </p>
            </div>

            <div className="flex items-center gap-4 bg-surface-container-low p-4 rounded-2xl border border-outline-variant/30 shadow-sm shrink-0">
              <div className="text-right">
                <span className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">Active Loans</span>
                <span className="block font-display font-bold text-2xl text-primary">{loans.length} Items</span>
              </div>
              <div className="h-10 w-px bg-outline-variant/30 mx-2"></div>
              <div className="text-right">
                <span className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">Due Soon</span>
                <span className="block font-display font-bold text-2xl text-red-600">{dueSoonCount} Item</span>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-3 bg-surface-container-lowest rounded-3xl shadow-sm overflow-hidden border border-outline-variant/30">
            <div className="p-6 border-b border-outline-variant/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container-low/30">
              <h2 className="font-display font-bold text-xl text-primary">Active Circulation</h2>
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/40" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by title..." 
                  className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-surface-container-lowest border border-outline-variant/40 rounded-full text-xs focus:outline-none focus:border-primary transition-all shadow-inner"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-surface-container-low/50 border-b border-outline-variant/20">
                    <th className="px-6 py-4 font-bold text-on-surface-variant uppercase tracking-wider">Book Details</th>
                    <th className="px-6 py-4 font-bold text-on-surface-variant uppercase tracking-wider">Date Borrowed</th>
                    <th className="px-6 py-4 font-bold text-on-surface-variant uppercase tracking-wider">Due Date</th>
                    <th className="px-6 py-4 font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 font-bold text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {isLoading ? (
                    <tr><td colSpan="5" className="px-6 py-16 text-center text-primary"><Loader2 className="w-8 h-8 animate-spin mx-auto mb-2"/><span>Menghubungkan ke loket sirkulasi...</span></td></tr>
                  ) : filteredLoans.length === 0 ? (
                    <tr><td colSpan="5" className="px-6 py-12 text-center text-on-surface-variant/60 font-medium">Tidak ada tanggungan buku yang sedang kamu pinjam saat ini.</td></tr>
                  ) : (
                    filteredLoans.map((book) => (
                      <tr key={book.id_transaksi} className="hover:bg-surface-container-low/50 transition-colors group font-medium">
                        <td className="px-6 py-4.5">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-16 rounded-lg overflow-hidden shadow-md shrink-0 bg-surface-container">
                              <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <Link to={`/book-detail/${book.id_buku}`} className="block font-display font-bold text-sm text-on-surface hover:text-primary transition-colors mb-0.5">
                                {book.title}
                              </Link>
                              <span className="block font-mono text-[11px] text-on-surface-variant/70">ISBN: {book.isbn}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4.5 text-on-surface-variant font-mono">{book.borrow_date}</td>
                        <td className="px-6 py-4.5 text-primary font-bold font-mono">{book.due_date}</td>
                        <td className="px-6 py-4.5">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-primary-fixed text-on-primary-fixed-variant">
                            {book.status}
                          </span>
                        </td>
                        <td className="px-6 py-4.5 text-right">
                          <button 
                            onClick={() => setSelectedLoan(book)} // Mengirim SELURUH data buku ke modal
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-bold text-xs rounded-xl hover:bg-primary-container shadow-md shadow-primary/20 active:scale-[0.98] transition-all cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Return Item</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Side Bento Panels */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:col-span-3 mt-2">
            <div className="bg-primary p-8 rounded-3xl text-white flex flex-col justify-between shadow-xl relative overflow-hidden group">
              <div className="relative z-10 space-y-2"><Info className="w-8 h-8 text-white/80 mb-4" /><h3 className="font-display font-bold text-xl">Loan Policy</h3><p className="text-xs text-white/80 leading-relaxed max-w-xs">Mahasiswa reguler berhak meminjam maksimal 5 pustaka selama 14 hari kerja.</p></div>
              <a href="#" className="relative z-10 text-xs font-bold underline underline-offset-4 hover:text-blue-200 pt-4 block">Pakta Integritas</a>
            </div>
            <div className="bg-surface-container-low p-8 rounded-3xl flex flex-col justify-between border border-outline-variant/40 shadow-sm">
              <div className="space-y-2"><Clock className="w-8 h-8 text-primary mb-4" /><h3 className="font-display font-bold text-xl text-primary">Library Hours</h3><p className="text-xs text-on-surface-variant leading-relaxed font-medium">Senin - Jumat: 08:00 - 20:00 WIB<br />Sabtu: 09:00 - 15:00 WIB</p></div>
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs pt-4"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span><span>Loket Sirkulasi Buka</span></div>
            </div>
            <div className="bg-secondary-fixed p-8 rounded-3xl flex flex-col justify-between border border-secondary-fixed shadow-sm">
              <div className="space-y-2"><Headphones className="w-8 h-8 text-on-secondary-fixed-variant mb-4" /><h3 className="font-display font-bold text-xl text-on-secondary-fixed-variant">Perpanjang Masa?</h3><p className="text-xs text-on-secondary-fixed-variant/80 leading-relaxed font-medium">Ajukan perpanjangan 1x7 hari sebelum tanggal jatuh tempo tiba.</p></div>
              <button className="mt-6 w-full py-3 bg-white hover:bg-white/90 text-on-secondary-fixed-variant font-bold text-xs rounded-xl transition-all shadow-sm cursor-pointer">Live Chat Pustakawan</button>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-surface-container border-t border-outline-variant/40 w-full py-12 mt-20 text-xs text-on-surface-variant">
        <div className="max-w-[1280px] mx-auto px-6 md:px-16 flex justify-between items-center font-medium">
          <div><span className="font-display font-bold text-primary">UNAIR Library</span> | © 2024 Universitas Airlangga.</div>
        </div>
      </footer>

      {/* MODAL KONFIRMASI PENGEMBALIAN */}
      {selectedLoan && (
        <div className="fixed inset-0 bg-primary/30 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-surface-container-lowest rounded-3xl shadow-2xl max-w-md w-full p-8 border border-outline-variant/30 text-center relative">
            <button onClick={() => setSelectedLoan(null)} className="absolute top-6 right-6 text-on-surface-variant/50 hover:text-on-surface"><X className="w-5 h-5" /></button>
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary border border-primary/20"><RotateCcw className="w-8 h-8" /></div>
            <h3 className="font-display font-bold text-2xl text-primary mb-2">Kembalikan Pustaka?</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed mb-8 px-2">
              Sistem akan mencabut hak pinjammu atas buku <span className="font-bold text-primary">"{selectedLoan.title}"</span>. Pastikan fisik buku telah kamu serahkan ke petugas loket pengembalian.
            </p>
            <div className="flex gap-4">
              <button onClick={() => setSelectedLoan(null)} className="flex-1 py-3.5 bg-surface-container rounded-2xl font-bold text-xs text-on-surface-variant hover:bg-surface-container-highest cursor-pointer">Batal</button>
              <button onClick={handleConfirmReturn} className="flex-1 py-3.5 bg-primary text-white rounded-2xl font-bold text-xs hover:bg-primary-container shadow-lg shadow-primary/20 cursor-pointer">Konfirmasi Selesai</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface px-6 py-4 rounded-full shadow-2xl z-[200] flex items-center gap-3 text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /><span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, Bell, ArrowRight, CheckCircle2, 
  CalendarCheck, Scale, ShieldCheck, Loader2, BookOpenCheck, ArrowLeft
} from 'lucide-react';

export default function LoanConfirmation() {
  // ATURAN EMAS: Hook selalu di baris paling atas!
  const navigate = useNavigate();

  // State untuk checkbox persetujuan (Bawaannya "true" sesuai HTML aslimu)
  const [isAgreed, setIsAgreed] = useState(true);
  
  // State untuk memantau proses tombol ('idle' | 'processing' | 'success')
  const [confirmState, setConfirmState] = useState('idle');

  // Terjemahan dari script setTimeout di HTML aslimu:
  const handleConfirmSubmit = () => {
    if (!isAgreed) return;

    setConfirmState('processing');

    // 1. Simulasi proses sistem (2 detik)
    setTimeout(() => {
      setConfirmState('success');

      // 2. Tampilkan pesan sukses lalu lempar kembali ke Katalog (1 detik setelah sukses)
      setTimeout(() => {
        alert('🎉 Loan Request Successfully Submitted! You can pick up your physical copy at Campus A.');
        navigate('/my-loans');
      }, 1000);

    }, 2000);
  };

  return (
    <div className="bg-background min-h-screen font-body text-on-surface antialiased selection:bg-secondary-container">
      
      {/* Top Navigation Bar */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-[1280px] rounded-full bg-surface/80 backdrop-blur-xl shadow-md border border-outline-variant/30 flex justify-between items-center px-8 h-16 z-50">
        <div className="flex items-center gap-2">
          <BookOpenCheck className="w-6 h-6 text-primary" />
          <span className="font-display font-bold text-lg text-primary tracking-tight">UNAIR Library</span>
        </div>

        <div className="hidden md:flex items-center gap-8 font-semibold text-sm">
          <Link to="/catalog" className="text-on-surface-variant hover:text-primary transition-colors">Catalog</Link>
          <Link to="/my-loans" className="text-primary border-b-2 border-primary pb-1 font-bold">My Loans</Link>
          <Link to="/information-fine" className="text-on-surface-variant hover:text-primary transition-colors">Information Fine</Link>
          <a href="#" className="text-on-surface-variant hover:text-primary transition-colors">Journals</a>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-primary-fixed/20 rounded-full transition-all text-on-surface-variant cursor-pointer">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-primary-fixed/20 rounded-full transition-all text-on-surface-variant cursor-pointer">
            <Bell className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-full bg-surface-container-high overflow-hidden border border-outline-variant/30 cursor-pointer">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" 
              alt="User" 
              className="w-full h-full object-cover" 
            />
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6 md:px-16 max-w-[1280px] mx-auto">
        
        {/* Tombol Back */}
        <div className="mb-6">
          <button 
            onClick={() => navigate(-1)} 
            className="inline-flex items-center gap-2 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Stock Availability</span>
          </button>
        </div>

        {/* Page Header */}
        <header className="mb-12 text-center md:text-left">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-bold text-xs mb-4 tracking-wider uppercase">
            Step 3: Confirmation
          </div>
          <h1 className="font-display font-bold text-3xl md:text-5xl text-primary mb-4 tracking-tight">Finalize Your Loan Request</h1>
          <p className="text-sm md:text-base text-on-surface-variant max-w-2xl leading-relaxed">
            Please review the details of your loan selection. Once confirmed, you will be notified when the physical copy is ready for pickup.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* KOLOM KIRI (8/12): Rincian Buku & Ketentuan */}
          <section className="lg:col-span-8 space-y-8">
            
            {/* Card Buku */}
            <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm border border-outline-variant/30 flex flex-col sm:flex-row gap-8 items-center sm:items-start">
              <div className="w-48 sm:w-44 aspect-[3/4] bg-surface-container rounded-2xl overflow-hidden shadow-md shrink-0">
                <img 
                  src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop" 
                  alt="Fluid Dynamics Book" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 flex flex-col justify-center text-center sm:text-left">
                <span className="text-[10px] font-extrabold text-primary-container bg-primary-fixed/50 px-3 py-1 rounded-full self-center sm:self-start mb-3 tracking-wider">AVAILABLE</span>
                <h2 className="font-display font-bold text-2xl text-on-surface mb-2 leading-snug">
                  Advanced Fluid Dynamics: Theory and Applications
                </h2>
                <p className="text-xs text-on-surface-variant font-medium mb-6">By Dr. Julian Thorne & Prof. Maria Elena Santos (2023)</p>
                
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-outline-variant/30 text-xs font-medium">
                  <div>
                    <span className="text-outline uppercase tracking-wider block mb-1 text-[10px] font-bold">ISBN</span>
                    <span className="font-bold text-on-surface">978-3-16-148410-0</span>
                  </div>
                  <div>
                    <span className="text-outline uppercase tracking-wider block mb-1 text-[10px] font-bold">Call No.</span>
                    <span className="font-bold text-on-surface">QA911 .T46 2023</span>
                  </div>
                  <div>
                    <span className="text-outline uppercase tracking-wider block mb-1 text-[10px] font-bold">Language</span>
                    <span className="font-bold text-on-surface">English</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bento Ketentuan Peminjaman */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Durasi */}
              <div className="bg-surface-container-low rounded-3xl p-6 border border-outline-variant/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 bg-primary/10 rounded-xl text-primary"><CalendarCheck className="w-5 h-5" /></div>
                    <h3 className="font-display font-bold text-lg text-primary">Loan Duration</h3>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">Standard institutional loan period for postgraduate students and faculty members.</p>
                </div>
                <div className="mt-6 p-4 bg-white rounded-2xl border border-outline-variant/40 shadow-sm flex items-baseline justify-between">
                  <div>
                    <span className="text-3xl font-display font-bold text-primary">14</span>
                    <span className="text-xs font-bold text-on-surface-variant ml-1">Days</span>
                  </div>
                  <span className="text-[11px] font-semibold text-outline">Due: Oct 28, 2024</span>
                </div>
              </div>

              {/* Aturan Denda */}
              <div className="bg-surface-container-low rounded-3xl p-6 border border-outline-variant/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-primary/10 rounded-xl text-primary"><Scale className="w-5 h-5" /></div>
                  <h3 className="font-display font-bold text-lg text-primary">Institutional Terms</h3>
                </div>
                <ul className="space-y-3 text-xs font-medium text-on-surface-variant">
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-secondary shrink-0" /> One (1) renewal permitted online</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-secondary shrink-0" /> Late fee of Rp 2,000/day applies</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-secondary shrink-0" /> Pick up within 48 hours of approval</li>
                </ul>
              </div>

            </div>

          </section>

          {/* KOLOM KANAN (4/12): Panel Checkout */}
          <aside className="lg:col-span-4">
            <div className="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/30 shadow-sm sticky top-28 space-y-6">
              <h3 className="font-display font-bold text-xl text-primary">Summary</h3>
              
              <div className="space-y-3.5 text-xs font-medium border-b border-outline-variant/30 pb-6">
                <div className="flex justify-between"><span className="text-on-surface-variant">Request Date</span><span className="font-bold text-on-surface">Oct 14, 2024</span></div>
                <div className="flex justify-between"><span className="text-on-surface-variant">Collection Point</span><span className="font-bold text-on-surface">Main Campus Library</span></div>
                <div className="flex justify-between"><span className="text-on-surface-variant">Digital Copy</span><span className="font-bold text-secondary">Included</span></div>
              </div>

              {/* Checkbox Persetujuan */}
              <div className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/40">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={isAgreed}
                    onChange={(e) => setIsAgreed(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer shrink-0" 
                  />
                  <span className="text-xs text-on-surface-variant leading-relaxed">
                    I agree to the <a href="#" className="text-primary font-bold hover:underline">Library Loan Policy</a> and accept responsibility for the physical condition of this item.
                  </span>
                </label>
              </div>

              {/* Tombol Eksekusi Reaktif */}
              <div className="space-y-3 pt-2">
                <button 
                  onClick={handleConfirmSubmit}
                  disabled={!isAgreed || confirmState !== 'idle'}
                  className={`w-full py-4 rounded-2xl font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    confirmState === 'success' ? 'bg-emerald-600 text-white shadow-emerald-600/20' :
                    confirmState === 'processing' ? 'bg-primary/80 text-white cursor-wait shadow-none' :
                    !isAgreed ? 'bg-surface-variant text-outline cursor-not-allowed shadow-none' :
                    'bg-primary text-white shadow-primary/20 hover:bg-primary-container active:scale-[0.98]'
                  }`}
                >
                  {confirmState === 'idle' && (
                    <><span>Confirm Loan Request</span><ArrowRight className="w-4 h-4" /></>
                  )}
                  {confirmState === 'processing' && (
                    <><Loader2 className="w-4 h-4 animate-spin" /><span>Processing Institutional Request...</span></>
                  )}
                  {confirmState === 'success' && (
                    <><CheckCircle2 className="w-4 h-4" /><span>Request Submitted!</span></>
                  )}
                </button>

                <button 
                  onClick={() => navigate(-1)}
                  disabled={confirmState !== 'idle'}
                  className="w-full py-3 text-xs font-bold text-on-surface-variant hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all cursor-pointer"
                >
                  Cancel Request
                </button>
              </div>

              <div className="pt-2 flex items-center justify-center gap-2 text-on-surface-variant/60">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Secure Institutional Processing</span>
              </div>
            </div>
          </aside>

        </div>
      </main>

      {/* Footer Standar */}
      <footer className="bg-surface-container border-t border-outline-variant/40 w-full py-12 mt-20 text-xs text-on-surface-variant">
        <div className="max-w-[1280px] mx-auto px-6 md:px-16 flex flex-col md:flex-row justify-between items-center gap-6 font-medium">
          <div className="font-display font-bold text-base text-primary">UNAIR Library</div>
          <div className="flex flex-wrap justify-center gap-8">
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Contact Support</a>
          </div>
          <div>© 2024 Universitas Airlangga Library. All rights reserved.</div>
        </div>
      </footer>

    </div>
  );
}
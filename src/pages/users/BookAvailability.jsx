import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, Bell, Bookmark, Globe, Calendar, BookOpen, 
  Package, Landmark, Hospital, Clock, BookmarkPlus, Share2, 
  ShieldCheck, Laptop, AtSign, ArrowLeft, CheckCircle2, Loader2, BookOpenCheck
} from 'lucide-react';

export default function BookAvailability() {
  const navigate = useNavigate();
  
  // State untuk simulasi klik tombol "Request Reservation"
  const [isReserving, setIsReserving] = useState(false);
  const [reserveSuccess, setReserveSuccess] = useState(false);

  const handleReservation = () => {
    setIsReserving(true);
    setTimeout(() => {
      setIsReserving(false);
      setReserveSuccess(true);
      navigate('/loan-confirmation');
    }, 1500);
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
          <Link to="/catalog" className="text-primary border-b-2 border-primary pb-1">Catalog</Link>
          <Link
            to="/collections"
            className="font-semibold text-sm text-on-surface-variant hover:text-primary transition-colors"
          >
            Collections
          </Link>
            <Link
              to="/my-loans"
              className="font-semibold text-sm text-on-surface-variant hover:text-primary transition-colors"
            >
              My Loans
            </Link>
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

      <main className="pt-32 pb-24 max-w-[1280px] mx-auto px-6 md:px-8 min-h-screen">
        
        {/* Tombol Kembali ke Detail Buku */}
        <div className="mb-8">
          <button 
            onClick={() => navigate(-1)} 
            className="inline-flex items-center gap-2 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Synopsis & Details</span>
          </button>
        </div>

        {/* ASYMMETRIC GRID (7 : 5 Ratio) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* SISI KIRI (Kolom 7/12): Identitas Buku & Live Widget */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Card Identitas Buku */}
            <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm border border-outline-variant/20 flex flex-col sm:flex-row gap-8">
              <div className="w-full sm:w-56 h-80 bg-surface-container rounded-2xl overflow-hidden shadow-lg shrink-0">
                <img 
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=600&auto=format&fit=crop" 
                  alt="Medical Book" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col justify-between py-1">
                <div>
                  <div className="flex gap-2 mb-4">
                    <span className="px-3 py-1 bg-secondary-fixed text-on-secondary-fixed-variant text-[11px] font-bold rounded-full tracking-wider">MEDICAL SCIENCE</span>
                    <span class="px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed text-[11px] font-bold rounded-full tracking-wider">QUARTILE 1</span>
                  </div>
                  <h1 className="font-display font-bold text-2xl md:text-3xl text-primary mb-2 leading-snug">
                    Advanced Clinical Anatomy: A Comprehensive Guide
                  </h1>
                  <p className="text-on-surface-variant text-sm font-medium mb-4">Dr. Richard S. Thompson, Prof. Maria Elena</p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-on-surface-variant/80 text-xs font-semibold">
                    <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-primary" /> 2023</span>
                    <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-primary" /> 842 Pages</span>
                    <span className="flex items-center gap-1.5"><Globe className="w-4 h-4 text-primary" /> English</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-outline-variant/20">
                  <p className="text-on-surface-variant text-xs leading-relaxed text-justify">
                    This seminal work provides an in-depth exploration of human anatomy through a clinical lens, specifically tailored for the advanced medical curriculum at Universitas Airlangga.
                  </p>
                </div>
              </div>
            </div>

            {/* Widget Ketersediaan Real-Time */}
            <div className="bg-surface-container-lowest rounded-3xl shadow-sm border border-outline-variant/20 overflow-hidden">
              <div className="p-8 border-b border-outline-variant/10 flex items-center justify-between bg-surface-container-low/50">
                <div>
                  <h3 className="font-display font-bold text-lg text-primary flex items-center gap-2.5">
                    <Package className="w-5 h-5 text-primary" />
                    <span>Real-time Availability Status</span>
                  </h3>
                  <p className="text-on-surface-variant text-xs mt-1">Live inventory tracking for Central Library collections.</p>
                </div>
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
              </div>

              <div className="p-8 space-y-5">
                
                {/* Kampus A (Tersedia) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-background rounded-2xl border border-outline-variant/40 gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                      <Landmark className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-on-surface">Campus A — Central Library</h4>
                      <p className="text-xs text-on-surface-variant/80 mt-0.5">Shelf G-24 (Medical Section)</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-outline-variant/20">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 mb-1 w-fit">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="text-xs font-extrabold uppercase tracking-wider">In Stock</span>
                    </div>
                    <span className="text-[11px] font-semibold text-on-surface-variant">3 Copies Available</span>
                  </div>
                </div>

                {/* Kampus C (Habis Dipinjam) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-background rounded-2xl border border-outline-variant/40 gap-4 opacity-75">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                      <Hospital className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-on-surface">Campus C — Health Sciences</h4>
                      <p className="text-xs text-on-surface-variant/80 mt-0.5">Reference Only — Room 402</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-outline-variant/20">
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-error-container text-on-error-container rounded-full border border-red-200 mb-1 w-fit">
                      <Clock className="w-3 h-3 text-red-600" />
                      <span className="text-xs font-extrabold uppercase tracking-wider">On Loan</span>
                    </div>
                    <span className="text-[11px] font-bold text-red-600">Due: Oct 24, 2026</span>
                  </div>
                </div>

                {/* Tombol Aksi Widget */}
                <div className="pt-4 flex gap-3">
                  <button 
                    onClick={handleReservation}
                    disabled={isReserving || reserveSuccess}
                    className={`flex-1 py-4 rounded-2xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 text-xs cursor-pointer shadow-lg ${
                      reserveSuccess 
                        ? 'bg-emerald-600 text-white shadow-emerald-600/20' 
                        : 'bg-primary text-white shadow-primary/20 hover:bg-primary-container active:scale-[0.98]'
                    }`}
                  >
                    {isReserving && <Loader2 className="w-4 h-4 animate-spin" />}
                    {!isReserving && !reserveSuccess && <BookmarkPlus className="w-4 h-4 ml-0.5" />}
                    {reserveSuccess && <CheckCircle2 className="w-4 h-4" />}
                    
                    <span>
                      {isReserving ? 'Locking Copy...' : reserveSuccess ? 'Copy Reserved for You!' : 'Lock & Request Copy (Campus A)'}
                    </span>
                  </button>
                  
                  <button className="w-13 border border-outline-variant text-primary rounded-2xl hover:bg-primary/5 transition-all flex items-center justify-center cursor-pointer shrink-0">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </div>

          </div>

          {/* SISI KANAN (Kolom 5/12): Info Administratif & Rekomendasi */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Card Katalog Administratif */}
            <div className="bg-surface-container-low rounded-3xl p-8 border border-outline-variant/30 shadow-sm">
              <h3 className="font-display font-bold text-lg text-primary mb-6">Library Cataloging</h3>
              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between pb-3 border-b border-outline-variant/30 font-medium">
                  <span className="text-outline">ISBN-13</span>
                  <span className="font-mono text-on-surface font-bold">978-0123456789</span>
                </div>
                <div className="flex justify-between pb-3 border-b border-outline-variant/30 font-medium">
                  <span className="text-outline">Call Number</span>
                  <span className="font-mono text-on-surface font-bold">QS 4.T45 2023</span>
                </div>
                <div className="flex justify-between pb-3 border-b border-outline-variant/30 font-medium">
                  <span className="text-outline">Classification</span>
                  <span className="text-on-surface font-bold">Human Anatomy</span>
                </div>
                <div className="flex justify-between pb-1 font-medium">
                  <span className="text-outline">Publisher</span>
                  <span className="text-on-surface font-bold">Airlangga University Press</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-white rounded-2xl border border-outline-variant/40 shadow-sm">
                <div className="flex items-center gap-2 mb-1.5 text-xs font-bold text-primary">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Librarian Policy Note</span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed italic">
                  "Priority reading list for Anatomy II. Students are advised to lock reservations at least 4 days prior to clinical exams."
                </p>
              </div>
            </div>

            {/* Portal E-Book */}
            <div className="bg-primary-container rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
              <div className="relative z-10 space-y-4">
                <div>
                  <span className="text-[10px] font-extrabold tracking-widest uppercase bg-white/20 px-3 py-1 rounded-full">UNAIR Repository</span>
                  <h3 className="font-display font-bold text-xl mt-3">Digital E-Book Access</h3>
                </div>
                <p className="text-white/80 text-xs leading-relaxed">
                  Active students can instantly access the full-text DRM-protected PDF and 3D interactive skull projection.
                </p>
                <button className="w-full bg-white text-primary py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-primary-fixed transition-all shadow-lg cursor-pointer">
                  <Laptop className="w-4 h-4" />
                  <span>Launch Interactive Portal</span>
                </button>
              </div>
              <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
                <BookOpen className="w-64 h-64 text-white" />
              </div>
            </div>

            {/* Bento Koleksi Sejenis */}
            <div className="grid grid-cols-2 gap-4">
              <div className="group cursor-pointer bg-surface-container-lowest p-3 rounded-2xl border border-outline-variant/30 hover:shadow-md transition-all">
                <div className="aspect-[4/3] bg-surface-container-high rounded-xl mb-3 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=400&auto=format&fit=crop" alt="Book" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <p className="text-xs font-display font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-1">Genetics Fundamentals</p>
                <span className="text-[10px] text-outline block mt-0.5">Campus A • 2 Available</span>
              </div>

              <div className="group cursor-pointer bg-surface-container-lowest p-3 rounded-2xl border border-outline-variant/30 hover:shadow-md transition-all">
                <div className="aspect-[4/3] bg-surface-container-high rounded-xl mb-3 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop" alt="Book" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <p className="text-xs font-display font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-1">Neurobiology Today</p>
                <span className="text-[10px] text-outline block mt-0.5">Campus C • 1 Available</span>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* Footer Standar */}
      <footer className="bg-surface-container border-t border-outline-variant/40 w-full py-12 mt-16 text-xs text-on-surface-variant">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <div className="font-display font-bold text-base text-primary">UNAIR Library</div>
            <p className="max-w-md leading-relaxed">Providing world-class investigative resources for academic excellence across all three regional campus centers.</p>
            <div className="flex gap-2 pt-1">
              <a href="#" className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary shadow-sm border border-outline-variant/30"><Globe className="w-4 h-4" /></a>
              <a href="#" className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary shadow-sm border border-outline-variant/30"><AtSign className="w-4 h-4" /></a>
            </div>
          </div>
          <div className="flex flex-col md:items-end justify-between font-medium">
            <div className="flex gap-6">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-primary transition-colors">Help Center</a>
            </div>
            <div className="mt-6 md:mt-0 text-outline">
              © 2024 Airlangga University Press & Library. V.8.2.5
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
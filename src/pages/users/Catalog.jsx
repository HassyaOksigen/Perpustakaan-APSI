import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient"; // Sesuaikan ../ jika path mu berbeda
import {
  Search, Bell, Bookmark, Atom, Cpu, Globe, BookOpen, Landmark,
  Activity, LayoutGrid, List, Star, StarHalf, Heart, ChevronLeft,
  ChevronRight, BookOpenCheck, Loader2
} from "lucide-react";

// Menambahkan tab "All" di urutan paling atas
const CATEGORIES = [
  { name: "All", icon: BookOpenCheck },
  { name: "Science", icon: Atom },
  { name: "Technology", icon: Cpu },
  { name: "Social Sciences", icon: Globe }, // Disesuaikan dengan ejaan DB Admin
  { name: "Literature & Rhetoric", icon: BookOpen },
  { name: "Medical & Health", icon: Activity },
];

export default function Catalog() {
  const navigate = useNavigate();

  // --- States untuk Supabase & Interaksi ---
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeTab, setActiveTab] = useState("All"); // Default langsung tayang semua
  const [viewMode, setViewMode] = useState("grid");

  const handleUserLogout = () => {
    if (confirm("Apakah Anda yakin ingin keluar dari akun hassya@gmail.com?")) {
      localStorage.clear();
      navigate("/login");
    }
  };

  // ================= 1. FETCH DATA DARI SUPABASE =================
  useEffect(() => {
    async function fetchCatalog() {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("buku")
          .select("*")
          .order("tahun_terbit", { ascending: false }); // Urutkan dari buku paling baru

        if (error) throw error;
        if (data) setBooks(data);
      } catch (err) {
        console.error("Gagal memuat katalog:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCatalog();
  }, []);

  // ================= 2. LOGIC FILTERING (Search + Kategori) =================
  const filteredBooks = books.filter((item) => {
    // A. Filter teks pencarian (Judul atau Pengarang)
    const matchesSearch =
      item.judul_buku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.pengarang?.toLowerCase().includes(searchQuery.toLowerCase());

    // B. Filter Kategori Tab
    let matchesCategory = true;
    if (activeTab !== "All") {
      matchesCategory = item.kategori?.toLowerCase() === activeTab.toLowerCase();
    }

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-background min-h-screen font-body text-on-surface antialiased selection:bg-primary selection:text-white">
      
      {/* Top Navbar */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-[1280px] rounded-full shadow-md border border-outline-variant/30 bg-surface/80 backdrop-blur-xl flex justify-between items-center px-8 h-16 z-50 transition-all duration-300">
        <div className="flex items-center gap-2">
          <BookOpenCheck className="w-6 h-6 text-primary" />
          <span className="font-display font-bold text-lg text-primary tracking-tight">
            UNAIR Library
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/catalog" className="font-semibold text-sm text-primary border-b-2 border-primary pb-1">Catalog</Link>
          <Link to="/collections" className="font-semibold text-sm text-on-surface-variant hover:text-primary transition-colors">Collections</Link>
          <Link to="/my-loans" className="font-semibold text-sm text-on-surface-variant hover:text-primary transition-colors">My Loans</Link>
          <a href="#" className="font-semibold text-sm text-on-surface-variant hover:text-primary transition-colors">Journals</a>
        </div>

        <div className="flex items-center gap-4">
          
          {/* Reaktif Search Input terhubung ke state searchQuery */}
          <div className={`relative hidden lg:block transition-all duration-300 ${isSearchFocused ? "w-80" : "w-64"}`}>
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-outline/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              placeholder="Cari judul atau penulis..."
              className={`w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant/50 rounded-full text-xs font-medium focus:outline-none focus:border-primary transition-all ${
                isSearchFocused ? "shadow-lg bg-white border-primary text-on-surface" : "text-on-surface"
              }`}
            />
          </div>

          <button className="text-on-surface-variant hover:text-primary hover:bg-primary-fixed/20 p-2 rounded-full transition-all cursor-pointer"><Bell className="w-5 h-5" /></button>
          <button className="text-on-surface-variant hover:text-primary hover:bg-primary-fixed/20 p-2 rounded-full transition-all cursor-pointer"><Bookmark className="w-5 h-5" /></button>

          <div onClick={handleUserLogout} title="Klik untuk Logout" className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary/20 hover:border-red-500 transition-colors cursor-pointer shrink-0">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>
      </nav>

      <main className="pt-28 pb-20 max-w-[1280px] mx-auto px-6 md:px-16 flex gap-8">
        
        {/* Sidebar Kategori */}
        <aside className="hidden lg:flex flex-col w-64 shrink-0 gap-8 h-[calc(100vh-140px)] sticky top-28 overflow-y-auto pr-1">
          <div>
            <h3 className="font-display font-bold text-base text-primary mb-4">Categories</h3>
            <nav className="flex flex-col gap-1.5">
              {CATEGORIES.map((cat) => {
                const IconComponent = cat.icon;
                const isSelected = activeTab === cat.name;
                return (
                  <button
                    key={cat.name}
                    onClick={() => setActiveTab(cat.name)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-xs transition-all cursor-pointer text-left ${
                      isSelected
                        ? "bg-primary-container text-white shadow-md shadow-primary-container/20 font-bold"
                        : "text-on-surface-variant hover:bg-surface-variant/50 hover:text-on-surface"
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 ${isSelected ? "text-white" : "text-primary"}`} />
                    <span className="line-clamp-1">{cat.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="pt-6 border-t border-outline-variant/30">
            <h3 className="text-xs font-bold text-outline uppercase tracking-widest mb-4">Format</h3>
            <div className="flex flex-col gap-3.5 text-xs font-medium text-on-surface-variant">
              <label className="flex items-center gap-3 cursor-pointer group"><input defaultChecked type="checkbox" className="w-4 h-4 rounded border-outline-variant text-primary" /><span className="group-hover:text-primary">Physical Book</span></label>
              <label className="flex items-center gap-3 cursor-pointer group"><input type="checkbox" className="w-4 h-4 rounded border-outline-variant text-primary" /><span className="group-hover:text-primary">E-Book</span></label>
            </div>
          </div>

          {/* Promo Box */}
          <div className="mt-auto p-5 rounded-2xl bg-secondary-fixed/50 border border-secondary-fixed text-on-surface shadow-sm">
            <BookOpen className="w-6 h-6 text-primary mb-2" />
            <p className="text-xs font-display font-bold text-primary">Koleksi Digital</p>
            <p className="text-xs mt-1 leading-relaxed text-on-surface-variant/80">Akses ribuan jurnal internasional terindeks Scopus gratis untuk sivitas akademika.</p>
          </div>
        </aside>

        {/* Main Canvas Area */}
        <section className="flex-1">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display font-bold text-3xl text-primary tracking-tight">Explore Catalog</h1>
              <p className="text-sm text-on-surface-variant mt-1">
                Menampilkan <span className="font-bold text-primary">{filteredBooks.length} buku</span> untuk filter{" "}
                <span className="font-semibold text-primary underline decoration-primary/30 underline-offset-4">{activeTab}</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex bg-surface-container-low border border-outline-variant/40 rounded-xl p-1 shadow-inner">
                <button onClick={() => setViewMode("grid")} className={`p-2 rounded-lg cursor-pointer ${viewMode === "grid" ? "bg-white text-primary shadow-sm font-bold" : "text-on-surface-variant"}`}><LayoutGrid className="w-4 h-4" /></button>
                <button onClick={() => setViewMode("list")} className={`p-2 rounded-lg cursor-pointer ${viewMode === "list" ? "bg-white text-primary shadow-sm font-bold" : "text-on-surface-variant"}`}><List className="w-4 h-4" /></button>
              </div>
            </div>
          </div>

          {/* KONTEN UTAMA: Loading / Empty / Daftar Buku */}
          {isLoading ? (
            <div className="w-full py-24 flex flex-col items-center justify-center gap-3 text-primary">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="font-bold text-xs animate-pulse uppercase tracking-widest">Menghubungkan ke Perpustakaan UNAIR...</p>
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="w-full py-20 text-center bg-surface-container-lowest rounded-3xl border border-dashed border-outline-variant/60 p-8">
              <BookOpen className="w-12 h-12 text-outline mx-auto mb-3 opacity-40" />
              <h3 className="font-display font-bold text-lg text-on-surface">Buku tidak ditemukan</h3>
              <p className="text-xs text-on-surface-variant mt-1">Coba cari dengan kata kunci lain atau pilih kategori "All".</p>
            </div>
          ) : (
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
              {filteredBooks.map((book) => {
                // Penentuan status dinamis berdasarkan stok DB
                const isAvailable = book.stok > 0;
                const statusBadge = isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
                const statusText = isAvailable ? `Tersedia (${book.stok})` : "Dipinjam Habis";
                
                // Fallback gambar jika di DB kosong
                const coverImg = book.image_url || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop";

                return (
                  <div key={book.id_buku} className="group bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-outline-variant/30 hover:border-primary/30 transition-all duration-300 flex flex-col">
                    <div className="h-64 relative overflow-hidden bg-surface-container-low">
                      <div className="absolute top-3.5 left-3.5 z-10">
                        <span className={`${statusBadge} text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm`}>
                          {statusText}
                        </span>
                      </div>
                      <img src={coverImg} alt={book.judul_buku} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
                    </div>

                    <div className="p-5 flex flex-col flex-1 justify-between">
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-[11px] font-bold tracking-wider uppercase text-primary/60">{book.kategori || "Umum"}</span>
                          <div className="flex items-center text-amber-500 gap-1">
                            <Star className="w-3.5 h-3.5 fill-amber-500" />
                            <span className="text-xs font-extrabold text-on-surface">4.5</span>
                          </div>
                        </div>

                        <h4 className="font-display font-bold text-base text-on-surface group-hover:text-primary transition-colors leading-snug line-clamp-1">
                          {book.judul_buku}
                        </h4>
                        <p className="text-xs text-on-surface-variant/70 italic mt-0.5">by {book.pengarang}</p>
                      </div>

                      <div className="mt-6 flex gap-2.5">
                        {/* Tombol detail mengirim ID asli ke halaman berikutnya */}
                        <Link
                          to={`/book-detail/${book.id_buku}`}
                          className="flex-1 py-2.5 bg-primary text-white rounded-xl font-semibold text-xs hover:bg-primary-container shadow-md shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center"
                        >
                          Lihat Detail
                        </Link>
                        <button className="w-10 h-10 flex items-center justify-center border border-outline-variant/60 rounded-xl text-on-surface-variant hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all cursor-pointer shrink-0">
                          <Heart className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-low py-12 border-t border-outline-variant/40 mt-20 text-xs text-on-surface-variant">
        <div className="max-w-[1280px] mx-auto px-6 md:px-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-2">
            <span className="font-display font-bold text-base text-primary block mb-3">UNAIR Library</span>
            <p className="max-w-md leading-relaxed">Empowering the academic community through accessibility to vast knowledge resources and cutting-edge research facilities.</p>
          </div>
          <div>
            <h4 className="font-bold text-on-surface uppercase tracking-widest mb-3.5">Library Links</h4>
            <ul className="space-y-2 font-medium">
              <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-on-surface uppercase tracking-widest mb-3.5">Support</h4>
            <ul className="space-y-2 font-medium">
              <li><a href="#" className="hover:text-primary">Help Center</a></li>
              <li><a href="#" className="hover:text-primary">Digital Repository</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-[1280px] mx-auto px-6 md:px-16 border-t border-outline-variant/30 mt-10 pt-6 text-center md:text-left font-medium">
          © 2024 Universitas Airlangga Library. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
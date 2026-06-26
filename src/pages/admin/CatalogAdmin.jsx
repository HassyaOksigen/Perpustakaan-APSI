import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from "../../lib/supabaseClient";
import { 
  LayoutDashboard, BookOpen, Users, Handshake, 
  Banknote, BarChart3, Settings, HelpCircle, LogOut, 
  Plus, ChevronRight, Barcode, Minus, Upload, 
  Trash2, Info, Sparkles, Printer, Loader2, CheckCircle2, BookCheck
} from 'lucide-react';

export default function CatalogAdmin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    isbn: '',
    author: '',
    publisher: '',
    year: '',
    category: ''
  });

  const [stock, setStock] = useState(1);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleAdminLogout = () => {
    if (confirm('Apakah Anda yakin ingin keluar dari portal Admin (admin@gmail.com)?')) {
      localStorage.clear();
      navigate('/login');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      let imageUrl = null;

      // 1. Integrasi Upload Gambar ke Supabase Storage
      if (coverFile) {
        const fileExt = coverFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('Foto Buku')
          .upload(fileName, coverFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('Foto Buku')
          .getPublicUrl(fileName);
        imageUrl = publicUrlData.publicUrl;
      }

      // 2. Simpan Data & ambil ID buku yang baru dibuat
      const { data, error: insertError } = await supabase.from('buku').insert([
        {
          isbn: formData.isbn,
          judul_buku: formData.title,
          pengarang: formData.author,
          penerbit: formData.publisher,
          tahun_terbit: `${formData.year}-01-01`,
          kategori: formData.category,
          stok: stock,
          status_buku: true,
          image_url: imageUrl
        }
      ]).select("id_buku"); // <--- PENTING: Menambahkan .select("id_buku")

      if (insertError) throw insertError;

      setIsSaving(false);
      setIsSaved(true);

      // 3. Setelah sukses, arahkan ke URL edit dengan ID buku yang baru
      setTimeout(() => {
        alert(`📚 Berhasil! Buku "${formData.title || 'Judul Baru'}" telah resmi masuk ke dalam katalog.`);
        
        if (data && data[0]) {
          navigate(`/edit-book/${data[0].id_buku}`);
        } else {
          // Fallback jika terjadi masalah saat mengambil ID
          setFormData({ title: '', isbn: '', author: '', publisher: '', year: '', category: '' });
          setStock(1);
          setCoverPreview(null);
          setIsSaved(false);
          navigate('/catalog-admin');
        }
      }, 1500);

    } catch (error) {
      console.error("Error:", error);
      alert("Gagal menyimpan: " + error.message);
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-body text-on-surface antialiased overflow-x-hidden selection:bg-secondary-container">
      
      {/* SIDEBAR KIRI (Tetap melayang fixed) */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-surface-container-low shadow-sm flex flex-col py-6 space-y-2 border-r border-outline-variant/30 z-40">
        <div className="px-6 mb-8">
          <h1 className="font-display font-bold text-2xl text-primary tracking-tight">UNAIR Admin</h1>
          <p className="text-xs font-semibold text-on-surface-variant/70 tracking-wider uppercase mt-0.5">Staff Portal</p>
        </div>

        <nav className="flex-1 px-3 space-y-1 text-xs font-semibold overflow-y-auto">
          <a href="#" className="flex items-center gap-3 px-4 py-3.5 text-on-surface-variant hover:bg-surface-container-highest transition-colors rounded-xl">
            <LayoutDashboard className="w-4 h-4 text-primary" />
            <span>Dashboard</span>
          </a>
          
          <Link to="/catalog-admin" className="flex items-center gap-3 px-4 py-3.5 bg-secondary-container text-on-secondary-container font-bold rounded-xl shadow-sm">
            <BookOpen className="w-4 h-4 text-primary font-extrabold" />
            <span>Catalog Admin</span>
          </Link>

          <Link to="/member-directory" className="flex items-center gap-3 px-4 py-3.5 text-on-surface-variant hover:bg-surface-container-highest transition-colors rounded-xl">
            <Users className="w-4 h-4 text-primary" />
            <span>Member Management</span>
          </Link>
          <Link to="/admin" className="flex items-center gap-3 px-4 py-3.5 text-on-surface-variant hover:bg-surface-container-highest transition-colors rounded-xl">
            <Handshake className="w-4 h-4 text-primary" />
            <span>Loan Processing</span>
          </Link>
          <Link to="/fine-management" className="flex items-center gap-3 px-4 py-3.5 text-on-surface-variant hover:bg-surface-container-highest transition-colors rounded-xl">
            <Banknote className="w-4 h-4 text-primary" />
            <span>Returns & Fines</span>
          </Link>
          <a href="#" className="flex items-center gap-3 px-4 py-3.5 text-on-surface-variant hover:bg-surface-container-highest transition-colors rounded-xl">
            <BarChart3 className="w-4 h-4 text-primary" />
            <span>Analytics</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3.5 text-on-surface-variant hover:bg-surface-container-highest transition-colors rounded-xl">
            <Settings className="w-4 h-4 text-primary" />
            <span>System Settings</span>
          </a>
        </nav>

        <div className="px-6 py-4 border-t border-outline-variant/20">
          <button className="w-full bg-primary text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary-container active:scale-[0.98] transition-all cursor-pointer">
            <Plus className="w-4 h-4" />
            <span>New Entry</span>
          </button>
        </div>

        <div className="px-3 pt-2 mt-auto border-t border-outline-variant/20 text-xs font-semibold space-y-1">
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-primary transition-colors rounded-xl">
            <HelpCircle className="w-4 h-4 text-primary" />
            <span>Help Center</span>
          </a>
          <button onClick={handleAdminLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors rounded-xl cursor-pointer text-left font-bold">
            <LogOut className="w-4 h-4" />
            <span>Logout Portal</span>
          </button>
        </div>
      </aside>

      {/* WRAPPER KERJA KANAN */}
      <div className="ml-64 flex flex-col min-h-screen">
        
        <form onSubmit={handleSubmit} className="flex-1 p-8 md:p-12 max-w-[1400px] w-full mx-auto space-y-8">
          
          <header className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <nav className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant/70 mb-2">
                <span>Catalog Admin</span>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-primary font-bold">Add New Book</span>
              </nav>
              <h2 className="font-display font-bold text-3xl text-primary tracking-tight">Catalog Entry</h2>
              <p className="text-xs md:text-sm text-on-surface-variant mt-1 font-medium">Register a new physical or digital asset into the library collection.</p>
            </div>

            <div className="flex items-center gap-3 text-xs font-bold shrink-0">
              <button 
                type="button"
                onClick={() => navigate('/admin')}
                className="px-6 py-3 rounded-full border border-outline-variant/80 text-on-surface-variant hover:bg-surface-container transition-all cursor-pointer bg-white"
              >
                Cancel
              </button>
              
              <button 
                type="submit"
                disabled={isSaving || isSaved}
                className={`px-8 py-3 rounded-full font-bold shadow-lg transition-all flex items-center gap-2 cursor-pointer ${
                  isSaved ? 'bg-emerald-600 text-white shadow-emerald-600/20' :
                  isSaving ? 'bg-primary/80 text-white cursor-wait shadow-none' :
                  'bg-primary text-white hover:bg-primary-container shadow-primary/20 active:scale-[0.98]'
                }`}
              >
                {isSaving && <><Loader2 className="w-4 h-4 animate-spin" /><span>Saving Record...</span></>}
                {!isSaving && !isSaved && <span>Save Record</span>}
                {isSaved && <><CheckCircle2 className="w-4 h-4" /><span>Success</span></>}
              </button>
            </div>
          </header>

          {/* Bento-like Grid Layout */}
          <section className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 text-xs font-semibold text-on-surface-variant">
            
            {/* KOLOM KIRI (8/12): Core Data & Klasifikasi */}
            <div className="md:col-span-8 space-y-6">
              
              {/* Box General Info */}
              <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm border border-outline-variant/30 space-y-6">
                <div className="flex items-center gap-2.5 text-primary border-b border-outline-variant/20 pb-4 mb-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <h3 className="font-display font-bold text-xl text-primary">General Information</h3>
                </div>

                <div className="space-y-2">
                  <label htmlFor="title" className="block text-on-surface ml-1">Book Title *</label>
                  <input 
                    name="title" value={formData.title} onChange={handleChange} required
                    id="title" type="text" placeholder="Enter the full literary title" 
                    className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-xl px-4 py-3.5 focus:border-primary outline-none transition-all font-medium text-on-surface"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label htmlFor="isbn" className="block text-on-surface ml-1">ISBN-13 *</label>
                    <div className="relative">
                      <Barcode className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-outline/60" />
                      <input 
                        name="isbn" value={formData.isbn} onChange={handleChange} required
                        id="isbn" type="text" placeholder="978-3-16-148410-0" 
                        className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-xl pl-11 pr-4 py-3.5 focus:border-primary outline-none transition-all font-medium font-mono text-on-surface"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="author" className="block text-on-surface ml-1">Primary Author *</label>
                    <input 
                      name="author" value={formData.author} onChange={handleChange} required
                      id="author" type="text" placeholder="Author's full name" 
                      className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-xl px-4 py-3.5 focus:border-primary outline-none transition-all font-medium text-on-surface"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="sm:col-span-2 space-y-2">
                    <label htmlFor="publisher" className="block text-on-surface ml-1">Publisher *</label>
                    <input 
                      name="publisher" value={formData.publisher} onChange={handleChange} required
                      id="publisher" type="text" placeholder="Publishing house name" 
                      className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-xl px-4 py-3.5 focus:border-primary outline-none transition-all font-medium text-on-surface"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="year" className="block text-on-surface ml-1">Year *</label>
                    <input 
                      name="year" value={formData.year} onChange={handleChange} required
                      id="year" type="number" placeholder="YYYY" 
                      className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-xl px-4 py-3.5 focus:border-primary outline-none transition-all font-medium font-mono text-on-surface"
                    />
                  </div>
                </div>
              </div>

              {/* Box Klasifikasi & Inventori */}
              <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm border border-outline-variant/30 space-y-6">
                <div className="flex items-center gap-2.5 text-primary border-b border-outline-variant/20 pb-4 mb-2">
                  <BookCheck className="w-5 h-5 text-primary" />
                  <h3 className="font-display font-bold text-xl text-primary">Classification & Inventory</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
                  <div className="space-y-2">
                    <label htmlFor="category" className="block text-on-surface ml-1">Category / Department *</label>
                    <select 
                      name="category" value={formData.category} onChange={handleChange} required
                      id="category" className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-xl px-4 py-3.5 focus:border-primary outline-none transition-all font-medium text-on-surface cursor-pointer"
                    >
                      <option value="" disabled>Select a category</option>
                      <option value="Social Sciences">Social Sciences</option>
                      <option value="Technology & Applied Sciences">Technology & Applied Sciences</option>
                      <option value="Literature & Rhetoric">Literature & Rhetoric</option>
                      <option value="Medical & Health">Medical & Health</option>
                      <option value="History & Geography">History & Geography</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-on-surface ml-1">Initial Stock Count</label>
                    <div className="flex items-center gap-2">
                      <button 
                        type="button" 
                        onClick={() => setStock(prev => Math.max(0, prev - 1))}
                        className="w-12 h-12 flex items-center justify-center bg-surface-container hover:bg-surface-container-highest rounded-xl text-on-surface font-bold transition-colors cursor-pointer shrink-0"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <input 
                        type="number" min="0" value={stock} 
                        onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                        className="flex-1 text-center bg-surface-container-lowest border border-outline-variant/60 rounded-xl py-3.5 font-display font-bold text-sm text-on-surface focus:border-primary outline-none font-mono"
                      />
                      <button 
                        type="button" 
                        onClick={() => setStock(prev => prev + 1)}
                        className="w-12 h-12 flex items-center justify-center bg-surface-container hover:bg-surface-container-highest rounded-xl text-on-surface font-bold transition-colors cursor-pointer shrink-0"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* KOLOM KANAN (4/12): Upload Sampul & Quick Tools */}
            <div className="md:col-span-4 space-y-6 flex flex-col">
              
              {/* Box Upload Gambar Cover */}
              <div className="bg-surface-container-lowest rounded-3xl p-7 shadow-sm border border-outline-variant/30 flex-1 flex flex-col justify-between space-y-4">
                <span className="block text-on-surface font-bold">Book Cover Image</span>
                
                <label 
                  htmlFor="cover_upload"
                  className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-outline-variant/60 rounded-2xl p-6 bg-surface-container-low/40 hover:bg-surface-container-low hover:border-primary transition-all cursor-pointer relative overflow-hidden min-h-[260px] group"
                >
                  <input 
                    id="cover_upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" 
                  />

                  {!coverPreview ? (
                    <div className="flex flex-col items-center text-center space-y-2">
                      <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                        <Upload className="w-6 h-6" />
                      </div>
                      <p className="font-display font-bold text-sm text-primary">Upload Cover</p>
                      <p className="text-outline/80 text-[11px] font-medium leading-relaxed px-2">Click to browse. Supports JPG, PNG (Max 5MB).</p>
                    </div>
                  ) : (
                    <div className="absolute inset-0 w-full h-full group/img">
                      <img src={coverPreview} alt="Cover Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); setCoverPreview(null); setCoverFile(null); }}
                          className="bg-white text-red-600 font-bold text-xs px-5 py-2.5 rounded-full flex items-center gap-1.5 shadow-lg hover:bg-red-50 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  )}
                </label>

                <div className="p-3.5 bg-secondary-fixed/50 rounded-2xl flex items-start gap-3 border border-secondary-container font-medium text-on-secondary-fixed-variant leading-relaxed text-[11px]">
                  <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <p>Recommended aspect ratio 2:3. High res images improve catalog visibility.</p>
                </div>
              </div>

              {/* Box Quick Tools Pintasan */}
              <div className="bg-surface-container-lowest rounded-3xl p-7 shadow-sm border border-outline-variant/30 space-y-3 font-bold text-xs">
                <span className="block text-on-surface mb-2">Quick Tools</span>
                <button 
                  type="button" onClick={() => alert("Mengambil metadata otomatis dari server ISBN...")}
                  className="w-full flex items-center gap-3 p-3.5 bg-surface-container-low/60 hover:bg-primary hover:text-white rounded-2xl transition-all cursor-pointer text-on-surface group"
                >
                  <Sparkles className="w-4 h-4 text-primary group-hover:text-blue-200" />
                  <span>Fetch Metadata by ISBN</span>
                </button>
                <button 
                  type="button" onClick={() => alert("Mencetak stempel kode batang (Barcode Tag)...")}
                  className="w-full flex items-center gap-3 p-3.5 bg-surface-container-low/60 hover:bg-primary hover:text-white rounded-2xl transition-all cursor-pointer text-on-surface group"
                >
                  <Printer className="w-4 h-4 text-primary group-hover:text-blue-200" />
                  <span>Print Barcode Tag</span>
                </button>
              </div>

            </div>

          </section>

        </form>

        <footer className="w-full mt-auto bg-surface-container py-12 text-xs text-on-surface-variant border-t border-outline-variant/30">
          <div className="max-w-[1400px] mx-auto px-8 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-4 font-medium">
            <div className="flex items-center gap-2 font-display font-bold text-sm text-primary">
              <BookCheck className="w-4 h-4" />
              <span>UNAIR Library Staff Portal</span>
            </div>
            <div className="flex gap-8">
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Contact Support</a>
            </div>
            <div>© 2024 Universitas Airlangga Library. All rights reserved.</div>
          </div>
        </footer>

      </div>
    </div>
  );
}
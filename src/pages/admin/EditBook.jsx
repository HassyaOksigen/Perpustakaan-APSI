import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient"; 

export default function EditBook({ setPage }) { // <-- bookId dihapus dari prop
  // --- Loading & Saving States ---
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // --- State penyimpan ID Buku termuda yang didapat dari DB ---
  const [currentId, setCurrentId] = useState(null);

  // --- Form DB States ---
  const [title, setTitle] = useState("");
  const [isbn, setIsbn] = useState("");
  const [author, setAuthor] = useState("");
  const [publisher, setPublisher] = useState("");
  const [year, setYear] = useState(""); 
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Fluid Mechanics");
  const [callNumber, setCallNumber] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [stock, setStock] = useState(0);
  const [allowReserve, setAllowReserve] = useState(true);
  const [branch, setBranch] = useState("Main Library - Kampus C");
  const [coverUrl, setCoverUrl] = useState("https://lh3.googleusercontent.com/aida-public/AB6AXuAtAg9yimn39c_Sb7P_mFpLtAC8v2dx8OIUehmnN0mwLqp_pWspHZaFlS3HJFzGsLOFNxzfkWmYd9qDJZTiq7ge_NzO1tTxWvaCz1V_m3W8IRIQP2fdAZZpNkCYzePEPB2Y9nd71RVrfUa8ZSHfKW4Yu0ZuWY0avyR8qF0v1Ctd0TnT_pRRZmhxKN05ld3E3A3pDibySkD9Uvr6D6yajb43bBEd1in1kwlk2pvpSZl03ypYgsefbAcMUZ8fntxjcOUprs8P7fQqrzE");

  // --- Interactive States ---
  const [newTagInput, setNewTagInput] = useState("");
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // ================= 1. CARI BUKU TERMUDA DARI SUPABASE =================
  useEffect(() => {
    async function fetchYoungestBook() {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("buku")
          .select("*")
          .not("tahun_terbit", "is", null) // Amankan jika ada buku yang tahunnya kosong
          .order("tahun_terbit", { ascending: false }) // Urutkan dari tahun paling besar (paling muda)
          .limit(1)
          .maybeSingle(); // Pakai maybeSingle agar tidak crash jika table kosong

        if (error) throw error;

        if (data) {
          // KUNCI ID-nya ke state internal
          setCurrentId(data.id_buku);

          setTitle(data.judul_buku || "");
          setIsbn(data.isbn || "");
          setAuthor(data.pengarang || "");
          setPublisher(data.penerbit || "");
          
          if (data.tahun_terbit) {
            setYear(data.tahun_terbit.split("-")[0]);
          }

          setDescription(data.deskripsi || "");
          setCategory(data.kategori || "Fluid Mechanics");
          setCallNumber(data.lokasi_rak || "");
          setKeywords(data.keywords || []);
          setStock(data.stok || 0);
          setAllowReserve(data.status_buku ?? true);
          setBranch(data.cabang || "Main Library - Kampus C");
          if (data.image_url) setCoverUrl(data.image_url);
        } else {
          alert("Database buku Anda masih kosong!");
        }
      } catch (err) {
        console.error("Gagal menarik data buku termuda:", err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchYoungestBook();
  }, []); // <-- Dependency array kosong, artinya hanya memicu fetch 1x saat halaman dibuka

  // ================= 2. UPDATE DATA KE SUPABASE =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentId) {
      alert("Error: Tidak ada data buku yang terdeteksi untuk diedit.");
      return;
    }

    setIsSaving(true);
    const formattedDate = year ? `${year}-01-01` : null;

    try {
      const { error } = await supabase
        .from("buku")
        .update({
          judul_buku: title,
          isbn: isbn,
          pengarang: author,
          penerbit: publisher,
          tahun_terbit: formattedDate,
          deskripsi: description,
          kategori: category,
          lokasi_rak: callNumber,
          keywords: keywords,
          stok: parseInt(stock) || 0,
          status_buku: allowReserve,
          cabang: branch,
          image_url: coverUrl
        })
        .eq("id_buku", currentId); // <-- Gunakan currentId yang didapat dari useEffect tadi

      if (error) throw error;

      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);

    } catch (err) {
      console.error("Gagal update:", err);
      alert("Gagal menyimpan perubahan: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Handlers interaksi kecil
  const handleDecrementStock = () => setStock((prev) => (prev > 0 ? prev - 1 : 0));
  const handleIncrementStock = () => setStock((prev) => parseInt(prev) + 1);
  const handleRemoveTag = (tagToRemove) => setKeywords(keywords.filter((t) => t !== tagToRemove));

  const handleAddTagKeydown = (e) => {
    if (e.key === "Enter" && newTagInput.trim() !== "") {
      e.preventDefault();
      if (!keywords.includes(newTagInput.trim())) {
        setKeywords([...keywords, newTagInput.trim()]);
      }
      setNewTagInput("");
      setIsAddingTag(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fcf9f8] flex items-center justify-center font-body">
        <div className="flex flex-col items-center gap-3 text-[#002f59]">
          <span className="material-symbols-outlined animate-spin text-4xl">progress_activity</span>
          <p className="text-sm font-semibold">Mencari buku dengan tahun terbit paling baru...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fcf9f8] text-[#1c1b1b] font-body min-h-screen flex selection:bg-[#b1d1fd] selection:text-[#002f59]">
      
      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-[#f6f3f2] border-r border-[#e5e2e1] flex flex-col justify-between py-8 z-40">
        <div>
          <div className="px-7 mb-8">
            <h1 className="font-display text-xl font-bold text-[#002f59] tracking-tight">UNAIR Admin</h1>
            <p className="text-[#424750] text-xs font-medium mt-0.5">Staff Portal</p>
          </div>
          <nav className="space-y-1 px-3">
            <button type="button" onClick={() => setPage && setPage("CatalogAdmin")} className="w-full flex items-center gap-3 px-4 py-3 text-[#424750] hover:bg-[#e5e2e1]/60 rounded-xl text-xs font-medium transition-all cursor-pointer text-left">
              <span className="material-symbols-outlined text-[18px]">dashboard</span><span>Dashboard</span>
            </button>
            <button type="button" onClick={() => setPage && setPage("CatalogAdmin")} className="w-full flex items-center gap-3 px-4 py-3 bg-[#d2e4ff] text-[#002f59] rounded-xl text-xs font-semibold transition-all cursor-pointer text-left">
              <span className="material-symbols-outlined text-[18px]">menu_book</span><span>Catalog Admin</span>
            </button>
            <button type="button" onClick={() => setPage && setPage("MemberManagement")} className="w-full flex items-center gap-3 px-4 py-3 text-[#424750] hover:bg-[#e5e2e1]/60 rounded-xl text-xs font-medium transition-all cursor-pointer text-left">
              <span className="material-symbols-outlined text-[18px]">group</span><span>Member Management</span>
            </button>
            <button type="button" onClick={() => setPage && setPage("LoanProcessing")} className="w-full flex items-center gap-3 px-4 py-3 text-[#424750] hover:bg-[#e5e2e1]/60 rounded-xl text-xs font-medium transition-all cursor-pointer text-left">
              <span className="material-symbols-outlined text-[18px]">handshake</span><span>Loan Processing</span>
            </button>
            <button type="button" onClick={() => setPage && setPage("ReturnProcessing")} className="w-full flex items-center gap-3 px-4 py-3 text-[#424750] hover:bg-[#e5e2e1]/60 rounded-xl text-xs font-medium transition-all cursor-pointer text-left">
              <span className="material-symbols-outlined text-[18px]">payments</span><span>Returns & Fines</span>
            </button>
          </nav>
        </div>
        <div className="px-3 space-y-1">
          <button type="button" className="w-full flex items-center gap-3 px-4 py-3 text-[#424750] hover:bg-[#e5e2e1]/60 rounded-xl text-xs font-medium transition-all cursor-pointer text-left">
            <span className="material-symbols-outlined text-[18px]">help</span><span>Help Center</span>
          </button>
          <button type="button" onClick={() => alert("Mengarahkan keluar...")} className="w-full flex items-center gap-3 px-4 py-3 text-[#424750] hover:bg-[#e5e2e1]/60 rounded-xl text-xs font-medium transition-all cursor-pointer text-left">
            <span className="material-symbols-outlined text-[18px]">logout</span><span>Logout</span>
          </button>
        </div>
      </aside>

      {/* KONTEN UTAMA */}
      <main className="ml-64 flex-1 p-10 max-w-[1240px]">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => setPage && setPage("CatalogAdmin")} className="hover:bg-[#e5e2e1]/60 p-1.5 rounded-lg transition-colors cursor-pointer text-[#424750]">
              <span className="material-symbols-outlined text-xl">arrow_back</span>
            </button>
            <h2 className="font-display text-xl font-bold text-[#002f59]">Edit Book Record</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-emerald-600 font-semibold">Mode: Auto-Select Youngest Book</span>
            <div className="w-8 h-8 rounded-full bg-[#002f59] text-white flex items-center justify-center text-xs font-bold font-display shadow-xs">AD</div>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-7">
          {/* KOLOM KIRI */}
          <div className="lg:col-span-7 space-y-7">
            <section className="bg-white p-7 rounded-2xl border border-[#e5e2e1] shadow-2xs space-y-5">
              <div className="flex items-center gap-2 text-[#002f59]">
                <span className="material-symbols-outlined text-xl">info</span>
                <h3 className="font-display text-base font-bold">General Information</h3>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="title" className="block text-xs text-[#424750] mb-1.5 font-medium">Book Title</label>
                    <input id="title" type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-3 rounded-lg border border-[#c2c6d1] text-xs text-[#1c1b1b] focus:border-[#002f59] outline-none font-semibold" />
                  </div>
                  <div>
                    <label htmlFor="isbn" className="block text-xs text-[#424750] mb-1.5 font-medium">ISBN-13</label>
                    <input id="isbn" type="text" value={isbn} onChange={(e) => setIsbn(e.target.value)} className="w-full p-3 rounded-lg border border-[#c2c6d1] text-xs text-[#1c1b1b] focus:border-[#002f59] outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="author" className="block text-xs text-[#424750] mb-1.5 font-medium">Primary Author</label>
                    <input id="author" type="text" value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full p-3 rounded-lg border border-[#c2c6d1] text-xs text-[#1c1b1b] focus:border-[#002f59] outline-none" />
                  </div>
                  <div>
                    <label htmlFor="publisher" className="block text-xs text-[#424750] mb-1.5 font-medium">Publisher</label>
                    <input id="publisher" type="text" value={publisher} onChange={(e) => setPublisher(e.target.value)} className="w-full p-3 rounded-lg border border-[#c2c6d1] text-xs text-[#1c1b1b] focus:border-[#002f59] outline-none" />
                  </div>
                  <div>
                    <label htmlFor="year" className="block text-xs text-[#424750] mb-1.5 font-medium">Publication Year</label>
                    <input id="year" type="number" value={year} onChange={(e) => setYear(e.target.value)} className="w-full p-3 rounded-lg border border-[#c2c6d1] text-xs text-primary font-bold bg-blue-50/50 focus:border-[#002f59] outline-none" />
                  </div>
                </div>
                <div>
                  <label htmlFor="desc" className="block text-xs text-[#424750] mb-1.5 font-medium">Description</label>
                  <textarea id="desc" rows="5" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-3 rounded-lg border border-[#c2c6d1] text-xs text-[#1c1b1b] focus:border-[#002f59] outline-none leading-relaxed resize-none" />
                </div>
              </div>
            </section>

            <section className="bg-white p-7 rounded-2xl border border-[#e5e2e1] shadow-2xs space-y-5">
              <div className="flex items-center gap-2 text-[#002f59]">
                <span className="material-symbols-outlined text-xl">label</span>
                <h3 className="font-display text-base font-bold">Cataloging & Keywords</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="block text-xs text-[#424750] mb-1.5 font-medium">Subject Category</label>
                  <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-3 rounded-lg border border-[#c2c6d1] text-xs text-[#1c1b1b] focus:border-[#002f59] outline-none bg-white">
                    <option value="Fluid Mechanics">Fluid Mechanics</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="callnumber" className="block text-xs text-[#424750] mb-1.5 font-medium">Call Number / Rak</label>
                  <input id="callnumber" type="text" value={callNumber} onChange={(e) => setCallNumber(e.target.value)} className="w-full p-3 rounded-lg border border-[#c2c6d1] text-xs text-[#1c1b1b] focus:border-[#002f59] outline-none" />
                </div>
              </div>
              <div className="pt-1">
                <label className="block text-xs text-[#424750] mb-2 font-medium">Active Keywords</label>
                <div className="flex flex-wrap gap-2 items-center">
                  {keywords.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#d2e4ff] text-[#002f59] rounded-full text-xs font-semibold">
                      <span>{tag}</span>
                      <button type="button" onClick={() => handleRemoveTag(tag)} className="material-symbols-outlined text-[13px] hover:text-red-600 cursor-pointer">close</button>
                    </span>
                  ))}
                  {isAddingTag ? (
                    <input type="text" autoFocus value={newTagInput} onChange={(e) => setNewTagInput(e.target.value)} onKeyDown={handleAddTagKeydown} onBlur={() => setIsAddingTag(false)} placeholder="Ketik tag..." className="px-3 py-1 border border-[#002f59] text-xs rounded-full outline-none w-28" />
                  ) : (
                    <button type="button" onClick={() => setIsAddingTag(true)} className="inline-flex items-center gap-1 px-3 py-1 border border-dashed border-[#727781] text-[#424750] hover:bg-[#f6f3f2] rounded-full text-xs font-medium cursor-pointer">
                      + Add Tag
                    </button>
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* KOLOM KANAN */}
          <div className="lg:col-span-5 space-y-7">
            <section className="bg-white p-7 rounded-2xl border border-[#e5e2e1] shadow-2xs flex flex-col items-center">
              <div className="w-full flex items-center gap-2 mb-5 text-[#002f59]">
                <span className="material-symbols-outlined text-xl">image</span>
                <h3 className="font-display text-base font-bold">Cover Image</h3>
              </div>
              <div className="w-52 h-72 rounded-lg overflow-hidden shadow-md border border-gray-100 relative group bg-gray-50 flex items-center justify-center">
                <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" onError={() => setCoverUrl("https://via.placeholder.com/300x450?text=No+Cover")} />
                <div className="absolute inset-0 bg-[#002f59]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-xs">
                  <button type="button" onClick={() => {
                    const url = prompt("Masukkan link URL gambar baru:", coverUrl);
                    if (url) setCoverUrl(url);
                  }} className="p-2 bg-white text-[#002f59] rounded-full shadow cursor-pointer"><span className="material-symbols-outlined text-sm">link</span></button>
                </div>
              </div>
              <p className="text-[11px] text-[#727781] mt-4 text-center">URL bound to Supabase storage/external</p>
            </section>

            <section className="bg-white p-7 rounded-2xl border border-[#e5e2e1] shadow-2xs space-y-5">
              <div className="flex items-center gap-2 text-[#002f59]">
                <span className="material-symbols-outlined text-xl">inventory_2</span>
                <h3 className="font-display text-base font-bold">Inventory Control</h3>
              </div>
              <div className="space-y-3">
                <div className="bg-[#f6f3f2] p-3 rounded-xl flex justify-between items-center">
                  <span className="text-xs text-[#424750] font-medium">Total Stock</span>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={handleDecrementStock} className="w-6 h-6 bg-white border border-[#c2c6d1] rounded flex items-center justify-center text-xs font-bold cursor-pointer">-</button>
                    <span className="text-xs font-semibold w-5 text-center">{stock}</span>
                    <button type="button" onClick={handleIncrementStock} className="w-6 h-6 bg-white border border-[#c2c6d1] rounded flex items-center justify-center text-xs font-bold cursor-pointer">+</button>
                  </div>
                </div>
                <div className="bg-[#f6f3f2] p-3 rounded-xl flex justify-between items-center">
                  <span className="text-xs text-[#424750] font-medium">Available for Loan</span>
                  <span className="text-xs font-bold text-[#002f59] mr-1">{Math.max(0, stock - 1)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input id="reserve" type="checkbox" checked={allowReserve} onChange={(e) => setAllowReserve(e.target.checked)} className="w-4 h-4 rounded text-[#002f59] focus:ring-0 accent-[#002f59] cursor-pointer" />
                <label htmlFor="reserve" className="text-xs text-[#1c1b1b] font-medium cursor-pointer">Allow Reservations (Status Aktif)</label>
              </div>

              <div>
                <label htmlFor="branch" className="block text-xs text-[#424750] mb-1.5 font-medium">Library Branch</label>
                <select id="branch" value={branch} onChange={(e) => setBranch(e.target.value)} className="w-full p-3 rounded-lg border border-[#c2c6d1] text-xs text-[#1c1b1b] focus:border-[#002f59] outline-none bg-white">
                  <option value="Main Library - Kampus C">Main Library - Kampus C</option>
                  <option value="Medicine Library - Kampus A">Medicine Library - Kampus A</option>
                  <option value="Law Library - Kampus B">Law Library - Kampus B</option>
                </select>
              </div>

              <div className="pt-2 space-y-2.5">
                <button type="submit" disabled={isSaving} className="w-full py-3 bg-[#002f59] hover:bg-[#002f59]/90 disabled:bg-gray-400 text-white rounded-lg font-display text-xs font-semibold transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2">
                  {isSaving ? <><span className="material-symbols-outlined animate-spin text-sm">refresh</span> Menyimpan...</> : "Update Book Record"}
                </button>

                <button type="button" onClick={async () => {
                  if (!currentId) return;
                  if (confirm("Yakin ingin menghapus buku termuda ini secara permanen dari Supabase?")) {
                    await supabase.from("buku").delete().eq("id_buku", currentId);
                    setPage && setPage("CatalogAdmin");
                  }
                }} className="w-full py-3 bg-white text-[#ba1a1a] border border-[#ffdad6] rounded-lg font-display text-xs font-semibold hover:bg-red-50 transition-colors cursor-pointer">
                  Delete Record
                </button>
              </div>
            </section>
          </div>
        </form>
      </main>

      {/* Toast Notification */}
      <div className={`fixed bottom-8 right-8 bg-[#293033] text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-2.5 transition-all duration-300 z-50 ${showToast ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"}`}>
        <span className="material-symbols-outlined text-green-400 text-lg">check_circle</span>
        <span className="text-xs font-medium">Data buku termuda berhasil di-update di Supabase!</span>
      </div>
    </div>
  );
}
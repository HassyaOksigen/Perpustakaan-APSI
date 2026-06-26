import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import {
  ArrowLeft,
  Search,
  Bell,
  Bookmark,
  Share2,
  CheckCircle,
  RefreshCw,
  ExternalLink,
  Globe,
  AtSign,
  BookOpenCheck,
  Package,
  Loader2,
  Star,
} from "lucide-react";

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loanStatus, setLoanStatus] = useState("idle");

  useEffect(() => {
    async function fetchSingleBook() {
      if (!id) return;
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("buku")
          .select("*")
          .eq("id_buku", id)
          .single();

        if (error) throw error;
        if (data) setBook(data);
      } catch (err) {
        console.error("Gagal menarik detail buku:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSingleBook();
  }, [id]);

  const handleApplyLoan = async () => {
    setLoanStatus("processing");

    try {
      // 1. Cari ID Anggota dari email user yang sedang login (hassya@gmail.com)
      const { data: userData, error: userErr } = await supabase
        .from("anggota")
        .select("id_anggota")
        .eq("email", "hassya@gmail.com")
        .single();

      if (userErr || !userData) {
        throw new Error(
          "Email hassya@gmail.com belum terdaftar di tabel 'anggota'!",
        );
      }

      // 2. Buat Karcis Peminjaman (Header)
      const tglPinjam = new Date().toISOString();
      const jatuhTempo = new Date(
        Date.now() + 14 * 24 * 60 * 60 * 1000,
      ).toISOString(); // +14 Hari

      const { data: pinjamData, error: pinjamErr } = await supabase
        .from("peminjaman")
        .insert([
          {
            id_anggota: userData.id_anggota,
            tanggal_pinjam: tglPinjam,
            tanggal_jatuh_tempo: jatuhTempo,
            status_peminjaman: true, // true = buku sedang dibawa user
          },
        ])
        .select("id_peminjaman")
        .single();

      if (pinjamErr) throw pinjamErr;

      // 3. Catat buku apa yang dipinjam ke 'detail_peminjaman'
      const { error: detailErr } = await supabase
        .from("detail_peminjaman")
        .insert([
          {
            id_peminjaman: pinjamData.id_peminjaman,
            id_buku: book.id_buku,
            jumlah: 1,
          },
        ]);

      if (detailErr) throw detailErr;

      // 4. Kurangi stok buku di rak sebanyak 1
      await supabase
        .from("buku")
        .update({ stok: book.stok - 1 })
        .eq("id_buku", book.id_buku);

      setLoanStatus("success");
      alert(
        `🎉 Berhasil! Buku "${book.judul_buku}" resmi masuk ke daftar pinjamanmu.`,
      );
      navigate("/my-loans");
    } catch (err) {
      console.error("Gagal meminjam:", err);
      alert("Gagal memproses peminjaman: " + err.message);
      setLoanStatus("idle");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3 text-primary font-body">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="font-bold text-sm tracking-wider uppercase animate-pulse">
          Menyiapkan Lembar Arsip Buku...
        </p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 font-body text-center p-6">
        <Package className="w-16 h-16 text-outline opacity-40" />
        <h2 className="font-display font-bold text-2xl text-primary">
          Buku Tidak Ditemukan
        </h2>
        <p className="text-xs text-on-surface-variant max-w-md">
          Arsip digital untuk nomor identitas ini tidak tersedia. Buku mungkin
          telah ditarik atau dipindahkan.
        </p>
        <Link
          to="/catalog"
          className="mt-2 px-6 py-3 bg-primary text-white text-xs font-bold rounded-full hover:bg-primary-container transition-all"
        >
          Kembali ke Katalog
        </Link>
      </div>
    );
  }

  const isAvailable = book.stok > 0;

  return (
    <div className="bg-background min-h-screen font-body text-on-surface antialiased selection:bg-primary selection:text-white">
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-[1280px] rounded-full bg-surface/80 backdrop-blur-xl shadow-md border border-outline-variant/30 flex justify-between items-center px-8 h-16 z-50">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <BookOpenCheck className="w-6 h-6 text-primary" />
            <span className="font-display font-bold text-lg text-primary tracking-tight">
              UNAIR Library
            </span>
          </div>
          <div className="hidden md:flex gap-6 font-semibold text-sm">
            <Link
              to="/catalog"
              className="text-primary border-b-2 border-primary pb-1"
            >
              Catalog
            </Link>
            <Link
              to="/collections"
              className="text-on-surface-variant hover:text-primary transition-colors"
            >
              Collections
            </Link>
            <Link
              to="/my-loans"
              className="text-on-surface-variant hover:text-primary transition-colors"
            >
              My Loans
            </Link>
            <a
              href="#"
              className="text-on-surface-variant hover:text-primary transition-colors"
            >
              Journals
            </a>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center bg-surface-container-low px-4 py-2 rounded-full border border-outline-variant/30">
            <Search className="w-4 h-4 text-on-surface-variant mr-2.5" />
            <input
              type="text"
              placeholder="Search catalog..."
              className="bg-transparent border-none focus:outline-none text-xs w-32 md:w-48 text-on-surface font-medium"
            />
          </div>
          <button className="p-2 hover:bg-primary-fixed/20 rounded-full transition-all text-on-surface-variant cursor-pointer">
            <Bell className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-primary-fixed/20 rounded-full transition-all text-on-surface-variant cursor-pointer">
            <Bookmark className="w-5 h-5" />
          </button>
          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-primary/20 hover:border-primary transition-colors cursor-pointer shrink-0">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6 md:px-16 max-w-[1280px] mx-auto">
        <div className="mb-8 flex items-center gap-2 text-xs font-semibold text-on-surface-variant">
          <Link
            to="/catalog"
            className="hover:text-primary flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Search</span>
          </Link>
          <span className="text-outline-variant">/</span>
          <span className="opacity-60">{book.judul_buku}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-4 space-y-8">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-tr from-primary/30 to-secondary/30 rounded-[28px] blur-md opacity-30 group-hover:opacity-50 transition duration-500"></div>
              <div className="relative aspect-[3/4] rounded-[24px] overflow-hidden shadow-2xl border border-outline-variant/30 bg-surface-container-low flex items-center justify-center bg-gray-50">
                <img
                  src={
                    book.image_url ||
                    "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=800&auto=format&fit=crop"
                  }
                  alt={book.judul_buku}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-outline-variant/30 text-center">
                <span className="block text-xs font-semibold text-outline mb-1">
                  Format
                </span>
                <span className="block font-display font-bold text-base text-primary">
                  Physical / Hardcover
                </span>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-outline-variant/30 text-center">
                <span className="block text-xs font-semibold text-outline mb-1">
                  Kategori DB
                </span>
                <span className="block font-display font-bold text-xs text-primary line-clamp-1 mt-0.5">
                  {book.kategori || "Umum"}
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 flex flex-col gap-8 text-sm">
            <div className="space-y-3.5">
              <div className="flex flex-wrap gap-2">
                <span className="px-3.5 py-1 bg-secondary-fixed text-on-secondary-fixed-variant rounded-full font-bold text-[11px] uppercase tracking-wider">
                  {book.kategori || "General Department"}
                </span>
                <span className="px-3.5 py-1 bg-surface-container-highest text-on-surface-variant rounded-full font-bold text-[11px] uppercase tracking-wider">
                  {book.cabang || "Main Kampus C"}
                </span>
              </div>

              <h1 className="font-display font-bold text-3xl md:text-4xl text-primary leading-tight tracking-tight">
                {book.judul_buku}
              </h1>

              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5 font-semibold text-on-surface">
                  <AtSign className="w-3.5 h-3.5 text-primary" />
                  <span>{book.pengarang || "Penulis Tidak Diketahui"}</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-outline-variant"></div>
                <span className="text-on-surface-variant/80 font-medium">
                  Tahun Terbit:{" "}
                  {book.tahun_terbit ? book.tahun_terbit.split("-")[0] : "N/A"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-6 bg-surface-container-low rounded-[24px] border border-outline-variant/40 shadow-inner">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-outline">
                  Nomor ISBN-13
                </span>
                <span className="font-bold text-on-surface font-mono text-xs">
                  {book.isbn || "Tidak Terdaftar"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-outline">
                  Penerbit (Publisher)
                </span>
                <span className="font-bold text-on-surface">
                  {book.penerbit || "Airlangga University Press"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-outline">
                  Nomor Panggil / Rak
                </span>
                <span className="font-bold text-on-surface font-mono text-xs">
                  {book.lokasi_rak || "RAK-UMUM-01"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-outline">
                  Status Peredaran
                </span>
                <span className="font-bold text-on-surface">
                  {book.status_buku
                    ? "Koleksi Terbuka (Dapat Dipinjam)"
                    : "Referensi Khusus"}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="font-display font-bold text-xl text-primary">
                Synopsis / Deskripsi
              </h2>
              <p className="text-on-surface-variant leading-relaxed text-xs md:text-sm text-justify whitespace-pre-line">
                {book.deskripsi ||
                  "Pustakawan belum menyertakan teks sinopsis untuk lembar katalog buku ini."}
              </p>
            </div>

            <div className="mt-4 p-8 bg-white rounded-[32px] shadow-xl border border-primary/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-10 -mt-10 pointer-events-none"></div>

              <div className="flex gap-5 items-center z-10">
                <div className="w-14 h-14 rounded-2xl bg-secondary-fixed/60 flex items-center justify-center shrink-0 border border-secondary-fixed">
                  <Package className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-on-surface">
                    Ketersediaan Stok
                  </h3>
                  <div className="flex flex-col gap-1 mt-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${isAvailable ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" : "bg-red-500"}`}
                      ></span>
                      <span className="text-on-surface font-bold">
                        {isAvailable
                          ? `Tersedia (${book.stok} eksemplar siap pinjam)`
                          : "Stok Kosong / Sedang Dipinjam Semua"}
                      </span>
                    </div>
                    <span className="text-on-surface-variant/80 font-medium">
                      Lokasi: {book.cabang || "Perpustakaan Kampus B"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto z-10">
                <button
                  onClick={handleApplyLoan}
                  disabled={!isAvailable || loanStatus !== "idle"}
                  className={`px-8 py-4 rounded-full font-semibold shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-xs ${
                    !isAvailable
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                      : loanStatus === "success"
                        ? "bg-emerald-600 text-white shadow-emerald-600/20"
                        : "bg-primary text-white shadow-primary/20 hover:bg-primary-container active:scale-[0.98] cursor-pointer"
                  }`}
                >
                  {!isAvailable && <span>Buku Habis Dipinjam</span>}
                  {isAvailable && loanStatus === "idle" && (
                    <>
                      <span>Apply for Loan</span>
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </>
                  )}
                  {loanStatus === "processing" && (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Memproses Data...</span>
                    </>
                  )}
                  {loanStatus === "success" && (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Pengajuan Terkirim</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() =>
                    alert(
                      `Bagikan tautan buku: localhost:5173/book-detail/${book.id_buku}`,
                    )
                  }
                  className="p-4 bg-surface-container-low text-primary rounded-full hover:bg-surface-container-highest transition-all flex items-center justify-center cursor-pointer border border-outline-variant/30 shadow-sm"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-24 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-2xl text-primary">
              Koleksi Rekomendasi Lainnya
            </h2>
            <Link
              to="/catalog"
              className="text-primary font-semibold text-xs flex items-center gap-1 hover:underline"
            >
              <span>Jelajahi semua</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[
              {
                title: "Data Privacy",
                author: "Mark Stevenson",
                cover:
                  "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=400&auto=format&fit=crop",
              },
              {
                title: "AI in Finance",
                author: "Sarah Jenkins",
                cover:
                  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop",
              },
              {
                title: "Cryptocurrency",
                author: "James Wu",
                cover:
                  "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400&auto=format&fit=crop",
              },
              {
                title: "The New Silk Road",
                author: "Li Wei",
                cover:
                  "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=400&auto=format&fit=crop",
              },
              {
                title: "Sustainable Growth",
                author: "Anna Green",
                cover:
                  "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?q=80&w=400&auto=format&fit=crop",
              },
            ].map((item, idx) => (
              <Link
                to="/catalog"
                key={idx}
                className="group cursor-pointer bg-surface-container-lowest p-2.5 rounded-2xl border border-outline-variant/30 hover:shadow-lg transition-all block"
              >
                <div className="aspect-[3/4] rounded-xl overflow-hidden mb-3 bg-surface-container-low relative">
                  <img
                    src={item.cover}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h4 className="font-display font-bold text-xs text-on-surface group-hover:text-primary transition-colors line-clamp-1">
                  {item.title}
                </h4>
                <span className="text-[11px] text-on-surface-variant/70 block mt-0.5">
                  {item.author}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <footer className="w-full py-12 bg-surface-container-low border-t border-outline-variant/40 text-xs text-on-surface-variant">
        <div className="max-w-[1280px] mx-auto px-6 md:px-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <span className="font-display font-bold text-base text-primary">
              UNAIR Library
            </span>
            <p className="max-w-sm leading-relaxed">
              Providing excellence in information services and supporting the
              academic growth of Universitas Airlangga.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-primary tracking-widest uppercase mb-2">
              Layanan Cepat
            </h4>
            <p>Email: info@lib.unair.ac.id | WhatsApp: +62 821-3456-7890</p>
          </div>
        </div>
        <div className="max-w-[1280px] mx-auto px-6 md:px-16 mt-10 pt-6 border-t border-outline-variant/30 text-center font-medium">
          © 2024 Universitas Airlangga Library. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}

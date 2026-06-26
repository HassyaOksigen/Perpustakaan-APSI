import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Handshake,
  Banknote,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  ScanLine,
  Video,
  AlertTriangle,
  CheckCircle2,
  Printer,
  ArrowRight,
  Loader2,
  BookCheck,
  Plus,
  User,
} from "lucide-react";

export default function ReturnProcessing() {
  const navigate = useNavigate();

  const [barcodeInput, setBarcodeInput] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [conditions, setConditions] = useState({ intact: true, rfid: true });
  const [returnStatus, setReturnStatus] = useState("idle");

  const handleAdminLogout = () => {
    if (
      confirm(
        "Apakah Anda yakin ingin keluar dari portal Admin (admin@gmail.com)?",
      )
    ) {
      localStorage.clear();
      navigate("/login");
    }
  };

  const handleConfirmReturn = () => {
    setReturnStatus("processing");
    setTimeout(() => {
      setReturnStatus("completed");
      alert(
        "Sequence 8.2.11: Return Processed Successfully. Fine recorded in student ledger.",
      );
      navigate("/fine-management");
    }, 1500);
  };

  return (
    // 1. NORMAL BLOCK CONTAINER (Tanpa atribut 'flex' di bungkus paling luar)
    <div className="min-h-screen bg-background font-body text-on-surface antialiased overflow-x-hidden selection:bg-secondary-container">
      {/* SIDEBAR KIRI (Tetap melayang fixed) */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-surface-container-low shadow-sm flex flex-col py-6 space-y-2 border-r border-outline-variant/30 z-50">
        <div className="px-6 mb-8">
          <h1 className="font-display font-bold text-2xl text-primary tracking-tight">
            UNAIR Admin
          </h1>
          <p className="text-xs font-semibold text-on-surface-variant/70 tracking-wider uppercase mt-0.5">
            Staff Portal
          </p>
        </div>

        <nav className="flex-1 px-3 space-y-1 text-xs font-semibold">
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3.5 text-on-surface-variant hover:bg-surface-container-highest transition-colors rounded-xl"
          >
            <LayoutDashboard className="w-4 h-4 text-primary" />
            <span>Dashboard</span>
          </a>
          <Link
            to="/catalog-admin"
            className="flex items-center gap-3 px-4 py-3.5 text-on-surface-variant hover:bg-surface-container-highest transition-colors rounded-xl"
          >
            <BookOpen className="w-4 h-4 text-primary" />
            <span>Catalog Admin</span>
          </Link>
          <Link
            to="/member-management"
            className="flex items-center gap-3 px-4 py-3.5 text-on-surface-variant hover:bg-surface-container-highest transition-colors rounded-xl"
          >
            <Users className="w-4 h-4 text-primary" />
            <span>Member Management</span>
          </Link>
          <Link
            to="/admin"
            className="flex items-center gap-3 px-4 py-3.5 text-on-surface-variant hover:bg-surface-container-highest transition-colors rounded-xl"
          >
            <Handshake className="w-4 h-4 text-primary" />
            <span>Loan Processing</span>
          </Link>
          <Link
            to="/return-processing"
            className="flex items-center gap-3 px-4 py-3.5 bg-secondary-container text-on-secondary-container font-bold rounded-xl shadow-sm"
          >
            <Banknote className="w-4 h-4 text-primary font-extrabold" />
            <span>Returns & Fines</span>
          </Link>
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3.5 text-on-surface-variant hover:bg-surface-container-highest transition-colors rounded-xl"
          >
            <BarChart3 className="w-4 h-4 text-primary" />
            <span>Analytics</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3.5 text-on-surface-variant hover:bg-surface-container-highest transition-colors rounded-xl"
          >
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
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-primary transition-colors rounded-xl"
          >
            <HelpCircle className="w-4 h-4 text-primary" />
            <span>Help Center</span>
          </a>
          <button
            onClick={handleAdminLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors rounded-xl cursor-pointer text-left font-bold"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Portal</span>
          </button>
        </div>
      </aside>
      {/* 2. WRAPPER KERJA KANAN (Mendorong seluruh isi kanan sejauh ml-64) */}
      <div className="ml-64 flex flex-col min-h-screen">
        {/* KONTEN ATAS (Fleksibel mengisi tinggi layar) */}
        <main className="flex-1 p-8 lg:p-12 max-w-[1400px] w-full mx-auto">
          <header className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="font-display font-bold text-3xl text-primary tracking-tight">
                Return Processing
              </h2>
              <p className="text-xs md:text-sm text-on-surface-variant mt-1 font-medium">
                Process book returns and verify loan conditions as per Sequence
                8.2.11.
              </p>
            </div>
            <div className="flex items-center gap-3.5 bg-white px-5 py-2.5 rounded-full shadow-sm border border-outline-variant/30 shrink-0">
              <div className="w-9 h-9 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold">
                <User className="w-4 h-4" />
              </div>
              <div className="flex flex-col text-xs">
                <span className="font-bold text-on-surface">
                  Staff ID: 10429
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-on-surface-variant">
                  Library Admin
                </span>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* KOLOM PEMINDAI KIRI (5/12) */}
            <div className="lg:col-span-5 space-y-8">
              <section className="bg-surface-container-lowest rounded-3xl shadow-sm p-8 border border-outline-variant/30">
                <div className="flex items-center gap-2.5 mb-6">
                  <ScanLine className="w-5 h-5 text-primary" />
                  <h3 className="font-display font-bold text-xl text-primary">
                    Identify Loan
                  </h3>
                </div>
                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="search-input"
                      className="block text-xs font-bold text-on-surface-variant mb-2 uppercase tracking-wider"
                    >
                      Scan Book Barcode or Enter Loan ID
                    </label>
                    <div
                      className={`flex transition-transform duration-200 shadow-sm rounded-2xl overflow-hidden border ${isInputFocused ? "scale-[1.02] border-primary ring-2 ring-primary/10" : "border-outline-variant/60"}`}
                    >
                      <div className="relative flex-1 bg-surface-container-lowest">
                        <ScanLine className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline/50" />
                        <input
                          id="search-input"
                          type="text"
                          value={barcodeInput}
                          onChange={(e) => setBarcodeInput(e.target.value)}
                          onFocus={() => setIsInputFocused(true)}
                          onBlur={() => setIsInputFocused(false)}
                          placeholder="e.g. UNAIR-2023-9912"
                          className="w-full pl-11 pr-4 py-3.5 bg-transparent text-xs font-semibold focus:outline-none"
                        />
                      </div>
                      <button
                        onClick={() =>
                          alert(
                            `Mencoba mengidentifikasi barcode: ${barcodeInput || "UNAIR-2023-9912"}`,
                          )
                        }
                        className="bg-primary text-white px-6 font-bold text-xs hover:bg-primary-container active:scale-[0.98] transition-all cursor-pointer"
                      >
                        Identify
                      </button>
                    </div>
                  </div>
                  <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-900 flex items-center justify-center group border border-outline-variant/30 shadow-inner">
                    <img
                      src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=600&auto=format&fit=crop"
                      alt="Scanner Visual"
                      className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-300"
                    />
                    <div className="z-10 text-center text-blue-400 flex flex-col items-center p-4 bg-slate-950/60 backdrop-blur-md rounded-2xl border border-blue-500/20 animate-pulse">
                      <Video className="w-8 h-8 mb-1.5 text-blue-400" />
                      <span className="text-xs font-bold uppercase tracking-widest text-white">
                        Camera Scanner Ready
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="bg-surface-container-lowest rounded-3xl shadow-sm p-8 border border-outline-variant/30">
                <h3 className="font-display font-bold text-xl text-primary mb-5">
                  Conditions Check
                </h3>
                <div className="space-y-3 text-xs font-medium">
                  <label className="flex items-start gap-3.5 p-4 rounded-2xl bg-surface-container-low/40 hover:bg-surface-container-low cursor-pointer transition-all border border-outline-variant/30 select-none">
                    <input
                      type="checkbox"
                      checked={conditions.intact}
                      onChange={(e) =>
                        setConditions((prev) => ({
                          ...prev,
                          intact: e.target.checked,
                        }))
                      }
                      className="mt-0.5 w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer shrink-0"
                    />
                    <div>
                      <span className="block font-bold text-on-surface text-sm">
                        Book Intact
                      </span>
                      <span className="text-on-surface-variant/80 mt-0.5 block leading-relaxed">
                        No significant physical damage or missing pages
                        detected.
                      </span>
                    </div>
                  </label>
                  <label className="flex items-start gap-3.5 p-4 rounded-2xl bg-surface-container-low/40 hover:bg-surface-container-low cursor-pointer transition-all border border-outline-variant/30 select-none">
                    <input
                      type="checkbox"
                      checked={conditions.rfid}
                      onChange={(e) =>
                        setConditions((prev) => ({
                          ...prev,
                          rfid: e.target.checked,
                        }))
                      }
                      className="mt-0.5 w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer shrink-0"
                    />
                    <div>
                      <span className="block font-bold text-on-surface text-sm">
                        RFID Tag Functional
                      </span>
                      <span className="text-on-surface-variant/80 mt-0.5 block leading-relaxed">
                        Internal security sensor is responding correctly.
                      </span>
                    </div>
                  </label>
                </div>
              </section>
            </div>

            {/* KOLOM RINCIAN DENDA KANAN (7/12) */}
            <div className="lg:col-span-7">
              <div className="bg-surface-container-lowest rounded-3xl shadow-md border border-outline-variant/30 overflow-hidden sticky top-8">
                <div className="bg-primary p-8 text-white flex justify-between items-start gap-4">
                  <div className="flex gap-5 items-center sm:items-start">
                    <div className="w-20 sm:w-24 aspect-[3/4] bg-white/10 rounded-xl overflow-hidden shrink-0 shadow-md border border-white/20">
                      <img
                        src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop"
                        alt="Macroeconomics Book"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <span className="bg-secondary-fixed text-primary-container px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest inline-block">
                        Active Loan
                      </span>
                      <h3 className="font-display font-bold text-xl sm:text-2xl leading-tight">
                        Advanced Macroeconomics: A Modern Approach
                      </h3>
                      <p className="text-white/80 text-xs font-mono">
                        David H. Romer | ISBN 978-0073511375
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 hidden sm:block">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-blue-300">
                      Loan ID
                    </p>
                    <p className="font-mono font-bold text-lg text-white">
                      #LN-88219
                    </p>
                  </div>
                </div>

                <div className="p-8 space-y-8 text-xs">
                  <div className="grid grid-cols-2 gap-6 font-medium">
                    <div className="space-y-1 bg-surface-container-low/50 p-4 rounded-2xl border border-outline-variant/30">
                      <p className="text-outline uppercase tracking-wider text-[10px] font-bold">
                        Borrower
                      </p>
                      <span className="font-display font-bold text-base text-primary block">
                        Arya Wiguna
                      </span>
                      <p className="text-on-surface-variant font-mono text-[11px]">
                        Student ID: 12211133005
                      </p>
                    </div>
                    <div className="space-y-1 text-right bg-surface-container-low/50 p-4 rounded-2xl border border-outline-variant/30 font-medium">
                      <p className="text-outline uppercase tracking-wider text-[10px] font-bold">
                        Borrowed On
                      </p>
                      <p className="font-display font-bold text-base text-primary">
                        Oct 12, 2023
                      </p>
                      <p className="text-on-surface-variant text-[11px]">
                        Period: 14 Days
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-5 rounded-2xl bg-red-100 text-red-900 border border-red-300 animate-pulse shadow-sm">
                    <AlertTriangle className="w-8 h-8 text-red-600 shrink-0" />
                    <div className="flex-1 space-y-0.5">
                      <h4 className="font-display font-bold text-base text-red-700 uppercase tracking-wide">
                        OVERDUE BY 3 DAYS
                      </h4>
                      <p className="text-xs text-red-950/80 leading-relaxed font-medium">
                        Due date was Oct 26, 2023. Automatic fine calculation
                        applied.
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="block text-[10px] font-extrabold uppercase tracking-wider text-red-600">
                        Calculated Fine
                      </span>
                      <span className="text-2xl font-display font-black text-red-700">
                        Rp 15.000
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 font-medium text-sm bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/40 shadow-inner">
                    <div className="flex justify-between items-center text-on-surface-variant text-xs">
                      <span>Daily Late Fee (3 × Rp 5.000)</span>
                      <span className="text-on-surface font-bold font-mono">
                        Rp 15.000
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-on-surface-variant text-xs">
                      <span>Damage Penalty</span>
                      <span className="text-on-surface font-bold font-mono">
                        Rp 0
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-outline-variant/30 text-base">
                      <span className="font-display font-bold text-primary">
                        Total to be Paid
                      </span>
                      <span className="font-display font-extrabold text-red-600 text-xl font-mono">
                        Rp 15.000
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      onClick={handleConfirmReturn}
                      disabled={returnStatus !== "idle"}
                      className={`flex-1 py-4 rounded-2xl font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${returnStatus === "completed" ? "bg-emerald-600 text-white shadow-emerald-600/20" : returnStatus === "processing" ? "bg-primary/80 text-white cursor-wait shadow-none" : "bg-primary text-white shadow-primary/20 hover:bg-primary-container active:scale-[0.98]"}`}
                    >
                      {returnStatus === "idle" && (
                        <>
                          <span>Confirm Return & Record Ledger</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                      {returnStatus === "processing" && (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Syncing Student Ledger...</span>
                        </>
                      )}
                      {returnStatus === "completed" && (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Return Completed!</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() =>
                        alert("Mencetak struk pengembalian #LN-88219...")
                      }
                      disabled={returnStatus !== "idle"}
                      className="px-6 py-4 rounded-2xl border-2 border-outline-variant/80 font-bold text-xs text-on-surface hover:bg-surface-container transition-all flex items-center justify-center gap-2 cursor-pointer bg-white"
                    >
                      <Printer className="w-4 h-4 text-primary" />
                      <span>Print Receipt</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <section className="mt-16 bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/30 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <h3 className="font-display font-bold text-2xl text-primary">
                Recent Transactions
              </h3>
              <button className="text-primary font-bold text-xs flex items-center gap-1 hover:underline cursor-pointer">
                <span>View All Activity</span>{" "}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-surface-container-low/60 border-b border-outline-variant/30 font-bold text-on-surface-variant uppercase tracking-wider">
                    <th className="px-6 py-4">Time</th>
                    <th className="px-6 py-4">Item</th>
                    <th className="px-6 py-4">Member</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20 font-medium">
                  <tr className="hover:bg-surface-container-low/40 transition-colors">
                    <td className="px-6 py-4 text-on-surface-variant font-mono">
                      10:42 AM
                    </td>
                    <td className="px-6 py-4 font-bold text-on-surface">
                      Introduction to Psychology
                    </td>
                    <td className="px-6 py-4">Budi Santoso</td>
                    <td className="px-6 py-4">
                      <span className="bg-secondary-fixed text-on-secondary-fixed-variant font-extrabold px-2.5 py-1 rounded-full text-[10px]">
                        LOAN
                      </span>
                    </td>
                    <td className="px-6 py-4 text-emerald-600 font-extrabold">
                      Success
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container-low/40 transition-colors">
                    <td className="px-6 py-4 text-on-surface-variant font-mono">
                      09:15 AM
                    </td>
                    <td className="px-6 py-4 font-bold text-on-surface">
                      The Great Gatsby
                    </td>
                    <td className="px-6 py-4">Siti Aminah</td>
                    <td className="px-6 py-4">
                      <span className="bg-surface-container-highest text-on-surface-variant font-extrabold px-2.5 py-1 rounded-full text-[10px]">
                        RETURN
                      </span>
                    </td>
                    <td className="px-6 py-4 text-emerald-600 font-extrabold">
                      Success
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </main>

        {/* 3. FOOTER BAWAH (Otomatis terdorong ke dasar kanan berkat 'mt-auto') */}
        <footer className="w-full mt-auto bg-surface-container py-12 text-xs text-on-surface-variant border-t border-outline-variant/30">
          <div className="max-w-[1400px] mx-auto px-8 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-4 font-medium">
            <div className="flex items-center gap-2 font-display font-bold text-sm text-primary">
              <BookCheck className="w-4 h-4" />
              <span>UNAIR Library Staff Portal</span>
            </div>
            <div className="flex gap-8">
              <a href="#" className="hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Contact Support
              </a>
            </div>
            <div>
              © 2024 Universitas Airlangga Library. All rights reserved.
            </div>
          </div>
        </footer>
      </div>{" "}
      {/* <--- Tutup Wrapper Kerja Kanan */}
    </div>
  );
}

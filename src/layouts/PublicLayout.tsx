import { Outlet, Link } from 'react-router-dom';
import { Phone, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PublicLayout() {
    const adminWhatsApp = "6281224452921";
    const adminWhatsApp2 = "6285875203015";

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans scroll-smooth">
            {/* Floating WhatsApp */}
            <motion.a
                href={`https://wa.me/${adminWhatsApp}?text=Halo Raja Cimenyan Rental, saya ingin bertanya tentang...`}
                target="_blank"
                rel="noreferrer"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.1 }}
                className="fixed bottom-8 right-8 z-[100] bg-emerald-500 text-white p-4 rounded-full shadow-2xl shadow-emerald-500/50 flex items-center gap-2 group"
            >
                <MessageSquare size={28} />
                <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-bold whitespace-nowrap">Chat Admin WA</span>
            </motion.a>
            <nav className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3">
                        <img
                            src="/logo-rcr.png"
                            alt="Logo Raja Cimenyan Rental"
                            className="w-16 h-16 object-contain"
                        />
                        <div className="flex flex-col -gap-1">
                            <span className="text-2xl font-black tracking-tighter text-slate-900 leading-none">
                                RAJA CIMENYAN
                            </span>
                            <span className="text-xs font-black text-emerald-600 tracking-[0.3em] uppercase">
                                RENTAL
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex gap-10 items-center text-sm font-bold uppercase tracking-widest text-slate-600">
                        <Link to="/" className="hover:text-emerald-600 transition-colors">Beranda</Link>
                        <Link to="/sewa-mobil" className="hover:text-emerald-600 transition-colors border-l border-slate-200 pl-10">Rental Mobil</Link>
                        <Link to="/gendongan" className="hover:text-emerald-600 transition-colors">Tiket Travel</Link>

                        <div className="flex items-center gap-4 bg-slate-50 p-1.5 rounded-full border border-slate-100 ml-4">
                            <Link to="/login" className="px-5 py-2 hover:bg-white hover:shadow-sm rounded-full transition-all">Admin</Link>
                            <Link to="/login-sopir" className="px-5 py-2 bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 rounded-full transition-all text-center">Sopir</Link>
                        </div>
                    </div>
                </div>
            </nav>
            <main className="flex-grow">
                <Outlet />
            </main>
            <footer className="bg-slate-950 py-24 text-slate-400 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-16 mb-16 text-center md:text-left">
                        <div>
                            <h4 className="text-white font-black text-3xl mb-8 uppercase tracking-tighter italic">Raja Cimenyan<br /><span className="text-emerald-500">Rental</span></h4>
                            <p className="text-slate-500 leading-relaxed font-medium">
                                Pusat penyewaan mobil premium & agen tiket travel terpercaya di Bandung Timur. Mengedepankan kualitas unit dan pelayanan profesional 24 jam.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-white font-black text-sm uppercase tracking-[0.2em] mb-8">Informasi Kantor</h4>
                            <p className="text-slate-500 leading-relaxed font-medium">
                                Jl. Padasuka atas no 10, <br />
                                Cimenyan, Bandung, Jawa Barat. <br />
                                Indonesia (Lokasi Strategis).
                            </p>
                        </div>
                        <div>
                            <h4 className="text-white font-black text-sm uppercase tracking-[0.2em] mb-8">Pusat Bantuan</h4>
                            <ul className="space-y-6">
                                <li>
                                    <div className="flex flex-col gap-4">
                                        <a href={`https://wa.me/${adminWhatsApp}`} className="flex items-center justify-center md:justify-start gap-4 hover:text-emerald-500 transition-all group">
                                            <div className="bg-emerald-500/10 p-2.5 rounded-xl text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                                <Phone size={16} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black uppercase opacity-60 leading-none mb-1">Admin 1</span>
                                                <span className="font-black text-lg tracking-tighter text-white">0812-2445-2921</span>
                                            </div>
                                        </a>
                                        <a href={`https://wa.me/${adminWhatsApp2}`} className="flex items-center justify-center md:justify-start gap-4 hover:text-emerald-500 transition-all group">
                                            <div className="bg-emerald-500/10 p-2.5 rounded-xl text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                                <Phone size={16} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black uppercase opacity-60 leading-none mb-1">Admin 2</span>
                                                <span className="font-black text-lg tracking-tighter text-white">0858-7520-3015</span>
                                            </div>
                                        </a>
                                    </div>
                                </li>
                                <li className="text-xs font-bold text-slate-600 uppercase tracking-widest italic bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                                    "Melayani pemesanan, laporan kendala, & konfirmasi pembayaran setiap saat."
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-12 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-8">
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-600">© {new Date().getFullYear()} RAJA CIMENYAN RENTAL. ALL RIGHTS RESERVED.</p>
                        <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-700">
                            <Link to="/sewa-mobil" className="hover:text-emerald-500">Unit Mobil</Link>
                            <Link to="/gendongan" className="hover:text-emerald-500">Agen Travel</Link>
                            <Link to="/register" className="hover:text-emerald-500">Mitra Sopir</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

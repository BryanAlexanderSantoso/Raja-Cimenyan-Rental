import { motion } from 'framer-motion';
import { ChevronRight, Car, MapPin, CheckCircle2, Star, ShieldCheck, Heart, Clock, Phone, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function Home() {
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const adminWhatsApp = "6281224452921";
    const adminWhatsApp2 = "6285875203015";

    useEffect(() => {
        fetchTestimonials();
    }, []);

    async function fetchTestimonials() {
        const { data } = await supabase
            .from('testimonials')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(3);
        if (data) setTestimonials(data);
    }

    const faqs = [
        { q: "Bagaimana cara melakukan pemesanan?", a: "Anda bisa langsung klik tombol WhatsApp yang tersedia untuk terhubung dengan admin kami secara langsung." },
        { q: "Apakah bisa sewa mobil lepas kunci?", a: "Ya, kami melayani sewa mobil lepas kunci dengan syarat dan ketentuan yang berlaku." },
        { q: "Apa itu layanan Gendongan?", a: "Layanan Gendongan adalah jasa nebeng mobil searah untuk perjalanan antarkota yang lebih hemat biaya." }
    ];

    return (
        <div className="bg-white overflow-hidden scroll-smooth">
            <Helmet>
                <title>Raja Cimenyan Rental - Rental Mobil & Gendongan Bandung Terpercaya</title>
                <meta name="description" content="Pusat sewa mobil Bandung & jasa rental gendongan (nebeng) antarkota. Raja Cimenyan Rental menyediakan Innova, Avanza, Xpander dengan harga termurah di Cimenyan." />
                <meta name="keywords" content="rental mobil di bandung, rental mobil, rental gendongan, rental bandung, rental cimenyan, sewa mobil bandung, rental mobil murah, raja cimenyan rental" />
            </Helmet>

            {/* Hero Section - Premium Overhaul inspired by reference */}
            <section className="relative min-h-[600px] lg:h-[90vh] flex items-center overflow-hidden bg-white mt-24">
                {/* Background Shapes - Left White, Middle Blue Diagonals */}
                <div className="absolute inset-0 z-0">
                    {/* Dark Blue Diagonal */}
                    <div className="absolute top-0 right-0 w-[60%] h-full bg-slate-900 -skew-x-[15deg] translate-x-32 hidden lg:block"></div>
                    {/* Light Blue Diagonal Overlay */}
                    <div className="absolute top-0 right-0 w-[55%] h-full bg-emerald-600/10 -skew-x-[15deg] translate-x-20 hidden lg:block border-l-8 border-emerald-500"></div>

                    {/* Mobile Background */}
                    <div className="lg:hidden absolute inset-0 bg-slate-900 opacity-90"></div>
                </div>

                {/* Car Image on the Right */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-full lg:w-[55%] h-[400px] lg:h-[550px] z-10 select-none">
                    <img
                        src="/banner-hero.png"
                        alt="RCR Premium Car"
                        className="w-full h-full object-contain object-right lg:object-center drop-shadow-[0_35px_35px_rgba(0,0,0,0.5)]"
                    />
                </div>

                <div className="max-w-7xl mx-auto px-6 w-full relative z-20">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 shadow-lg shadow-emerald-600/20">
                                <Car size={16} /> Sewa Mobil & Travel Bandung
                            </div>
                            <h1 className="text-6xl lg:text-7xl xl:text-8xl font-black text-white lg:text-slate-900 leading-[0.85] mb-6 tracking-tighter uppercase italic">
                                RAJA <br />
                                <span className="text-emerald-500 lg:text-emerald-600 drop-shadow-sm">CIMENYAN</span><br />
                                <span className="text-white lg:text-slate-900">RENTAL</span>
                            </h1>
                            <p className="hidden lg:block text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-8 border-l-4 border-emerald-500 pl-4 h-10 flex items-center">
                                Solusi Transportasi Premium <br /> Berkelas & Terpercaya
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 relative z-50">
                                <Link
                                    to="/sewa-mobil"
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-black text-lg shadow-xl shadow-emerald-600/30 transition-all hover:scale-105 flex items-center justify-center gap-3 active:scale-95"
                                >
                                    BOOKING SEWA <ChevronRight size={20} />
                                </Link>
                                <a
                                    href={`https://wa.me/${adminWhatsApp}`}
                                    className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-xl font-black text-lg transition-all flex items-center justify-center gap-3 shadow-2xl shadow-slate-900/20 active:scale-95"
                                >
                                    ADMIN WHATSAPP
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Social Media Vertical Sidebar - Adjusted positioning to prevent cutting */}
                <div className="absolute left-4 bottom-32 hidden xl:flex flex-col gap-4 z-50">
                    <a href="#" className="w-12 h-12 bg-white/10 hover:bg-pink-600 text-white rounded-full flex items-center justify-center transition-all border border-white/10 backdrop-blur-md group">
                        <Star size={20} className="group-hover:scale-110 transition-transform" />
                    </a>
                    <a href="#" className="w-12 h-12 bg-white/10 hover:bg-black text-white rounded-full flex items-center justify-center transition-all border border-white/10 backdrop-blur-md group">
                        <CheckCircle2 size={20} className="group-hover:scale-110 transition-transform" />
                    </a>
                    <a href="#" className="w-12 h-12 bg-white/10 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-all border border-white/10 backdrop-blur-md group">
                        <ShieldCheck size={20} className="group-hover:scale-110 transition-transform" />
                    </a>
                    <div className="w-px h-12 bg-white/20 mx-auto my-2"></div>
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] [writing-mode:vertical-lr] mx-auto pb-4">Follow Us</span>
                </div>

                {/* Info Bar at Bottom - Premium Glass Look - Shifted lower */}
                <div className="absolute bottom-4 right-4 lg:bottom-4 lg:right-4 xl:bottom-8 xl:right-12 bg-white/95 backdrop-blur-xl px-4 py-3 lg:px-12 lg:py-5 rounded-xl lg:rounded-[1.5rem] z-[60] flex items-center gap-4 lg:gap-8 shadow-2xl border border-slate-200">
                    <div className="flex items-center gap-4 lg:gap-6 border-r border-slate-200 pr-4 lg:pr-8">
                        <div className="w-8 h-8 lg:w-12 lg:h-12 bg-emerald-600 text-white rounded-lg lg:rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/30">
                            <Phone size={18} className="lg:hidden" />
                            <Phone size={24} className="hidden lg:block" />
                        </div>
                        <div className="flex flex-col gap-0.5 lg:flex-row lg:gap-8">
                            {/* Simplified for mobile to prevent overflow */}
                            <div className="hidden lg:block">
                                <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">Admin Utama</p>
                                <p className="text-xs lg:text-base font-black tracking-tighter text-slate-900 whitespace-nowrap">0812-2445-2921</p>
                            </div>
                            <div className="lg:hidden">
                                <p className="text-[7px] font-black uppercase text-slate-400 leading-none">Admin</p>
                                <p className="text-xs font-black text-slate-900 whitespace-nowrap">0812-2445-2921</p>
                            </div>
                            <div className="hidden lg:block">
                                <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">Admin Kedua</p>
                                <p className="text-xs lg:text-base font-black tracking-tighter text-slate-900 whitespace-nowrap">0858-7520-3015</p>
                            </div>
                        </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-3">
                        <div className="w-8 h-8 lg:w-12 lg:h-12 bg-slate-100 text-slate-900 rounded-lg lg:rounded-xl flex items-center justify-center">
                            <Clock size={20} />
                        </div>
                        <div>
                            <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1 text-left">Status</p>
                            <p className="text-xs lg:text-base font-black tracking-tighter uppercase whitespace-nowrap text-emerald-600">Buka 24 Jam</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-white relative z-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-8 relative z-[70]">
                        <Link to="/sewa-mobil" className="group">
                            <motion.div
                                whileHover={{ y: -10 }}
                                className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-100 h-full flex flex-col justify-between overflow-hidden relative"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -z-0"></div>
                                <div>
                                    <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center mb-8 shadow-xl">
                                        <Car size={32} />
                                    </div>
                                    <h3 className="text-4xl font-black text-slate-900 mb-4 uppercase tracking-tighter">Sewa Mobil</h3>
                                    <p className="text-slate-500 font-medium mb-8">Penuhi kebutuhan transportasi dengan unit mobil pilihan terbaik di Cimenyan.</p>
                                </div>
                                <span className="inline-flex items-center gap-2 font-black text-emerald-600 uppercase tracking-widest text-sm">
                                    Lihat Armada <ChevronRight size={20} />
                                </span>
                            </motion.div>
                        </Link>

                        <Link to="/gendongan" className="group">
                            <motion.div
                                whileHover={{ y: -10 }}
                                className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-100 h-full flex flex-col justify-between overflow-hidden relative"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -z-0"></div>
                                <div>
                                    <div className="w-16 h-16 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-xl">
                                        <MapPin size={32} />
                                    </div>
                                    <h3 className="text-4xl font-black text-slate-900 mb-4 uppercase tracking-tighter">Tiket Travel</h3>
                                    <p className="text-slate-500 font-medium mb-8">Perjalanan antarkota lebih hemat dengan sistem tiket travel terjadwal.</p>
                                </div>
                                <span className="inline-flex items-center gap-2 font-black text-emerald-600 uppercase tracking-widest text-sm">
                                    Cek Jadwal <ChevronRight size={20} />
                                </span>
                            </motion.div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Why Us Section */}
            <section className="py-32 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-24">
                        <span className="text-emerald-600 font-black tracking-widest uppercase text-sm mb-4 block">Keunggulan Kami</span>
                        <h2 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter">Mengapa Harus Raja Cimenyan?</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: <ShieldCheck size={40} />, title: "Keamanan Terjamin", desc: "Semua armada kami melalui pengecekan berkala dan diasuransikan untuk kenyamanan Anda." },
                            { icon: <Clock size={40} />, title: "Layanan 24 Jam", desc: "Admin kami siap melayani pemesanan dan bantuan teknis kapanpun Anda butuhkan." },
                            { icon: <Heart size={40} />, title: "Harga Terbaik", desc: "Komitmen kami memberikan harga paling kompetitif tanpa biaya tersembunyi." }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 hover:bg-emerald-50 transition-colors group"
                            >
                                <div className="text-emerald-600 mb-8 transition-transform group-hover:scale-110 duration-300">
                                    {item.icon}
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-4">{item.title}</h3>
                                <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Keyword Optimized Section (Area Layanan) */}
            <section className="py-32 bg-slate-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <h2 className="text-5xl lg:text-7xl font-black text-white mb-10 leading-tight tracking-tighter">
                                Pusat <span className="text-emerald-500">Rental Mobil</span> <br /> Bandung Timur
                            </h2>
                            <div className="space-y-8 text-slate-400 text-xl leading-relaxed">
                                <p>
                                    Berlokasi di <span className="text-white font-bold">Jl. Padasuka atas no 10 Cimenyan</span>, kami menjadi pilihan utama bagi warga Bandung yang membutuhkan <span className="text-emerald-400 font-bold italic">Rental Mobil di Bandung</span> dengan kualitas pelayanan premium.
                                </p>
                                <p>
                                    Tidak hanya penyewaan mobil harian, kami juga menyediakan layanan <span className="text-emerald-400 font-bold italic">Agen Tiket Travel</span> yang menghubungkan Bandung dengan berbagai kota besar. Partner perjalanan resmi Anda di <span className="text-white font-bold">Cimenyan Bandung</span>.
                                </p>
                            </div>

                            <div className="mt-12 flex flex-wrap gap-4">
                                <a href={`https://wa.me/${adminWhatsApp}`} className="bg-emerald-500 hover:bg-emerald-600 text-white px-10 py-5 rounded-full font-black text-lg transition-all flex items-center gap-3">
                                    <Phone size={24} /> HUBUNGI ADMIN
                                </a>
                                <Link to="/sewa-mobil" className="bg-white/10 hover:bg-white/20 text-white px-10 py-5 rounded-full font-black text-lg transition-all border border-white/20">
                                    LIHAT ARMADA
                                </Link>
                            </div>
                        </div>
                        <div className="relative">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                className="bg-emerald-600 rounded-[3rem] p-12 shadow-3xl shadow-emerald-500/20"
                            >
                                <h3 className="text-3xl font-black text-white mb-8">Informasi Kontak</h3>
                                <ul className="space-y-6 text-emerald-50 uppercase tracking-widest text-sm font-bold">
                                    <li className="flex items-start gap-4 border-b border-emerald-500/50 pb-6">
                                        <MapPin size={28} className="text-yellow-400 flex-shrink-0" />
                                        <span>Jl. Padasuka atas no 10 <br /> Cimenyan, Bandung</span>
                                    </li>
                                    <li className="flex items-center gap-4 border-b border-emerald-500/50 pb-6">
                                        <Phone size={28} className="text-yellow-400 flex-shrink-0" />
                                        <span>+62 813-9487-0313</span>
                                    </li>
                                    <li className="flex items-center gap-4">
                                        <Clock size={28} className="text-yellow-400 flex-shrink-0" />
                                        <span>BUKA 24 JAM SETIAP HARI</span>
                                    </li>
                                </ul>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            {testimonials.length > 0 && (
                <section className="py-32 bg-white">
                    <div className="max-w-7xl mx-auto px-6 text-center">
                        <h2 className="text-5xl font-black text-slate-900 mb-20 tracking-tighter">Kata Mereka</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {testimonials.map((t, i) => (
                                <div key={i} className="bg-slate-50 p-10 rounded-[2.5rem] text-left border border-slate-100 flex flex-col justify-between">
                                    <div>
                                        <div className="flex gap-1 mb-6 text-yellow-400">
                                            {[...Array(t.stars || 5)].map((_, j) => <Star key={j} size={20} fill="currentColor" />)}
                                        </div>
                                        <p className="text-slate-600 italic font-medium leading-relaxed mb-8">"{t.text}"</p>
                                    </div>
                                    <div className="flex items-center gap-4 mt-auto">
                                        <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xl uppercase">
                                            {t.name ? t.name[0] : 'U'}
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-900 leading-none mb-1">{t.name}</p>
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{t.role}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* FAQ Section */}
            <section className="py-32 bg-slate-50 border-t border-slate-200">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="flex items-center gap-3 justify-center mb-8 text-emerald-600">
                        <HelpCircle size={32} />
                        <h2 className="text-4xl font-black text-slate-900">Pertanyaan Umum</h2>
                    </div>
                    <div className="space-y-6">
                        {faqs.map((faq, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm"
                            >
                                <h4 className="text-xl font-black text-slate-900 mb-3">{faq.q}</h4>
                                <p className="text-slate-500 font-medium">{faq.a}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Final section */}
            <section className="bg-emerald-600 py-32 relative overflow-hidden text-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_white_0%,_transparent_70%)] opacity-10"></div>
                <div className="max-w-4xl mx-auto px-6 relative z-10">
                    <h2 className="text-5xl lg:text-7xl font-black text-white mb-8 tracking-tighter uppercase leading-[0.9]">Siap Melaju Bersama <br /> Raja Cimenyan?</h2>
                    <p className="text-emerald-50 text-xl font-medium mb-16 max-w-2xl mx-auto opacity-90 leading-relaxed">
                        Bergabunglah dengan ribuan pelanggan puas kami. Pesan sekarang dan rasakan pengalaman berkendara paling berkelas di Bandung.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link
                            to="/register"
                            className="bg-slate-900 border-2 border-slate-900 text-white px-12 py-6 rounded-full font-black text-xl transition-all shadow-2xl shadow-black/20 hover:scale-105"
                        >
                            DAFTAR JADI SOPIR
                        </Link>
                        <a
                            href={`https://wa.me/${adminWhatsApp2}`}
                            className="bg-white border-2 border-white text-emerald-600 px-12 py-6 rounded-full font-black text-xl transition-all shadow-2xl shadow-white/20 hover:scale-105"
                        >
                            CHAT ADMIN WA 2
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}

import { motion } from 'framer-motion';
import { MessageCircle, Calendar, Users, CheckCircle2, ShieldCheck, Headphones, Wallet } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Helmet } from 'react-helmet-async';

const INDONESIAN_CITIES = [
    "Ambon", "Balikpapan", "Banda Aceh", "Bandar Lampung", "Bandung", "Banjar", "Banjarbaru", "Banjarmasin", "Batam", "Batu", "Baubau", "Bekasi", "Bengkulu", "Bima", "Binjai", "Bitung", "Blitar", "Bogor", "Bontang", "Bukittinggi", "Cianjur", "Cilegon", "Cimahi", "Cirebon", "Denpasar", "Depok", "Dumai", "Garut", "Gorontalo", "Jakarta", "Jambi", "Jayapura", "Jember", "Kediri", "Kendari", "Klaten", "Kupang", "Lampung", "Lhokseumawe", "Madiun", "Magelang", "Makassar", "Malang", "Manado", "Mataram", "Medan", "Mojokerto", "Padang", "Palangka Raya", "Palembang", "Palu", "Pangkalpinang", "Pasuruan", "Pekalongan", "Pekanbaru", "Pontianak", "Prabumulih", "Probolinggo", "Purwokerto", "Salatiga", "Samarinda", "Semarang", "Serang", "Sidoarjo", "Singkawang", "Sorong", "Sukabumi", "Surabaya", "Surakarta (Solo)", "Tangerang", "Tangerang Selatan", "Tanjungpinang", "Tarakan", "Tasikmalaya", "Tegal", "Ternate", "Yogyakarta"
].sort();

export default function Gendongan() {
    const [trips, setTrips] = useState<any[]>([]);
    const [originCity, setOriginCity] = useState<string>('Semua');
    const [destinationCity, setDestinationCity] = useState<string>('Semua');
    const adminWhatsApp = "6281224452921";

    useEffect(() => {
        fetchTrips();
    }, []);

    const fetchTrips = async () => {
        const { data } = await supabase
            .from('trips')
            .select(`*, driver:drivers(name, mobil, foto_wajah, umur)`)
            .eq('status', 'Tersedia')
            .order('tanggal', { ascending: true });
        if (data) setTrips(data);
    };

    const filteredTrips = trips.filter(t => {
        const originMatch = originCity === 'Semua' || t.rute.split('-')[0]?.trim().toLowerCase() === originCity.toLowerCase();
        const destMatch = destinationCity === 'Semua' || t.rute.split('-')[1]?.trim().toLowerCase() === destinationCity.toLowerCase();
        return originMatch && destMatch;
    });

    return (
        <div className="bg-white min-h-screen">
            <Helmet>
                <title>Rental Gendongan Bandung - Jasa Nebeng & Travel Murah | Raja Cimenyan</title>
                <meta name="description" content="Cari jadwal rental gendongan (nebeng mobil) dari Bandung ke Jakarta atau antarkota lainnya. Hemat, aman, dan nyaman dengan layanan Raja Cimenyan Rental." />
                <meta name="keywords" content="rental gendongan, rental gendongan bandung, rental mobil bandung, nebeng mobil jakarta bandung, travel bandung murah" />
            </Helmet>
            {/* Hero Gendongan */}
            <section className="relative overflow-hidden pt-20 pb-20 bg-emerald-600 text-white shadow-lg text-center">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-emerald-800/50 backdrop-blur-md px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-emerald-400/30"
                    >
                        <CheckCircle2 size={14} className="text-yellow-400" /> Agen Travel & Transportasi Resmi
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-4xl lg:text-7xl font-black mb-6 leading-tight"
                    >
                        TRAVEL <span className="text-yellow-400">AGEN TIKET</span>
                    </motion.h1>
                    <p className="text-emerald-50 text-xl max-w-2xl mx-auto font-medium opacity-90">
                        Pesan tiket travel Bandung - Jakarta PP & Seluruh Indonesia. Pesan aman, nyaman, dan praktis melalui Agen Resmi Raja Cimenyan Rental.
                    </p>
                </div>
            </section>

            <section className="py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Filter Section */}
                    {trips.length > 0 && (
                        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20 max-w-2xl mx-auto">
                            <div className="bg-white p-3 rounded-3xl flex items-center w-full shadow-xl shadow-emerald-900/5 border border-emerald-100 flex-1">
                                <span className="px-4 text-xs font-bold text-emerald-800 uppercase tracking-widest">Dari</span>
                                <div className="relative flex-1">
                                    <select
                                        value={originCity}
                                        onChange={(e) => setOriginCity(e.target.value)}
                                        className="w-full bg-slate-50 border-0 text-slate-800 font-bold text-sm px-4 py-3 rounded-2xl cursor-pointer focus:ring-2 focus:ring-emerald-500 outline-none appearance-none"
                                    >
                                        <option value="Semua">Semua Kota</option>
                                        {Array.from(new Set([
                                            ...trips.map(t => t.rute.split('-')[0]?.trim()),
                                            ...INDONESIAN_CITIES
                                        ])).filter(Boolean).sort().map(city => (
                                            <option key={city} value={city}>{city}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="bg-white p-3 rounded-3xl flex items-center w-full shadow-xl shadow-emerald-900/5 border border-emerald-100 flex-1">
                                <span className="px-4 text-xs font-bold text-emerald-800 uppercase tracking-widest">Ke</span>
                                <div className="relative flex-1">
                                    <select
                                        value={destinationCity}
                                        onChange={(e) => setDestinationCity(e.target.value)}
                                        className="w-full bg-slate-50 border-0 text-slate-800 font-bold text-sm px-4 py-3 rounded-2xl cursor-pointer focus:ring-2 focus:ring-emerald-500 outline-none appearance-none"
                                    >
                                        <option value="Semua">Semua Kota</option>
                                        {Array.from(new Set([
                                            ...trips.map(t => {
                                                const parts = t.rute.split('-');
                                                return parts.length > 1 ? parts[1].trim() : '';
                                            }),
                                            ...INDONESIAN_CITIES
                                        ])).filter(Boolean).sort().map(city => (
                                            <option key={city} value={city}>{city}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {filteredTrips.length === 0 && (
                            <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                                <p className="text-xl font-bold text-slate-800">Ups! Jadwal Belum Ketemu</p>
                                <p className="text-sm text-slate-500 mt-1">Kami belum memiliki jadwal rute tersebut untuk saat ini.</p>
                            </div>
                        )}
                        {filteredTrips.map((trip) => (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                key={trip.id}
                                className="bg-white border-2 border-slate-50 rounded-[2.5rem] p-8 hover:border-emerald-200 hover:shadow-2xl hover:shadow-emerald-900/5 transition-all relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/5 rounded-bl-full -z-0 translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform"></div>

                                <div className="flex justify-between items-start mb-10 relative z-10">
                                    <span className="bg-slate-900 text-white font-black px-6 py-2.5 rounded-2xl text-base tracking-tight shadow-lg shadow-black/10">
                                        {trip.rute}
                                    </span>
                                    <div className="text-right">
                                        <span className="font-black text-emerald-600 text-3xl">
                                            Rp{trip.harga.toLocaleString('id-ID')}
                                        </span>
                                        <p className="text-slate-400 text-xs font-bold tracking-widest uppercase mt-1">per kursi</p>
                                    </div>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4 mb-10 relative z-10">
                                    <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-3xl">
                                        <div className="bg-white p-2.5 rounded-2xl shadow-sm text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                            <Calendar size={20} />
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-800 text-sm leading-none mb-1">{trip.tanggal}</p>
                                            <p className="text-xs text-slate-500 font-bold">{trip.jam} WIB</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-3xl">
                                        <div className="bg-white rounded-2xl shadow-sm overflow-hidden w-11 h-11 border-2 border-white flex-shrink-0">
                                            {trip.driver?.foto_wajah ? (
                                                <img src={trip.driver.foto_wajah} alt="Sopir" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                                                    {trip.driver?.name?.[0] || 'S'}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-800 text-sm leading-none mb-1 truncate w-24">{trip.driver?.name}</p>
                                            <p className="text-xs text-slate-400 font-bold">{trip.driver?.umur ? `${trip.driver.umur} Thn • ` : ''}{trip.driver?.mobil}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mb-8 relative z-10 px-2">
                                    <div className="flex items-center gap-2">
                                        <Users size={20} className="text-emerald-500" />
                                        <span className="font-black text-slate-800">{trip.kursi} Kursi Sisa</span>
                                    </div>
                                    <div className="h-1 flex-1 mx-6 bg-slate-100 rounded-full">
                                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '60%' }}></div>
                                    </div>
                                </div>

                                <a
                                    href={`https://wa.me/${adminWhatsApp}?text=Halo min, saya mau pesan tiket travel untuk jadwal: ${trip.rute} pada ${trip.tanggal} dengan sopir ${trip.driver?.name}.`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-3xl font-black text-lg transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-600/20 hover:-translate-y-1 active:scale-95 relative z-10"
                                >
                                    <MessageCircle size={24} strokeWidth={3} /> AMANKAN KURSI
                                </a>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Keunggulan Agen Section */}
            <section className="py-20 bg-white border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-12 text-center">
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                                <ShieldCheck size={32} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-3">Agen Resmi & Terpercaya</h3>
                            <p className="text-slate-500 font-medium leading-relaxed">Kami menjamin keamanan transaksi Anda. Tiket diterbitkan resmi oleh sistem Raja Cimenyan Rental.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                                <Wallet size={32} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-3">Harga Paling Hemat</h3>
                            <p className="text-slate-500 font-medium leading-relaxed">Dapatkan harga patungan yang jauh lebih murah dibanding travel konvensional lainnya.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                                <Headphones size={32} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-3">Layanan WA 24/7</h3>
                            <p className="text-slate-500 font-medium leading-relaxed">Admin kami siap melayani pemesanan tiket Anda kapan saja melalui nomor WhatsApp resmi.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

import { motion } from 'framer-motion';
import { MessageCircle, Fuel, Gauge, Settings2, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Helmet } from 'react-helmet-async';

export default function SewaMobil() {
    const [cars, setCars] = useState<any[]>([]);
    const adminWhatsApp = "6281224452921";

    useEffect(() => {
        fetchCars();
    }, []);

    const fetchCars = async () => {
        const { data } = await supabase
            .from('cars')
            .select('*')
            .eq('status', 'Tersedia')
            .order('created_at', { ascending: false });
        if (data) setCars(data);
    };

    return (
        <div className="bg-white">
            <Helmet>
                <title>Sewa Mobil Bandung Murah - Rental Mobil Lepas Kunci | Raja Cimenyan</title>
                <meta name="description" content="Sewa mobil murah di Bandung dengan unit terlengkap: Innova, Avanza, Xpander. Rental mobil harian, mingguan, atau bulanan di Cimenyan Bandung." />
                <meta name="keywords" content="rental mobil di bandung, rental mobil, sewa mobil bandung, rental mobil murah, sewa mobil lepas kunci bandung" />
            </Helmet>
            {/* Hero Sewa Mobil */}
            <section className="relative overflow-hidden pt-20 pb-20 bg-slate-900 text-white">
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl lg:text-6xl font-extrabold mb-6"
                    >
                        Sewa Mobil <span className="text-emerald-500">Full Day</span>
                    </motion.h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-6">
                        Pilih armada terbaik kami untuk menemani perjalanan bisnis atau liburan keluarga Anda di Bandung dan sekitarnya.
                    </p>
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 text-emerald-400 font-bold mb-8">
                        <MapPin size={20} /> Kantor: Jl. Padasuka atas no 10 Cimenyan
                    </div>
                </div>
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-20 -z-0"></div>
            </section>

            <section className="py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {cars.length === 0 && (
                            <div className="col-span-full text-center py-20 text-slate-500">
                                <p className="text-xl font-bold">Maaf, semua unit sedang disewa.</p>
                                <p className="mt-2 text-sm italic underline">Silakan cek kembali secara berkala.</p>
                            </div>
                        )}
                        {cars.map((car) => (
                            <motion.div
                                key={car.id}
                                whileHover={{ y: -8 }}
                                className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 transition-all group"
                            >
                                <div className="relative h-48 mb-6 rounded-2xl overflow-hidden bg-slate-100">
                                    <img
                                        src={car.image_url || `https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=1000&auto=format&fit=crop`}
                                        alt={car.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-md">
                                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                            Tersedia
                                        </span>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <div className="flex flex-col gap-1 mb-4">
                                        <h3 className="text-xl font-black text-slate-900 leading-tight">{car.name}</h3>
                                        <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">{car.brand}</p>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
                                        <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Harga Sewa</span>
                                        <div className="text-right flex items-baseline gap-1">
                                            <span className="text-emerald-600 font-black text-sm">Rp</span>
                                            <span className="text-2xl font-black text-emerald-600 tracking-tighter">{car.price}</span>
                                            <span className="text-slate-400 text-[10px] font-bold uppercase ml-0.5">/Hari</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4 mb-8">
                                    <div className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-xl text-slate-600 text-xs font-bold">
                                        <Gauge size={18} className="mb-1 text-emerald-600" /> {car.transmission || 'Manual'}
                                    </div>
                                    <div className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-xl text-slate-600 text-xs font-bold">
                                        <Fuel size={18} className="mb-1 text-emerald-600" /> {car.fuel_type || 'Bensin'}
                                    </div>
                                    <div className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-xl text-slate-600 text-xs font-bold">
                                        <Settings2 size={18} className="mb-1 text-emerald-600" /> {car.seats || 5} Kursi
                                    </div>
                                </div>

                                <a
                                    href={`https://wa.me/${adminWhatsApp}?text=Halo admin, saya ingin sewa mobil ${car.name} (Plat ${car.plate}) sehari penuh.`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-full bg-slate-900 hover:bg-emerald-600 text-white py-4 rounded-xl font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200"
                                >
                                    Pesan Sewa via WA <MessageCircle size={18} />
                                </a>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

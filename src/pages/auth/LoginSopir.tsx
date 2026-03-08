import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { ShieldCheck, Clock, Disc } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginSopir() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        // Driver check
        if (data.user?.email === 'adminrental@gmail.com') {
            navigate('/admin');
        } else {
            navigate('/sopir');
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 lg:p-8 relative overflow-hidden font-sans">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-600/10 -skew-x-12 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2"></div>

            <div className="max-w-5xl w-full grid lg:grid-cols-2 bg-white/10 backdrop-blur-md rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl relative z-10">
                {/* Visual Section */}
                <div className="p-12 lg:p-16 bg-gradient-to-br from-emerald-600 to-emerald-800 text-white flex flex-col justify-between">
                    <div>
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-10 shadow-xl backdrop-blur-md border border-white/20">
                            <ShieldCheck size={32} />
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-black mb-6 leading-tight uppercase tracking-tighter">PORTAL KHUSUS <br /><span className="text-emerald-300">PARTNER SOPIR</span></h1>
                        <p className="text-emerald-50 text-xl font-medium opacity-80 leading-relaxed mb-8">
                            Halaman ini khusus untuk partner sopir Raja Cimenyan Rental dalam menginput jadwal keberangkatan atau mengelola trip.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-white/10 rounded-lg"><Clock size={20} /></div>
                                <span className="font-bold text-sm uppercase tracking-widest">Update Jadwal 24/7</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-white/10 rounded-lg"><Disc size={20} /></div>
                                <span className="font-bold text-sm uppercase tracking-widest">Kelola Kendaraan Anda</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 text-sm text-emerald-200/60 font-medium">
                        © 2026 Raja Cimenyan Rental System
                    </div>
                </div>

                {/* Form Section */}
                <div className="bg-white p-12 lg:p-20 flex flex-col justify-center">
                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">SELAMAT DATANG!</h2>
                        <p className="text-slate-500 font-medium">Silahkan masuk menggunakan akun partner Anda.</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleLogin}>
                        {error && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-black border border-red-100 uppercase tracking-tight">
                                {error}
                            </motion.div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Partner</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:bg-white focus:border-emerald-500 outline-none font-bold text-slate-900 transition-all"
                                placeholder="nama@email.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">KATA SANDI</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:bg-white focus:border-emerald-500 outline-none font-bold text-slate-900 transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="group w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-[2rem] py-5 font-black text-xl shadow-xl shadow-emerald-600/20 transition-all hover:scale-[1.02]"
                            >
                                {loading ? 'MENGECEK DATA...' : 'MASUK KE DASHBOARD'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-slate-400 text-sm font-bold">Belum terdaftar jadi partner?</p>
                        <Link to="/register" className="text-emerald-600 font-black text-sm uppercase tracking-widest hover:text-emerald-700 transition-colors underline underline-offset-4">
                            DAFTAR SEKARANG
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { useState, useEffect } from 'react';
import { MapPin, Clock, Plus, X, Trash2, Edit2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function SopirDashboard() {
    const [driverInfo, setDriverInfo] = useState<any>(null);
    const [trips, setTrips] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [showForm, setShowForm] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        rute: '', tanggal: '', jam: '', kursi: 4, harga: 0, status: 'Tersedia'
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // Get logged-in user
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Fetch driver profile
            const { data: driverData, error: driverError } = await supabase
                .from('drivers')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (driverError || !driverData) {
                console.error("Gagal memuat profil sopir:", driverError);
                return;
            }

            setDriverInfo(driverData);

            // Fetch driver trips
            const { data: tripsData } = await supabase
                .from('trips')
                .select('*')
                .eq('driver_id', driverData.id)
                .order('tanggal', { ascending: true })
                .order('jam', { ascending: true });

            if (tripsData) {
                setTrips(tripsData);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTrip = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);

        if (editingId) {
            const { error } = await supabase.from('trips').update(formData).eq('id', editingId);
            if (error) {
                alert('Gagal mengupdate jadwal. Silakan coba lagi.');
            } else {
                resetForm();
                fetchDashboardData();
            }
        } else {
            const newTrip = {
                ...formData,
                driver_id: driverInfo.id
            };

            const { error } = await supabase.from('trips').insert([newTrip]);

            if (error) {
                alert('Gagal menambah jadwal. Silakan coba lagi.');
            } else {
                resetForm();
                fetchDashboardData();
            }
        }
        setFormLoading(false);
    };

    const handleEditTrip = (trip: any) => {
        setFormData({
            rute: trip.rute,
            tanggal: trip.tanggal,
            jam: trip.jam,
            kursi: trip.kursi,
            harga: trip.harga,
            status: trip.status
        });
        setEditingId(trip.id);
        setShowForm(true);
    };

    const resetForm = () => {
        setShowForm(false);
        setEditingId(null);
        setFormData({ rute: '', tanggal: '', jam: '', kursi: 4, harga: 0, status: 'Tersedia' });
    };

    const handleDeleteTrip = async (id: string) => {
        if (confirm('Yakin ingin membatalkan dan menghapus jadwal keberangkatan ini?')) {
            await supabase.from('trips').delete().eq('id', id);
            fetchDashboardData();
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-slate-500 font-medium animate-pulse">Memuat Dasbor Anda...</div>;
    }

    if (!driverInfo) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-xl font-bold text-slate-800">Profil tidak ditemukan</h2>
                <p className="text-slate-500 mt-2">Gagal memuat data profil sopir Anda. Pastikan Anda telah terdaftar sebagai sopir.</p>
            </div>
        );
    }

    // Pisahkan jadwal aktif (mendatang) dan riwayat (selesai/batal)
    const upcomingTrips = trips.filter(t => t.status === 'Tersedia' || t.status === 'Penuh');


    // Ambil jadwal yang paling dekat
    const nextTrip = upcomingTrips.length > 0 ? upcomingTrips[0] : null;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Halo, {driverInfo.name || 'Sopir'}</h2>
                    <p className="text-sm text-slate-500">{driverInfo.mobil} • {driverInfo.plat}</p>
                </div>
                {driverInfo.foto_wajah && (
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-emerald-100 shadow-sm">
                        <img src={driverInfo.foto_wajah} alt="Profil" className="w-full h-full object-cover" />
                    </div>
                )}
            </div>

            {/* Status Perjalanan Berikutnya (Highlight) */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Status Perjalanan Anda Berikutnya</h3>

                {nextTrip ? (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-emerald-50 border border-emerald-100 rounded-xl gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-white text-emerald-600 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                                <MapPin size={26} strokeWidth={2.5} />
                            </div>
                            <div>
                                <p className="font-bold text-slate-800 text-lg">{nextTrip.rute}</p>
                                <p className="text-sm font-medium text-slate-600">{nextTrip.tanggal} • {nextTrip.jam} WIB</p>
                            </div>
                        </div>
                        <div className="sm:text-right flex flex-col items-start sm:items-end w-full sm:w-auto">
                            <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-bold mb-1 ${nextTrip.status === 'Tersedia' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                                {nextTrip.status === 'Tersedia' ? 'Menunggu Penumpang' : 'Kursi Penuh'}
                            </span>
                            <div className="flex justify-between w-full sm:w-auto gap-4 mt-2 sm:mt-0 items-center">
                                <p className="text-sm font-bold text-emerald-700 bg-white px-3 py-1 rounded-lg">Rp {nextTrip.harga.toLocaleString('id-ID')} / kursi</p>
                                <p className="text-xs font-bold text-slate-700">{nextTrip.kursi} Kursi</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center p-6 bg-slate-50 rounded-xl border border-slate-100 border-dashed">
                        <p className="text-slate-500 font-medium">Brak! Jadwal Anda kosong lompong.</p>
                        <p className="text-xs text-slate-400 mt-1">Tambahkan jadwal baru di bawah agar admin bisa mempromosikannya.</p>
                    </div>
                )}
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Riwayat / Daftar Seluruh Jadwal */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Clock size={20} className="text-slate-400" />
                        Daftar Jadwal Anda
                    </h3>

                    {trips.length > 0 ? (
                        <div className="space-y-4 flex-1 overflow-y-auto max-h-[400px] pr-2 w-scrollbar-hidden">
                            {trips.map(trip => (
                                <div key={trip.id} className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 flex justify-between items-center group">
                                    <div>
                                        <p className="font-bold text-slate-800 text-sm">{trip.rute}</p>
                                        <p className="text-xs text-slate-500">{trip.tanggal} • {trip.jam}</p>
                                        <span className={`mt-2 inline-block px-2 py-0.5 rounded text-[10px] font-bold ${trip.status === 'Tersedia' ? 'bg-blue-100 text-blue-700' :
                                            trip.status === 'Selesai' ? 'bg-emerald-100 text-emerald-700' :
                                                trip.status === 'Penuh' ? 'bg-purple-100 text-purple-700' :
                                                    'bg-red-100 text-red-700'
                                            }`}>
                                            {trip.status}
                                        </span>
                                    </div>
                                    <div className="flex bg-white rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-sm border border-slate-100 overflow-hidden">
                                        <button
                                            onClick={() => handleEditTrip(trip)}
                                            className="text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 p-2 transition-all"
                                            title="Edit Jadwal"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <div className="w-px bg-slate-100"></div>
                                        <button
                                            onClick={() => handleDeleteTrip(trip.id)}
                                            className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 transition-all"
                                            title="Hapus Jadwal"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                            <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-4">
                                <Clock size={32} />
                            </div>
                            <h4 className="text-md font-bold text-slate-800 mb-2">Riwayat Kosong</h4>
                            <p className="text-xs text-slate-500 max-w-xs">Anda belum pernah membuat jadwal. Segera daftarkan kursi kosong kendaraan Anda.</p>
                        </div>
                    )}
                </div>

                {/* Form Input Jadwal */}
                <div className="bg-emerald-600 p-6 rounded-2xl shadow-lg relative overflow-hidden">
                    {/* Decorative Background */}
                    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white opacity-10"></div>
                    <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 rounded-full bg-white opacity-10"></div>

                    <h3 className="text-xl font-bold text-white mb-2 relative z-10">Input Jadwal Kosong</h3>
                    <p className="text-emerald-100 text-sm mb-6 relative z-10 leading-relaxed">Punya rencana meluncur ke luar kota dengan kursi kosong? Izinkan admin menjual tiket *nebeng* untuk Anda sekarang!</p>

                    {!showForm ? (
                        <button
                            onClick={() => setShowForm(true)}
                            className="w-full py-4 bg-white text-emerald-700 font-bold rounded-xl shadow-sm hover:scale-[1.02] hover:shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 relative z-10"
                        >
                            <Plus size={20} /> Buat Jadwal Keberangkatan
                        </button>
                    ) : (
                        <div className="bg-white rounded-xl p-5 relative z-10">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="font-bold text-slate-800">{editingId ? 'Edit Jadwal' : 'Detail Jadwal Baru'}</h4>
                                <button onClick={resetForm} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                            </div>

                            <form onSubmit={handleAddTrip} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Cth: Jakarta - Bandung</label>
                                    <input required type="text" placeholder="Rute Keberangkatan" value={formData.rute} onChange={e => setFormData({ ...formData, rute: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1">Tanggal</label>
                                        <input required type="date" value={formData.tanggal} onChange={e => setFormData({ ...formData, tanggal: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1">Jam (WIB)</label>
                                        <input required type="time" value={formData.jam} onChange={e => setFormData({ ...formData, jam: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1">Kursi Sisa</label>
                                        <input required type="number" min="1" max="15" value={formData.kursi} onChange={e => setFormData({ ...formData, kursi: Number(e.target.value) })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1">Harga (Rp) / Kursi</label>
                                        <input required type="number" value={formData.harga} onChange={e => setFormData({ ...formData, harga: Number(e.target.value) })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500" />
                                    </div>
                                </div>
                                {editingId && (
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1">Status Perjalanan</label>
                                        <select required value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500">
                                            <option value="Tersedia">Tersedia (Menunggu Penumpang)</option>
                                            <option value="Penuh">Penuh (Kursi Terisi Full)</option>
                                            <option value="Selesai">Selesai (Trip Berakhir)</option>
                                            <option value="Batal">Batal (Trip Gagal)</option>
                                        </select>
                                    </div>
                                )}

                                <button type="submit" disabled={formLoading} className="w-full mt-2 bg-emerald-600 text-white font-bold rounded-lg py-2.5 hover:bg-emerald-700 transition-colors disabled:opacity-50">
                                    {formLoading ? 'Menyimpan...' : (editingId ? 'Simpan Perubahan' : 'Kirim Jadwal ke Admin')}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

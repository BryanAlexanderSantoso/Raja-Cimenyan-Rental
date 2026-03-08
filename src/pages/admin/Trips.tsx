import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import ConfirmDialog from '../../components/ConfirmDialog';

export default function Trips() {
    const [trips, setTrips] = useState<any[]>([]);
    const [drivers, setDrivers] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: '' });

    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        driver_id: '', rute: '', tanggal: '', jam: '', kursi: 4, harga: 0, status: 'Tersedia'
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        // Menarik trip berserta relation ke nama sopirnya
        const { data: tripData } = await supabase.from('trips').select(`
      *,
      driver:drivers(name, mobil)
    `).order('created_at', { ascending: false });

        if (tripData) setTrips(tripData);

        const { data: driverData } = await supabase.from('drivers').select('id, name, mobil');
        if (driverData) setDrivers(driverData);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (editingId) {
            const { error } = await supabase.from('trips').update(formData).eq('id', editingId);
            if (!error) {
                setShowForm(false);
                fetchData();
            }
        } else {
            const { error } = await supabase.from('trips').insert([formData]);
            if (!error) {
                setShowForm(false);
                fetchData();
            } else {
                alert("Gagal menyimpan jadwal trip.");
            }
        }
        setLoading(false);
    };

    const handleEdit = (trip: any) => {
        setFormData({
            driver_id: trip.driver_id,
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

    const handleDelete = async (id: string) => {
        await supabase.from('trips').delete().eq('id', id);
        fetchData();
    };

    const resetForm = () => {
        setFormData({ driver_id: '', rute: '', tanggal: '', jam: '', kursi: 4, harga: 0, status: 'Tersedia' });
        setEditingId(null);
        setShowForm(false);
    };

    const filteredTrips = trips.filter(t =>
        t.rute?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.driver?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <h2 className="text-2xl font-bold text-slate-800">Manajemen Jadwal Gendongan</h2>
                <button onClick={() => { resetForm(); setShowForm(true); }} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
                    <Plus size={18} /> Tambah Jadwal Keberangkatan
                </button>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">{editingId ? 'Edit Jadwal' : 'Tambah Jadwal'}</h3>
                            <button onClick={resetForm} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Pilih Partner Sopir</label>
                                <select required value={formData.driver_id} onChange={e => setFormData({ ...formData, driver_id: e.target.value })} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2">
                                    <option value="" disabled>-- Pilih Sopir --</option>
                                    {drivers.map(d => (
                                        <option key={d.id} value={d.id}>{d.name} ({d.mobil})</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Rute Gendongan</label>
                                <input required type="text" value={formData.rute} onChange={e => setFormData({ ...formData, rute: e.target.value })} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2" placeholder="Jakarta - Bandung" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Tanggal Jalan</label>
                                    <input required type="date" value={formData.tanggal} onChange={e => setFormData({ ...formData, tanggal: e.target.value })} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Jam (WIB)</label>
                                    <input required type="time" value={formData.jam} onChange={e => setFormData({ ...formData, jam: e.target.value })} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Jumlah Kursi Tersedia</label>
                                    <input required type="number" min="1" max="15" value={formData.kursi} onChange={e => setFormData({ ...formData, kursi: Number(e.target.value) })} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Harga per Kursi</label>
                                    <input required type="number" value={formData.harga} onChange={e => setFormData({ ...formData, harga: Number(e.target.value) })} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Status</label>
                                <select required value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2">
                                    <option value="Tersedia">Tersedia</option>
                                    <option value="Penuh">Penuh</option>
                                    <option value="Selesai">Selesai</option>
                                    <option value="Batal">Batal</option>
                                </select>
                            </div>
                            <button type="submit" disabled={loading} className="w-full bg-emerald-600 text-white rounded-lg py-3 font-bold hover:bg-emerald-700 mt-4 disabled:opacity-50 transition-colors">
                                {loading ? 'Menyimpan...' : 'Simpan Jadwal'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Cari rute atau nama sopir..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4">Sopir & Mobil</th>
                                <th className="px-6 py-4">Rute & Waktu</th>
                                <th className="px-6 py-4 text-center">Kursi</th>
                                <th className="px-6 py-4 text-right">Harga / Kursi</th>
                                <th className="px-6 py-4 text-right">Potensi Komisi (20%)</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredTrips.map((trip) => (
                                <tr key={trip.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-slate-800">{trip.driver?.name || 'Sopir Dihapus'}</p>
                                        <p className="text-xs text-slate-500">{trip.driver?.mobil}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-slate-800">{trip.rute}</p>
                                        <p className="text-xs text-slate-500">{trip.tanggal} • {trip.jam}</p>
                                    </td>
                                    <td className="px-6 py-4 text-center font-bold text-slate-800">{trip.kursi}</td>
                                    <td className="px-6 py-4 text-right font-medium">Rp {trip.harga.toLocaleString('id-ID')}</td>
                                    <td className="px-6 py-4 text-right font-bold text-emerald-600">
                                        {/* Hitung Manual Komisi 20% apabila semua kursi di rent */}
                                        Rp {((trip.harga * trip.kursi) * 0.2).toLocaleString('id-ID')}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${trip.status === 'Tersedia' ? 'bg-blue-100 text-blue-700' :
                                            trip.status === 'Selesai' ? 'bg-emerald-100 text-emerald-700' :
                                                trip.status === 'Penuh' ? 'bg-purple-100 text-purple-700' :
                                                    'bg-red-100 text-red-700'
                                            }`}>
                                            {trip.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => handleEdit(trip)} className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"><Edit2 size={16} /></button>
                                            <button onClick={() => setConfirmModal({ isOpen: true, id: trip.id })} className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredTrips.length === 0 && (
                                <tr><td colSpan={7} className="px-6 py-8 text-center text-slate-500">Belum ada jadwal keberangkatan.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <ConfirmDialog
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false, id: '' })}
                onConfirm={() => handleDelete(confirmModal.id)}
                title="Hapus Jadwal Trip?"
                message="Jadwal keberangkatan ini akan dibatalkan dan dihapus permanen dari sistem."
            />
        </div>
    );
}

import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import ConfirmDialog from '../../components/ConfirmDialog';

export default function Drivers() {
    const [drivers, setDrivers] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: '' });

    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '', phone: '', rute_awal: '', mobil: '', plat: '', umur: 0, foto_wajah: ''
    });

    useEffect(() => {
        fetchDrivers();
    }, []);

    const fetchDrivers = async () => {
        const { data, error } = await supabase.from('drivers').select('*').order('created_at', { ascending: false });
        if (!error && data) setDrivers(data);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (editingId) {
            const { error } = await supabase.from('drivers').update(formData).eq('id', editingId);
            if (!error) {
                setShowForm(false);
                fetchDrivers();
            }
        } else {
            const { error } = await supabase.from('drivers').insert([formData]);
            if (!error) {
                setShowForm(false);
                fetchDrivers();
            } else {
                alert("Gagal menyimpan data sopir.");
            }
        }
        setLoading(false);
    };

    const handleEdit = (driver: any) => {
        setFormData({
            name: driver.name,
            phone: driver.phone,
            rute_awal: driver.rute_awal,
            mobil: driver.mobil,
            plat: driver.plat,
            umur: driver.umur || 0,
            foto_wajah: driver.foto_wajah || ''
        });
        setEditingId(driver.id);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        await supabase.from('drivers').delete().eq('id', id);
        fetchDrivers();
    };

    const resetForm = () => {
        setFormData({ name: '', phone: '', rute_awal: '', mobil: '', plat: '', umur: 0, foto_wajah: '' });
        setEditingId(null);
        setShowForm(false);
    };

    const filteredDrivers = drivers.filter(d =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.phone.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <h2 className="text-2xl font-bold text-slate-800">Daftar Partner Sopir Gendongan</h2>
                <button onClick={() => { resetForm(); setShowForm(true); }} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
                    <Plus size={18} /> Daftarkan Sopir
                </button>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">{editingId ? 'Edit Sopir' : 'Daftarkan Sopir'}</h3>
                            <button onClick={resetForm} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Nama Lengkap Sopir</label>
                                <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2" placeholder="Kang Dadan" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">No WhatsApp</label>
                                <input required type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2" placeholder="081234567890" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Dominan Rute</label>
                                <input type="text" value={formData.rute_awal} onChange={e => setFormData({ ...formData, rute_awal: e.target.value })} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2" placeholder="Jakarta - Bandung" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Mobil / Kendaraan</label>
                                <input required type="text" value={formData.mobil} onChange={e => setFormData({ ...formData, mobil: e.target.value })} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2" placeholder="Toyota Innova Reborn" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Plat Nomor</label>
                                    <input required type="text" value={formData.plat} onChange={e => setFormData({ ...formData, plat: e.target.value })} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2" placeholder="D 1234 ABC" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Umur</label>
                                    <input required type="number" value={formData.umur} onChange={e => setFormData({ ...formData, umur: Number(e.target.value) })} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2" placeholder="30" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">URL Foto Wajah</label>
                                <input type="text" value={formData.foto_wajah} onChange={e => setFormData({ ...formData, foto_wajah: e.target.value })} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2" placeholder="https://..." />
                            </div>
                            <button type="submit" disabled={loading} className="w-full bg-emerald-600 text-white rounded-lg py-3 font-bold hover:bg-emerald-700 mt-4 disabled:opacity-50 transition-colors">
                                {loading ? 'Menyimpan...' : 'Simpan Sopir'}
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
                            placeholder="Cari nama atau telepon..."
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
                                <th className="px-6 py-4">Nama Sopir</th>
                                <th className="px-6 py-4">Nomor WhatsApp</th>
                                <th className="px-6 py-4">Dominan Rute</th>
                                <th className="px-6 py-4">Kendaraan</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredDrivers.map((driver) => (
                                <tr key={driver.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 flex items-center gap-4 border-b-0">
                                        {driver.foto_wajah ? (
                                            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-200">
                                                <img src={driver.foto_wajah} alt="Wajah" className="w-full h-full object-cover" />
                                            </div>
                                        ) : (
                                            <div className="w-12 h-12 rounded-full font-bold bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                                                {driver.name[0]}
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-bold text-slate-800">{driver.name}</p>
                                            {driver.umur ? <p className="text-xs text-slate-500">{driver.umur} Tahun</p> : null}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <a href={`https://wa.me/${driver.phone}`} target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline">
                                            {driver.phone}
                                        </a>
                                    </td>
                                    <td className="px-6 py-4 font-medium">{driver.rute_awal}</td>
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-slate-800">{driver.mobil}</p>
                                        <p className="text-xs text-slate-500 font-mono">{driver.plat}</p>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => handleEdit(driver)} className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"><Edit2 size={16} /></button>
                                            <button onClick={() => setConfirmModal({ isOpen: true, id: driver.id })} className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredDrivers.length === 0 && (
                                <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">Belum ada partner sopir teregistrasi.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <ConfirmDialog
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false, id: '' })}
                onConfirm={() => handleDelete(confirmModal.id)}
                title="Hapus Partner Sopir?"
                message="Menghapus sopir ini juga akan menghapus seluruh jadwal perjalanan (trip) yang terkait."
            />
        </div>
    );
}

import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import ConfirmDialog from '../../components/ConfirmDialog';

export default function Cars() {
    const [cars, setCars] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: '' });

    // Form State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        plate: '',
        price: '',
        status: 'Tersedia',
        image_url: '',
        transmission: 'Manual',
        fuel_type: 'Bensin',
        seats: 5
    });

    useEffect(() => {
        fetchCars();
    }, []);

    const fetchCars = async () => {
        const { data, error } = await supabase.from('cars').select('*').order('created_at', { ascending: false });
        if (!error && data) setCars(data);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `mobil/${fileName}`;

        setUploadingImage(true);

        try {
            const { error: uploadError } = await supabase.storage
                .from('cars')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('cars')
                .getPublicUrl(filePath);

            setFormData((prev: any) => ({ ...prev, image_url: publicUrl }));
        } catch (error) {
            alert('Gagal mengunggah foto mobil. Pastikan bucket "cars" sudah ada dan public di Supabase.');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (editingId) {
            const { error } = await supabase.from('cars').update(formData).eq('id', editingId);
            if (!error) {
                setShowForm(false);
                fetchCars();
            }
        } else {
            const { error } = await supabase.from('cars').insert([formData]);
            if (!error) {
                setShowForm(false);
                fetchCars();
            } else {
                alert("Error: Pastikan Plat Nomor unik dan format benar.");
            }
        }
        setLoading(false);
    };

    const handleEdit = (car: any) => {
        setFormData({
            name: car.name,
            brand: car.brand,
            plate: car.plate,
            price: car.price,
            status: car.status,
            image_url: car.image_url || '',
            transmission: car.transmission || 'Manual',
            fuel_type: car.fuel_type || 'Bensin',
            seats: car.seats || 5
        });
        setEditingId(car.id);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        await supabase.from('cars').delete().eq('id', id);
        fetchCars();
    };

    const resetForm = () => {
        setFormData({
            name: '',
            brand: '',
            plate: '',
            price: '',
            status: 'Tersedia',
            image_url: '',
            transmission: 'Manual',
            fuel_type: 'Bensin',
            seats: 5
        });
        setEditingId(null);
        setShowForm(false);
    };

    const filteredCars = cars.filter((c: any) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.plate.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <h2 className="text-2xl font-bold text-slate-800">Koleksi Mobil Sewa</h2>
                <button onClick={() => { resetForm(); setShowForm(true); }} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
                    <Plus size={18} /> Tambah Mobil
                </button>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto w-scrollbar-hidden">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">{editingId ? 'Edit Mobil' : 'Tambah Mobil'}</h3>
                            <button onClick={resetForm} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Nama Mobil</label>
                                <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2" placeholder="Toyota Innova Zenix" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Merek</label>
                                <input required type="text" value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2" placeholder="Toyota" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Plat Nomor</label>
                                <input required type="text" value={formData.plate} onChange={e => setFormData({ ...formData, plate: e.target.value })} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2" placeholder="D 1234 ABC" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Harga per Hari (Contoh: 350.000 atau Nego)</label>
                                <input required type="text" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2" placeholder="350.000" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Transmisi</label>
                                    <select value={formData.transmission} onChange={e => setFormData({ ...formData, transmission: e.target.value })} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2">
                                        <option value="Manual">Manual</option>
                                        <option value="Matic">Matic</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Bahan Bakar</label>
                                    <select value={formData.fuel_type} onChange={e => setFormData({ ...formData, fuel_type: e.target.value })} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2">
                                        <option value="Bensin">Bensin</option>
                                        <option value="Solar">Solar</option>
                                        <option value="Listrik">Listrik</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Jumlah Kursi</label>
                                <input required type="number" value={formData.seats} onChange={e => setFormData({ ...formData, seats: Number(e.target.value) })} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2" placeholder="5" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Status</label>
                                <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2">
                                    <option value="Tersedia">Tersedia</option>
                                    <option value="Disewa">Disewa</option>
                                    <option value="Perawatan">Perawatan</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Foto Mobil (Opsional)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    disabled={uploadingImage}
                                    className="mt-1 w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                                />
                                {uploadingImage && <p className="text-xs text-slate-500 mt-1">Mengunggah Foto...</p>}
                                {formData.image_url && (
                                    <div className="mt-2 border border-slate-200 rounded-lg overflow-hidden h-32 w-full">
                                        <img src={formData.image_url} alt="Mobil" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                            <button type="submit" disabled={loading || uploadingImage} className="w-full bg-emerald-600 text-white rounded-lg py-3 font-bold hover:bg-emerald-700 disabled:opacity-50 mt-4 transition-colors">
                                {loading ? 'Menyimpan...' : 'Simpan Mobil'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Cari berdasarkan nama atau plat..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4">Mobil</th>
                                <th className="px-6 py-4">Plat</th>
                                <th className="px-6 py-4">Tarif</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredCars.map((car: any) => (
                                <tr key={car.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 flex items-center gap-4">
                                        {car.image_url ? (
                                            <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                                                <img src={car.image_url} alt={car.name} className="w-full h-full object-cover" />
                                            </div>
                                        ) : (
                                            <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 font-bold flex-shrink-0 flex items-center justify-center uppercase">
                                                {car.brand?.[0] || 'M'}
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-bold text-slate-800">{car.name}</p>
                                            <p className="text-xs text-slate-500">{car.brand}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-mono font-medium text-slate-700">{car.plate}</td>
                                    <td className="px-6 py-4 font-semibold text-emerald-700">Rp {car.price}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${car.status === 'Tersedia' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                                            {car.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => handleEdit(car)} className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"><Edit2 size={16} /></button>
                                            <button onClick={() => setConfirmModal({ isOpen: true, id: car.id })} className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredCars.length === 0 && (
                                <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">Belum ada data mobil.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <ConfirmDialog
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false, id: '' })}
                onConfirm={() => handleDelete(confirmModal.id)}
                title="Hapus Mobil?"
                message="Data mobil ini akan dihapus permanen dari koleksi rental."
            />
        </div>
    );
}

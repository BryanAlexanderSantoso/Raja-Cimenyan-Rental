import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X, Image as ImageIcon, Download, FileText, Upload } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import ConfirmDialog from '../../components/ConfirmDialog';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Tenants() {
    const [tenants, setTenants] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        ktp_url: '',
        sim_url: '',
        car_model: '',
        initial_km: '',
        final_km: '',
        destination: '',
        rental_duration: '',
        pj: ''
    });
    const [uploading, setUploading] = useState({ ktp: false, sim: false });
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: '' });

    useEffect(() => {
        fetchTenants();
    }, []);

    const fetchTenants = async () => {
        const { data, error } = await supabase.from('tenants').select('*').order('created_at', { ascending: false });
        if (!error && data) setTenants(data);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'ktp' | 'sim') => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${type}/${fileName}`;

        setUploading(prev => ({ ...prev, [type]: true }));

        try {
            const { error: uploadError } = await supabase.storage
                .from('tenants')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('tenants')
                .getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, [`${type}_url`]: publicUrl }));
        } catch (error) {
            alert(`Gagal mengunggah foto ${type.toUpperCase()}.`);
        } finally {
            setUploading(prev => ({ ...prev, [type]: false }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.ktp_url) {
            alert("Wajib melampirkan foto KTP penyewa!");
            return;
        }
        setLoading(true);

        if (editingId) {
            const { error } = await supabase.from('tenants').update(formData).eq('id', editingId);
            if (!error) {
                setShowForm(false);
                fetchTenants();
            }
        } else {
            const { error } = await supabase.from('tenants').insert([formData]);
            if (!error) {
                setShowForm(false);
                fetchTenants();
            } else {
                alert("Gagal menyimpan data penyewa.");
            }
        }
        setLoading(false);
    };

    const handleEdit = (tenant: any) => {
        setFormData({
            name: tenant.name,
            phone: tenant.phone,
            address: tenant.address,
            ktp_url: tenant.ktp_url || '',
            sim_url: tenant.sim_url || '',
            car_model: tenant.car_model || '',
            initial_km: tenant.initial_km || '',
            final_km: tenant.final_km || '',
            destination: tenant.destination || '',
            rental_duration: tenant.rental_duration || '',
            pj: tenant.pj || ''
        });
        setEditingId(tenant.id);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        const { error } = await supabase.from('tenants').delete().eq('id', id);
        if (error) alert("Gagal menghapus data.");
        else fetchTenants();
    };

    const downloadCSV = () => {
        const headers = ["Nama Penyewa", "No HP", "KTP", "SIM", "Alamat", "Jenis Mobil", "KM Awal", "KM Akhir", "Tujuan", "Waktu Sewa", "PJ"];
        const csvRows = [
            "sep=;",
            headers.join(";"),
            ...filteredTenants.map(t => [
                `"${t.name || ''}"`,
                `"${t.phone || ''}"`,
                `"${t.ktp_url || ''}"`,
                `"${t.sim_url || ''}"`,
                `"${(t.address || '').replace(/\n/g, ' ')}"`,
                `"${t.car_model || ''}"`,
                `"${t.initial_km || ''}"`,
                `"${t.final_km || ''}"`,
                `"${t.destination || ''}"`,
                `"${t.rental_duration || ''}"`,
                `"${t.pj || ''}"`
            ].join(";"))
        ];

        const blob = new Blob(["\uFEFF" + csvRows.join("\r\n")], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Data_Penyewa_${new Date().toLocaleDateString('id-ID')}.csv`;
        link.click();
    };

    const downloadPDF = () => {
        const doc = new jsPDF('landscape');
        doc.setFontSize(16);
        doc.text("Laporan Data Penyewa Mobil - Raja Cimenyan Rental", 14, 15);

        autoTable(doc, {
            startY: 25,
            head: [['No', 'Nama', 'HP', 'Mobil', 'KM Awal', 'KM Akhir', 'Tujuan', 'Waktu', 'PJ']],
            body: filteredTenants.map((t, i) => [
                i + 1, t.name, t.phone, t.car_model, t.initial_km, t.final_km, t.destination, t.rental_duration, t.pj
            ]),
            styles: { fontSize: 8 },
            headStyles: { fillColor: [5, 150, 105] }
        });

        doc.save(`Data_Penyewa_${new Date().toLocaleDateString('id-ID')}.pdf`);
    };

    const resetForm = () => {
        setFormData({
            name: '', phone: '', address: '', ktp_url: '', sim_url: '',
            car_model: '', initial_km: '', final_km: '', destination: '', rental_duration: '', pj: ''
        });
        setEditingId(null);
        setShowForm(false);
    };

    const filteredTenants = tenants.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.phone.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="pb-20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Daftar Penyewa Mobil</h2>
                    <p className="text-slate-500 font-medium">Kelola data administrasi penyewa secara lengkap.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={downloadCSV} title="Unduh CSV" className="bg-white border-2 border-slate-100 text-slate-600 hover:bg-slate-50 p-3 rounded-2xl transition-all shadow-sm">
                        <Download size={20} />
                    </button>
                    <button onClick={downloadPDF} title="Unduh PDF" className="bg-white border-2 border-slate-100 text-slate-600 hover:bg-slate-50 px-5 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-sm">
                        <FileText size={20} /> PDF
                    </button>
                    <button onClick={() => { resetForm(); setShowForm(true); }} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-lg shadow-emerald-200 transition-all">
                        <Plus size={20} /> TAMBAH DATA
                    </button>
                </div>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-black text-slate-900">{editingId ? 'Edit Data Penyewa' : 'Tambah Penyewa Baru'}</h3>
                            <button onClick={resetForm} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 trasition-colors"><X size={28} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Section 1: Identitas */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h4 className="text-xs font-black text-emerald-600 uppercase tracking-[0.2em]">Identitas Pribadi</h4>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Nama Lengkap</label>
                                        <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-emerald-500 outline-none font-medium" placeholder="Contoh: Budi Santoso" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">No HP / WhatsApp</label>
                                        <input required type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-emerald-500 outline-none font-medium" placeholder="0812..." />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Alamat Tinggal</label>
                                        <textarea required rows={2} value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-emerald-500 outline-none font-medium resize-none" placeholder="Alamat lengkap..." />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-xs font-black text-emerald-600 uppercase tracking-[0.2em]">Dokumen (Upload)</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-500">KTP (Wajib)</label>
                                            <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 transition-all overflow-hidden relative group">
                                                {formData.ktp_url ? (
                                                    <img src={formData.ktp_url} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="flex flex-col items-center text-slate-400 group-hover:text-emerald-500">
                                                        <Upload size={24} />
                                                        <span className="text-[10px] font-black mt-2">UPLOAD KTP</span>
                                                    </div>
                                                )}
                                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'ktp')} />
                                                {uploading.ktp && <div className="absolute inset-0 bg-white/80 flex items-center justify-center text-[10px] font-bold">MENGUNGGAH...</div>}
                                            </label>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-500">SIM (Opsional)</label>
                                            <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 transition-all overflow-hidden relative group">
                                                {formData.sim_url ? (
                                                    <img src={formData.sim_url} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="flex flex-col items-center text-slate-400 group-hover:text-emerald-500">
                                                        <Upload size={24} />
                                                        <span className="text-[10px] font-black mt-2">UPLOAD SIM</span>
                                                    </div>
                                                )}
                                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'sim')} />
                                                {uploading.sim && <div className="absolute inset-0 bg-white/80 flex items-center justify-center text-[10px] font-bold">MENGUNGGAH...</div>}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Detail Sewa */}
                            <div className="space-y-4">
                                <h4 className="text-xs font-black text-emerald-600 uppercase tracking-[0.2em]">Detail Perjalanan & Kendaraan</h4>
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Jenis Mobil</label>
                                        <input type="text" value={formData.car_model} onChange={e => setFormData({ ...formData, car_model: e.target.value })} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-emerald-500 outline-none font-medium" placeholder="Innova / Avanza..." />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">KM Awal</label>
                                        <input type="text" value={formData.initial_km} onChange={e => setFormData({ ...formData, initial_km: e.target.value })} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-emerald-500 outline-none font-medium" placeholder="Contoh: 125.000" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">KM Akhir</label>
                                        <input type="text" value={formData.final_km} onChange={e => setFormData({ ...formData, final_km: e.target.value })} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-emerald-500 outline-none font-medium" placeholder="Isi setelah selesai" />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Tujuan Perjalanan</label>
                                        <input type="text" value={formData.destination} onChange={e => setFormData({ ...formData, destination: e.target.value })} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-emerald-500 outline-none font-medium" placeholder="Contoh: Jakarta" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Waktu Sewa</label>
                                        <input type="text" value={formData.rental_duration} onChange={e => setFormData({ ...formData, rental_duration: e.target.value })} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-emerald-500 outline-none font-medium" placeholder="Contoh: 3 Hari" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Penanggung Jawab (PJ)</label>
                                        <input type="text" value={formData.pj} onChange={e => setFormData({ ...formData, pj: e.target.value })} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-emerald-500 outline-none font-medium" placeholder="Nama PJ Lapangan" />
                                    </div>
                                </div>
                            </div>

                            <button type="submit" disabled={loading || uploading.ktp || uploading.sim} className="w-full bg-slate-900 hover:bg-black text-white rounded-2xl py-4 font-black text-lg shadow-xl transition-all disabled:opacity-50">
                                {loading ? 'MENYIMPAN...' : 'SIMPAN DATA ADMINISTRASI'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                    <div className="relative max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={22} />
                        <input
                            type="text"
                            placeholder="Cari nama penyewa..."
                            className="w-full pl-12 pr-6 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-emerald-500 outline-none shadow-sm font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600 min-w-[1200px]">
                        <thead className="bg-slate-50/80 border-b border-slate-100 uppercase tracking-widest text-[10px] font-black text-slate-400">
                            <tr>
                                <th className="px-8 py-5">Identitas</th>
                                <th className="px-6 py-5">Dokumen</th>
                                <th className="px-6 py-5">Mobil</th>
                                <th className="px-6 py-5">KM (Awal/Akhir)</th>
                                <th className="px-6 py-5">Tujuan & Waktu</th>
                                <th className="px-6 py-5">PJ</th>
                                <th className="px-8 py-5 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredTenants.map((t) => (
                                <tr key={t.id} className="hover:bg-emerald-50/30 transition-colors group">
                                    <td className="px-8 py-6">
                                        <p className="font-black text-slate-800 text-base">{t.name}</p>
                                        <p className="text-emerald-600 font-bold mt-0.5">{t.phone}</p>
                                        <p className="text-[10px] text-slate-400 font-medium max-w-[200px] truncate mt-1">{t.address}</p>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex flex-col gap-2">
                                            {t.ktp_url && (
                                                <a href={t.ktp_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors">
                                                    <ImageIcon size={14} /> LIHAT KTP
                                                </a>
                                            )}
                                            {t.sim_url && (
                                                <a href={t.sim_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[10px] font-black text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-100 hover:bg-purple-100 transition-colors">
                                                    <ImageIcon size={14} /> LIHAT SIM
                                                </a>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <span className="font-bold text-slate-700">{t.car_model || '-'}</span>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex flex-col text-xs">
                                            <span className="text-slate-400 font-bold uppercase text-[9px]">Awal</span>
                                            <span className="font-bold text-slate-700">{t.initial_km || '0'} KM</span>
                                            <span className="text-slate-400 font-bold uppercase text-[9px] mt-2">Akhir</span>
                                            <span className="font-bold text-emerald-600">{t.final_km || '-'} KM</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-700">{t.destination || '-'}</span>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.rental_duration || '-'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 font-bold text-slate-800">{t.pj || '-'}</td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEdit(t)} className="p-3 bg-white border border-slate-100 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-xl shadow-sm transition-all"><Edit2 size={18} /></button>
                                            <button onClick={() => setConfirmModal({ isOpen: true, id: t.id })} className="p-3 bg-white border border-slate-100 text-red-500 hover:bg-red-500 hover:text-white rounded-xl shadow-sm transition-all"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <ConfirmDialog
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false, id: '' })}
                onConfirm={() => handleDelete(confirmModal.id)}
                title="Hapus Penyewa?"
                message="Data penyewa ini akan dihapus permanen dari sistem administrasi."
            />
        </div>
    );
}

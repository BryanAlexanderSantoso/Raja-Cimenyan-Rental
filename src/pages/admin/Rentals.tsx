import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X, Image as ImageIcon, Download, FileText } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Rentals() {
    const [rentals, setRentals] = useState<any[]>([]);
    const [cars, setCars] = useState<any[]>([]);
    const [tenants, setTenants] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploadingHandover, setUploadingHandover] = useState(false);

    // Form State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        tenant_id: '', car_id: '', start_date: '', end_date: '', total: 0, status: 'Aktif', handover_url: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        // We join tenant & car data to display nicely
        const { data: rentalData } = await supabase.from('rentals').select(`
      *,
      tenant:tenants(name),
      car:cars(name, plate)
    `).order('created_at', { ascending: false });

        if (rentalData) setRentals(rentalData);

        const { data: carData } = await supabase.from('cars').select('id, name, plate');
        if (carData) setCars(carData);

        const { data: tenantData } = await supabase.from('tenants').select('id, name');
        if (tenantData) setTenants(tenantData);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `handover/${fileName}`;

        setUploadingHandover(true);

        try {
            const { error: uploadError } = await supabase.storage
                .from('rentals')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('rentals')
                .getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, handover_url: publicUrl }));
        } catch (error) {
            alert('Gagal mengunggah foto serah terima kunci. Pastikan bucket "rentals" sudah ada and public di Supabase.');
        } finally {
            setUploadingHandover(false);
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.handover_url) {
            alert("Wajib melampirkan foto serah terima kunci & mobil!");
            return;
        }

        setLoading(true);

        if (editingId) {
            const { error } = await supabase.from('rentals').update(formData).eq('id', editingId);
            if (!error) {
                // Update status mobil agar sinkron
                const carStatus = formData.status === 'Aktif' ? 'Disewa' : 'Tersedia';
                await supabase.from('cars').update({ status: carStatus }).eq('id', formData.car_id);

                setShowForm(false);
                fetchData();
            }
        } else {
            const { error } = await supabase.from('rentals').insert([formData]);
            if (!error) {
                // Update status mobil agar sinkron
                const carStatus = formData.status === 'Aktif' ? 'Disewa' : 'Tersedia';
                await supabase.from('cars').update({ status: carStatus }).eq('id', formData.car_id);

                setShowForm(false);
                fetchData();
            } else {
                alert("Gagal menyimpan transaksi. Pastikan memilih Penyewa dan Mobil.");
            }
        }
        setLoading(false);
    };

    const handleEdit = (rental: any) => {
        setFormData({
            tenant_id: rental.tenant_id,
            car_id: rental.car_id,
            start_date: rental.start_date,
            end_date: rental.end_date,
            total: rental.total,
            status: rental.status,
            handover_url: rental.handover_url || ''
        });
        setEditingId(rental.id);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Yakin ingin membatalkan/menghapus transaksi sewa ini?')) {
            const rentalToDel = rentals.find(r => r.id === id);
            await supabase.from('rentals').delete().eq('id', id);

            // Kembalikan status mobil jadi Tersedia saat transaksi dihapus
            if (rentalToDel && rentalToDel.status === 'Aktif') {
                await supabase.from('cars').update({ status: 'Tersedia' }).eq('id', rentalToDel.car_id);
            }

            fetchData();
        }
    };

    const downloadCSV = () => {
        const headers = ["Nama Penyewa", "Mobil", "Plat Nomor", "Tgl Pinjam", "Tgl Kembali", "Total Bayar", "Status"];
        const csvRows = [
            "sep=;",
            headers.join(";"),
            ...filteredRentals.map(r => [
                `"${(r.tenant?.name || 'Dihapus').replace(/"/g, '""')}"`,
                `"${(r.car?.name || '').replace(/"/g, '""')}"`,
                `"${r.car?.plate || ''}"`,
                `"${r.start_date}"`,
                `"${r.end_date}"`,
                `"${r.total}"`,
                `"${r.status}"`
            ].join(";"))
        ];

        const csvString = csvRows.join("\r\n");
        const blob = new Blob(["\uFEFF" + csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `Laporan_Sewa_Raja_Cimenyan_${new Date().toLocaleDateString('id-ID')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const downloadPDF = () => {
        const doc = new jsPDF('l', 'mm', 'a4'); // Landscape mode for more columns

        // Header
        doc.setFontSize(18);
        doc.text("Laporan Transaksi Sewa - Raja Cimenyan Rental", 14, 22);
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Dicetak pada: ${new Date().toLocaleString('id-ID')}`, 14, 30);

        // Table
        autoTable(doc, {
            startY: 40,
            head: [['No', 'Penyewa', 'Mobil', 'Plat Nomor', 'Tgl Pinjam', 'Tgl Kembali', 'Total Bayar', 'Status']],
            body: filteredRentals.map((r, i) => [
                i + 1,
                r.tenant?.name || 'Dihapus',
                r.car?.name || '',
                r.car?.plate || '',
                r.start_date,
                r.end_date,
                `Rp ${r.total.toLocaleString('id-ID')}`,
                r.status
            ]),
            headStyles: { fillColor: [5, 150, 105] }, // Emerald-600 color
            alternateRowStyles: { fillColor: [249, 250, 251] }, // Slate-50 color
            margin: { top: 40 },
            styles: { font: 'helvetica', fontSize: 9 }
        });

        doc.save(`Laporan_Sewa_Raja_Cimenyan_${new Date().toLocaleDateString('id-ID')}.pdf`);
    };

    const resetForm = () => {
        setFormData({ tenant_id: '', car_id: '', start_date: '', end_date: '', total: 0, status: 'Aktif', handover_url: '' });
        setEditingId(null);
        setShowForm(false);
    };

    // Filter based on joined tenant name
    const filteredRentals = rentals.filter(r =>
        r.tenant?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.car?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <h2 className="text-2xl font-bold text-slate-800">Transaksi Sewa Mobil</h2>
                <div className="flex gap-2">
                    <button onClick={downloadCSV} title="Unduh CSV" className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 p-2 rounded-lg font-medium flex items-center gap-2 transition-all shadow-sm">
                        <Download size={18} />
                    </button>
                    <button onClick={downloadPDF} title="Unduh PDF" className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all shadow-sm">
                        <FileText size={18} /> Unduh PDF
                    </button>
                    <button onClick={() => { resetForm(); setShowForm(true); }} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
                        <Plus size={18} /> Transaksi Baru
                    </button>
                </div>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto w-scrollbar-hidden">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">{editingId ? 'Edit Transaksi' : 'Tambah Transaksi'}</h3>
                            <button onClick={resetForm} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Penyewa</label>
                                <select required value={formData.tenant_id} onChange={e => setFormData({ ...formData, tenant_id: e.target.value })} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2">
                                    <option value="" disabled>Pilih Penyewa</option>
                                    {tenants.map(t => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Mobil</label>
                                <select required value={formData.car_id} onChange={e => setFormData({ ...formData, car_id: e.target.value })} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2">
                                    <option value="" disabled>Pilih Mobil</option>
                                    {cars.map(c => (
                                        <option key={c.id} value={c.id}>{c.name} - {c.plate}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Tgl Pinjam</label>
                                    <input required type="date" value={formData.start_date} onChange={e => setFormData({ ...formData, start_date: e.target.value })} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Tgl Kembali</label>
                                    <input required type="date" value={formData.end_date} onChange={e => setFormData({ ...formData, end_date: e.target.value })} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Total Harga (Rp)</label>
                                <input required type="number" value={formData.total} onChange={e => setFormData({ ...formData, total: Number(e.target.value) })} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Status Penyewaan</label>
                                <select required value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2">
                                    <option value="Aktif">Aktif</option>
                                    <option value="Selesai">Selesai</option>
                                    <option value="Batal">Batal</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Foto Serah Terima (Kunci/Mobil)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    disabled={uploadingHandover}
                                    className="mt-1 w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                                />
                                {uploadingHandover && <p className="text-xs text-slate-500 mt-1">Mengunggah Foto Bukti...</p>}
                                {formData.handover_url && (
                                    <div className="mt-2 border border-slate-200 rounded-lg overflow-hidden h-32 w-full">
                                        <img src={formData.handover_url} alt="Serah Terima" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>

                            <button type="submit" disabled={loading || uploadingHandover} className="w-full bg-emerald-600 text-white rounded-lg py-3 font-bold hover:bg-emerald-700 mt-4 disabled:opacity-50 transition-colors">
                                {loading ? 'Menyimpan...' : 'Simpan Transaksi'}
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
                            placeholder="Cari transaksi sewa..."
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
                                <th className="px-6 py-4">Penyewa & Mobil</th>
                                <th className="px-6 py-4">Tgl Pinjam</th>
                                <th className="px-6 py-4">Total Tagihan</th>
                                <th className="px-6 py-4">Bukti Serah Terima</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredRentals.map((r) => (
                                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-slate-800">{r.tenant?.name || 'Penyewa Dihapus'}</p>
                                        <p className="text-xs text-slate-500">{r.car?.name} • <span className="font-mono">{r.car?.plate}</span></p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p>{r.start_date}</p>
                                        <p className="text-xs text-slate-400">s/d {r.end_date}</p>
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-emerald-700">Rp {r.total.toLocaleString('id-ID')}</td>
                                    <td className="px-6 py-4">
                                        {r.handover_url ? (
                                            <a href={r.handover_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100">
                                                <ImageIcon size={14} /> Lihat Foto
                                            </a>
                                        ) : (
                                            <span className="text-xs text-slate-400">Tidak ada</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${r.status === 'Aktif' ? 'bg-blue-100 text-blue-700' :
                                            r.status === 'Selesai' ? 'bg-emerald-100 text-emerald-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                            {r.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => handleEdit(r)} className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"><Edit2 size={16} /></button>
                                            <button onClick={() => handleDelete(r.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredRentals.length === 0 && (
                                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">Tidak ada transaksi sewa yang ditemukan.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

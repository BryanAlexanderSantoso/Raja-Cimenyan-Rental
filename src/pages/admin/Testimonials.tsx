import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import ConfirmDialog from '../../components/ConfirmDialog';
import { Plus, Trash2, Star, Edit2, X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Testimonials() {
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: '' });
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        text: '',
        stars: 5
    });

    useEffect(() => {
        fetchTestimonials();
    }, []);

    async function fetchTestimonials() {
        setLoading(true);
        const { data, error } = await supabase
            .from('testimonials')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) console.error('Error fetching testimonials:', error);
        else setTestimonials(data || []);
        setLoading(false);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        if (editingId) {
            const { error } = await supabase
                .from('testimonials')
                .update(formData)
                .eq('id', editingId);
            if (!error) {
                setEditingId(null);
                setIsModalOpen(false);
                setFormData({ name: '', role: '', text: '', stars: 5 });
                fetchTestimonials();
            }
        } else {
            const { error } = await supabase
                .from('testimonials')
                .insert([formData]);
            if (!error) {
                setIsModalOpen(false);
                setFormData({ name: '', role: '', text: '', stars: 5 });
                fetchTestimonials();
            }
        }
    }

    async function deleteTestimonial(id: string) {
        const { error } = await supabase
            .from('testimonials')
            .delete()
            .eq('id', id);
        if (!error) fetchTestimonials();
    }

    function startEdit(t: any) {
        setEditingId(t.id);
        setFormData({
            name: t.name,
            role: t.role || '',
            text: t.text,
            stars: t.stars
        });
        setIsModalOpen(true);
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900">Manajemen Testimoni</h1>
                    <p className="text-slate-500">Kelola ulasan pelanggan yang muncul di landing page.</p>
                </div>
                <button
                    onClick={() => {
                        setEditingId(null);
                        setFormData({ name: '', role: '', text: '', stars: 5 });
                        setIsModalOpen(true);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/20"
                >
                    <Plus size={20} /> Tambah Testimoni
                </button>
            </div>

            {loading && testimonials.length === 0 ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((t) => (
                        <motion.div
                            layout
                            key={t.id}
                            className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex gap-1 text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={16} fill={i < t.stars ? "currentColor" : "none"} />
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => startEdit(t)} className="p-2 text-slate-400 hover:text-emerald-600 transition-colors">
                                            <Edit2 size={18} />
                                        </button>
                                        <button onClick={() => setConfirmModal({ isOpen: true, id: t.id })} className="p-2 text-slate-400 hover:text-red-600 transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-slate-600 italic mb-6 line-clamp-4">"{t.text}"</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold">
                                    {t.name[0]}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 leading-none mb-1">{t.name}</p>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{t.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Modal Form */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-[2.5rem] p-8 w-full max-w-lg relative z-10 shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-black text-slate-900">
                                    {editingId ? 'Edit Testimoni' : 'Tambah Testimoni'}
                                </h3>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-widest">Nama Pelanggan</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3 focus:border-emerald-500 outline-none font-bold"
                                        placeholder="Contoh: Budi Santoso"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-widest">Pekerjaan / Jabatan</label>
                                    <input
                                        type="text"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3 focus:border-emerald-500 outline-none font-bold"
                                        placeholder="Contoh: Pengusaha / Wisatawan"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-widest">Isi Ulasan</label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={formData.text}
                                        onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3 focus:border-emerald-500 outline-none font-bold resize-none"
                                        placeholder="Tulis testimoni pelanggan di sini..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-widest">Rating (1-5 Bintang)</label>
                                    <div className="flex gap-4">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <button
                                                key={s}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, stars: s })}
                                                className={`flex-1 py-3 rounded-xl font-bold transition-all border-2 ${formData.stars === s
                                                    ? 'bg-emerald-600 border-emerald-600 text-white'
                                                    : 'bg-white border-slate-100 text-slate-400'
                                                    }`}
                                            >
                                                {s} ★
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-slate-900 hover:bg-black text-white py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 transition-all"
                                >
                                    <Save size={24} /> SIMPAN TESTIMONI
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            <ConfirmDialog
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false, id: '' })}
                onConfirm={() => deleteTestimonial(confirmModal.id)}
                title="Hapus Testimoni?"
                message="Testimoni ini akan dihapus permanen dari landing page."
            />
        </div>
    );
}

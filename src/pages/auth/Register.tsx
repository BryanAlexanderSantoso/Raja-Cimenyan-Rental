import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { MapPin } from 'lucide-react';

export default function Register() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nama, setNama] = useState('');
    const [nohp, setNohp] = useState('');
    const [umur, setUmur] = useState('');
    const [rute, setRute] = useState('');
    const [mobil, setMobil] = useState('');
    const [plat, setPlat] = useState('');
    const [fotoWajahUrl, setFotoWajahUrl] = useState('');

    const [loading, setLoading] = useState(false);
    const [uploadingFoto, setUploadingFoto] = useState(false);
    const [error, setError] = useState('');

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `wajah/${fileName}`;

        setUploadingFoto(true);

        try {
            const { error: uploadError } = await supabase.storage
                .from('drivers')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('drivers')
                .getPublicUrl(filePath);

            setFotoWajahUrl(publicUrl);
        } catch (error) {
            alert('Gagal mengunggah foto wajah. Pastikan bucket "drivers" (public) sudah dibuat di Supabase Storage.');
        } finally {
            setUploadingFoto(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Register user via Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
        });

        if (authError) {
            setError(authError.message);
            setLoading(false);
            return;
        }

        // Jika user berhasil terdaftar ke auth, kita tambahkan profilenya ke tabel drivers
        if (authData?.user) {
            const { error: dbError } = await supabase.from('drivers').insert([{
                user_id: authData.user.id,
                name: nama,
                phone: nohp,
                rute_awal: rute,
                mobil: mobil,
                plat: plat,
                umur: parseInt(umur) || 0,
                foto_wajah: fotoWajahUrl
            }]);

            if (dbError) {
                console.error(dbError);
                setError("Akun berhasil dibuat, namun gagal menyimpan detail profil sopir.");
                setLoading(false);
                return;
            }
        }

        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="bg-emerald-600 p-3 rounded-2xl text-white shadow-lg shadow-emerald-600/20">
                        <MapPin size={32} strokeWidth={2.5} />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
                    Pendaftaran Sopir
                </h2>
                <p className="mt-2 text-center text-sm text-slate-600">
                    Sudah punya akun?{' '}
                    <Link to="/login" className="font-medium text-emerald-600 hover:text-emerald-500">
                        Masuk sekarang
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100">
                    <form className="space-y-6" onSubmit={handleRegister}>
                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-700">Nama Lengkap</label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    required
                                    value={nama}
                                    onChange={(e) => setNama(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                    placeholder="Budi Santoso"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">Nomor Telepon (WA)</label>
                            <div className="mt-1">
                                <input
                                    type="tel"
                                    required
                                    value={nohp}
                                    onChange={(e) => setNohp(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                    placeholder="08123456789"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Umur</label>
                                <input
                                    type="number"
                                    required
                                    value={umur}
                                    onChange={(e) => setUmur(e.target.value)}
                                    className="mt-1 appearance-none block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                    placeholder="25"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Rute Gendongan</label>
                                <input
                                    type="text"
                                    required
                                    value={rute}
                                    onChange={(e) => setRute(e.target.value)}
                                    className="mt-1 appearance-none block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                    placeholder="Jakarta - Bandung"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Mobil / Kendaraan</label>
                                <input
                                    type="text"
                                    required
                                    value={mobil}
                                    onChange={(e) => setMobil(e.target.value)}
                                    className="mt-1 appearance-none block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                    placeholder="Avanza"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Plat Nomor</label>
                                <input
                                    type="text"
                                    required
                                    value={plat}
                                    onChange={(e) => setPlat(e.target.value)}
                                    className="mt-1 appearance-none block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                    placeholder="D 1234 XYZ"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">Foto Wajah Sopir</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                disabled={uploadingFoto}
                                className="mt-1 w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                            />
                            {uploadingFoto && <p className="text-xs text-slate-500 mt-1">Mengunggah Foto Wajah...</p>}
                            {fotoWajahUrl && (
                                <div className="mt-2 border border-slate-200 rounded-lg overflow-hidden h-32 w-32">
                                    <img src={fotoWajahUrl} alt="Wajah" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">Email Akun</label>
                            <div className="mt-1">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                    placeholder="emailmu@gmail.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">Kata Sandi</label>
                            <div className="mt-1">
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading || uploadingFoto}
                                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 transition-colors"
                            >
                                {loading ? 'Mendaftar...' : 'Daftar Sopir'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

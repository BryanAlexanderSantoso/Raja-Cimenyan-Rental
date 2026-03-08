import { Map, Users, TrendingUp, CreditCard } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function Dashboard() {
    const [counts, setCounts] = useState({
        trips: 0,
        drivers: 0,
        rentals: 0,
        revenue: 0
    });
    const [recentTrips, setRecentTrips] = useState<any[]>([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // 1. Jadwal Aktif (Gendongan)
            const { count: tripCount } = await supabase
                .from('trips')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'Tersedia');

            // 2. Sopir Terdaftar
            const { count: driverCount } = await supabase
                .from('drivers')
                .select('*', { count: 'exact', head: true });

            // 3. Total Transaksi (Rental Aktif + Selesai)
            const { count: rentalCount } = await supabase
                .from('rentals')
                .select('*', { count: 'exact', head: true });

            // 4. Estimasi Pendapatan Komisi (Contoh logic: 20% dari total harga trips yg selesai + rentals jika ada)
            // Untuk demo, kita ambil total harga dari trips saja
            const { data: tripRevenues } = await supabase
                .from('trips')
                .select('harga')
                .eq('status', 'Selesai');

            const totalTripRevenue = tripRevenues?.reduce((acc: number, curr: any) => acc + (curr.harga || 0), 0) || 0;
            const commission = totalTripRevenue * 0.2;

            // 5. Recent Trips
            const { data: latestTrips } = await supabase
                .from('trips')
                .select(`*, driver:drivers(name, mobil)`)
                .order('created_at', { ascending: false })
                .limit(5);

            setCounts({
                trips: tripCount || 0,
                drivers: driverCount || 0,
                rentals: rentalCount || 0,
                revenue: commission
            });
            setRecentTrips(latestTrips || []);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };

    const stats = [
        { label: 'Jadwal Aktif', value: counts.trips.toString(), icon: Map, color: 'text-blue-600', bg: 'bg-blue-100' },
        { label: 'Sopir Terdaftar', value: counts.drivers.toString(), icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
        { label: 'Pendapatan Komisi (20%)', value: `Rp ${counts.revenue.toLocaleString('id-ID')}`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-100' },
        { label: 'Total Transaksi', value: counts.rentals.toString(), icon: CreditCard, color: 'text-orange-600', bg: 'bg-orange-100' },
    ];

    return (
        <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-8">Ringkasan Dasbor Nebeng</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-4 mb-4">
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            <p className="text-slate-500 font-medium">{stat.label}</p>
                        </div>
                        <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 font-primary">Penambahan Jadwal Terbaru</h3>
                    <div className="space-y-4">
                        {recentTrips.length === 0 && <p className="text-slate-400 text-center py-4">Belum ada jadwal terbaru.</p>}
                        {recentTrips.map((trip) => (
                            <div key={trip.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                                        <Map size={24} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800 uppercase text-sm">{trip.rute}</p>
                                        <p className="text-xs text-slate-500">Sopir: {trip.driver?.name} ({trip.driver?.mobil})</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase mb-1 ${trip.status === 'Tersedia' ? 'bg-emerald-100 text-emerald-700' :
                                            trip.status === 'Penuh' ? 'bg-orange-100 text-orange-700' : 'bg-slate-200 text-slate-600'
                                        }`}>
                                        {trip.status}
                                    </span>
                                    <p className="text-[10px] text-slate-400 font-bold">{trip.tanggal}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Aksi Cepat Admin</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <a href="/admin/trips" className="p-4 border border-dashed border-slate-300 rounded-xl text-center hover:bg-slate-50 hover:border-emerald-400 transition-colors group">
                            <Map className="mx-auto mb-2 text-slate-400 group-hover:text-emerald-500" size={24} />
                            <span className="text-sm font-medium text-slate-600 group-hover:text-emerald-600">Manajemen Jadwal</span>
                        </a>
                        <a href="/admin/drivers" className="p-4 border border-dashed border-slate-300 rounded-xl text-center hover:bg-slate-50 hover:border-emerald-400 transition-colors group">
                            <Users className="mx-auto mb-2 text-slate-400 group-hover:text-emerald-500" size={24} />
                            <span className="text-sm font-medium text-slate-600 group-hover:text-emerald-600">Data Sopir</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

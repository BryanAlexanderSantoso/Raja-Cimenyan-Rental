import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CarFront, Users, FileText, Map, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function AdminLayout() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    const navSewa = [
        { label: 'Dasbor', path: '/admin', icon: LayoutDashboard },
        { label: 'Koleksi Mobil', path: '/admin/cars', icon: CarFront },
        { label: 'Daftar Penyewa', path: '/admin/tenants', icon: Users },
        { label: 'Transaksi Sewa', path: '/admin/rentals', icon: FileText },
    ];

    const navGendongan = [
        { label: 'Jadwal Tiket Travel', path: '/admin/trips', icon: Map },
        { label: 'Partner Sopir', path: '/admin/drivers', icon: Users },
    ];

    const navWebsite = [
        { label: 'Manajemen Testimoni', path: '/admin/testimonials', icon: FileText },
    ];

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
            <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between hidden md:flex text-slate-300">
                <div>
                    <div className="h-20 flex items-center px-6 border-b border-slate-800">
                        <span className="font-bold text-xl text-white shadow-sm">Panel Admin</span>
                    </div>

                    <div className="p-4">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-2">Sewa Mobil</h4>
                        <nav className="space-y-1 mb-6">
                            {navSewa.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    end={item.path === '/admin'}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                                            ? 'bg-emerald-600 text-white shadow-md'
                                            : 'hover:bg-slate-800 hover:text-white'
                                        }`
                                    }
                                >
                                    <item.icon size={18} className="shrink-0" />
                                    <span>{item.label}</span>
                                </NavLink>
                            ))}
                        </nav>

                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-2">Tiket Travel</h4>
                        <nav className="space-y-1">
                            {navGendongan.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                                            ? 'bg-emerald-600 text-white shadow-md'
                                            : 'hover:bg-slate-800 hover:text-white'
                                        }`
                                    }
                                >
                                    <item.icon size={18} className="shrink-0" />
                                    <span>{item.label}</span>
                                </NavLink>
                            ))}
                        </nav>

                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-6 px-2">Website Content</h4>
                        <nav className="space-y-1">
                            {navWebsite.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                                            ? 'bg-emerald-600 text-white shadow-md'
                                            : 'hover:bg-slate-800 hover:text-white'
                                        }`
                                    }
                                >
                                    <item.icon size={18} className="shrink-0" />
                                    <span>{item.label}</span>
                                </NavLink>
                            ))}
                        </nav>
                    </div>
                </div>

                <div className="p-4 border-t border-slate-800">
                    <button onClick={handleLogout} className="flex w-full items-center gap-3 px-4 py-3 text-red-400 hover:bg-slate-800 rounded-lg text-sm font-medium transition-colors">
                        <LogOut size={20} />
                        <span>Keluar Sistem</span>
                    </button>
                </div>
            </aside>
            <main className="flex-1 overflow-y-auto">
                <header className="h-20 bg-white border-b border-slate-200 flex items-center px-8 md:hidden">
                    <h1 className="font-semibold text-lg text-slate-900">Dasbor Admin</h1>
                </header>
                <div className="p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

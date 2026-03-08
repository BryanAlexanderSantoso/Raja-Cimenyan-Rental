import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function SopirLayout() {
    const navigate = useNavigate();
    const navItems = [
        { label: 'Dasbor Saya', path: '/sopir', icon: LayoutDashboard },
    ];

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
            <aside className="w-64 bg-emerald-900 border-r border-emerald-800 flex flex-col justify-between hidden md:flex text-emerald-100">
                <div>
                    <div className="h-20 flex items-center px-6 border-b border-emerald-800">
                        <span className="font-bold text-xl text-white shadow-sm">Panel Sopir</span>
                    </div>
                    <nav className="p-4 space-y-2">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === '/sopir'}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActive
                                        ? 'bg-emerald-600 text-white shadow-md'
                                        : 'hover:bg-emerald-800 hover:text-white'
                                    }`
                                }
                            >
                                <item.icon size={20} className="shrink-0" />
                                <span>{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>
                </div>
                <div className="p-4 border-t border-emerald-800">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-3 text-emerald-200 hover:bg-emerald-800 hover:text-white rounded-lg text-sm font-medium transition-colors"
                    >
                        <LogOut size={20} />
                        <span>Keluar Sistem</span>
                    </button>
                </div>
            </aside>
            <main className="flex-1 overflow-y-auto">
                <header className="h-20 bg-white border-b border-slate-200 flex items-center px-8 md:hidden">
                    <h1 className="font-semibold text-lg text-slate-900">Dasbor Sopir</h1>
                </header>
                <div className="p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

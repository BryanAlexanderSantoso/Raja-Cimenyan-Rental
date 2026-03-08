import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';

interface ProtectedRouteProps {
    requireAdmin?: boolean;
}

export default function ProtectedRoute({ requireAdmin = false }: ProtectedRouteProps) {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    // Jika tidak ada session (belum login), kembalikan ke /login
    if (!session) {
        return <Navigate to="/login" replace />;
    }

    // Jika route ini butuh admin, pastikan emailnya admin
    if (requireAdmin && session.user.email !== 'adminrental@gmail.com') {
        return <Navigate to="/sopir" replace />;
    }

    // Jika route ini butuh driver (buka admin tapi akses driver route), tidak masalah, tapi bisa dilimit bila perlu
    if (!requireAdmin && session.user.email === 'adminrental@gmail.com') {
        return <Navigate to="/admin" replace />;
    }

    return <Outlet />;
}

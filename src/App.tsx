import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import SopirLayout from './layouts/SopirLayout';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/public/Home';
import SewaMobil from './pages/public/SewaMobil';
import Gendongan from './pages/public/Gendongan';
import Login from './pages/auth/Login';
import LoginSopir from './pages/auth/LoginSopir';
import Register from './pages/auth/Register';

import AdminDashboard from './pages/admin/Dashboard';
import Cars from './pages/admin/Cars';
import Tenants from './pages/admin/Tenants';
import Rentals from './pages/admin/Rentals';
import Trips from './pages/admin/Trips';
import Drivers from './pages/admin/Drivers';
import Testimonials from './pages/admin/Testimonials';

import SopirDashboard from './pages/sopir/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="sewa-mobil" element={<SewaMobil />} />
          <Route path="gendongan" element={<Gendongan />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/login-sopir" element={<LoginSopir />} />
        <Route path="/register" element={<Register />} />

        {/* Rute Sopir */}
        <Route element={<ProtectedRoute requireAdmin={false} />}>
          <Route path="/sopir" element={<SopirLayout />}>
            <Route index element={<SopirDashboard />} />
          </Route>
        </Route>

        {/* Rute Admin */}
        <Route element={<ProtectedRoute requireAdmin={true} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            {/* Sewa Mobil */}
            <Route path="cars" element={<Cars />} />
            <Route path="tenants" element={<Tenants />} />
            <Route path="rentals" element={<Rentals />} />
            {/* Gendongan */}
            <Route path="trips" element={<Trips />} />
            <Route path="drivers" element={<Drivers />} />
            <Route path="testimonials" element={<Testimonials />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

-- SQL Script untuk mengatasi Error Upload Gambar / Storage di Supabase

-- 1. Membuat Bucket secara otomatis (Jika Anda belum berhasil membuatnya manual)
-- Ini akan memastikan bucket cars, tenants, dan rentals berstatus PUBLIC
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('cars', 'cars', true),
  ('tenants', 'tenants', true),
  ('rentals', 'rentals', true),
  ('drivers', 'drivers', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Memberikan Izin Akses (Policies) agar gambar bisa diunggah (INSERT) dan dilihat (SELECT)
-- Meskipun bucket-nya public, secara bawaan Supabase melarang siapa pun untuk mengunggah file. 
-- Baris kode di bawah ini akan membuka jalur agar Admin yang sudah login bisa melakukan unggah foto.

-- A. Semua orang boleh melihat gambar KTP dan Mobil (Untuk keperluan ditayangkan di browser halaman publik)
DROP POLICY IF EXISTS "Bebas lihat gambar untuk umum" ON storage.objects;
CREATE POLICY "Bebas lihat gambar untuk umum" 
ON storage.objects FOR SELECT 
USING (bucket_id IN ('cars', 'tenants', 'rentals', 'drivers'));

-- B. Hanya Admin (Atau user yang sedang login) yang boleh Mengunggah (Insert) gambar baru
DROP POLICY IF EXISTS "Izinkan Admin / Autentikasi untuk Upload Gambar" ON storage.objects;
CREATE POLICY "Izinkan Admin / Autentikasi untuk Upload Gambar" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id IN ('cars', 'tenants', 'rentals', 'drivers'));

-- C. Hanya Admin (Atau user yang sedang login) yang boleh Memperbarui (Update) gambar
DROP POLICY IF EXISTS "Izinkan Admin / Autentikasi untuk Update Gambar" ON storage.objects;
CREATE POLICY "Izinkan Admin / Autentikasi untuk Update Gambar" 
ON storage.objects FOR UPDATE 
USING (bucket_id IN ('cars', 'tenants', 'rentals', 'drivers') AND auth.role() = 'authenticated');

-- D. Hanya Admin (Atau user yang sedang login) yang boleh Menghapus (Delete) gambar
DROP POLICY IF EXISTS "Izinkan Admin / Autentikasi untuk Hapus Gambar" ON storage.objects;
CREATE POLICY "Izinkan Admin / Autentikasi untuk Hapus Gambar" 
ON storage.objects FOR DELETE 
USING (bucket_id IN ('cars', 'tenants', 'rentals', 'drivers') AND auth.role() = 'authenticated');

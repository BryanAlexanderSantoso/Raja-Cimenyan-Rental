-- SQL SCript untuk membuat Struktur Database Raja Cimenyan Rental & Gendongan

-- 1. TABEL UNTUK FITUR SEWA MOBIL

-- Tabel Koleksi Mobil
CREATE TABLE cars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  brand text NOT NULL,
  plate text NOT NULL UNIQUE,
  price integer NOT NULL,
  status text NOT NULL DEFAULT 'Tersedia', -- Tersedia, Dipesan, Perawatan
  image_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabel Penyewa (Tenants)
CREATE TABLE tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  address text,
  ktp_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabel Transaksi Sewa (Rentals)
CREATE TABLE rentals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE RESTRICT,
  car_id uuid REFERENCES cars(id) ON DELETE RESTRICT,
  start_date date NOT NULL,
  end_date date NOT NULL,
  total integer NOT NULL,
  status text NOT NULL DEFAULT 'Aktif', -- Aktif, Selesai, Batal
  handover_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- 2. TABEL UNTUK FITUR RENTAL GENDONGAN (NEBENG)

-- Tabel Partner Sopir
CREATE TABLE drivers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Jika sopir register mandiri, kita kaitkan ke auth.users
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text NOT NULL,
  rute_awal text,
  mobil text,
  plat text,
  umur integer,
  foto_wajah text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabel Jadwal Keberangkatan (Trips)
CREATE TABLE trips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id uuid REFERENCES drivers(id) ON DELETE CASCADE,
  rute text NOT NULL,
  tanggal date NOT NULL,
  jam text NOT NULL,
  kursi integer NOT NULL,
  harga integer NOT NULL, -- Harga per kursi
  status text NOT NULL DEFAULT 'Tersedia', -- Tersedia, Penuh, Selesai, Batal
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Catatan Penting: Jangan lupa membuat ulang Storage Buckets di menu Storage Supabase
-- 1. Buat bucket bernama 'cars'
-- 2. Buat bucket bernama 'tenants'
-- 3. Buat bucket bernama 'rentals'
-- Pastikan ketiga bucket tersebut bersifat "Public"

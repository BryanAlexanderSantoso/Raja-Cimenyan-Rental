-- Update tenants table with more fields as requested by client
alter table tenants 
add column if not exists sim_url text,
add column if not exists car_model text,
add column if not exists initial_km text,
add column if not exists final_km text,
add column if not exists destination text,
add column if not exists rental_duration text,
add column if not exists pj text;

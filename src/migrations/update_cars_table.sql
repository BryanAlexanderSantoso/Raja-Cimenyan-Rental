-- Add new columns to cars table
alter table cars 
add column if not exists transmission text default 'Manual',
add column if not exists fuel_type text default 'Bensin',
add column if not exists seats integer default 5;

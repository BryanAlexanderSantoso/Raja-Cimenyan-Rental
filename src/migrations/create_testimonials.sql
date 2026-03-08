-- Create testimonials table
create table if not exists testimonials (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  role text,
  text text not null,
  stars integer default 5,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table testimonials enable row level security;

-- Policies
create policy "Testimonials are viewable by everyone" 
  on testimonials for select 
  using (true);

create policy "Admins can manage testimonials" 
  on testimonials for all 
  using (auth.jwt() ->> 'email' = 'adminrental@gmail.com');

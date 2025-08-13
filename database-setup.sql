-- Enable RLS (Row Level Security)
alter table if exists public.profiles enable row level security;
alter table if exists public.cycles enable row level security;
alter table if exists public.symptoms enable row level security;
alter table if exists public.moods enable row level security;

-- Create profiles table
create table if not exists public.profiles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  email text,
  name text,
  first_name text,
  last_name text,
  cycle_length integer default 28,
  period_length integer default 5,
  last_period_start date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

-- Create cycles table
create table if not exists public.cycles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  start_date date not null,
  end_date date,
  cycle_length integer,
  period_length integer,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create symptoms table
create table if not exists public.symptoms (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  date date not null,
  type text not null,
  intensity integer check (intensity >= 1 and intensity <= 5),
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create moods table
create table if not exists public.moods (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  date date not null,
  mood text not null,
  intensity integer check (intensity >= 1 and intensity <= 5),
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS) policies

-- Profiles policies
create policy "Users can view own profile" on profiles for select using (auth.uid() = user_id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = user_id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = user_id);

-- Cycles policies
create policy "Users can view own cycles" on cycles for select using (auth.uid() = user_id);
create policy "Users can insert own cycles" on cycles for insert with check (auth.uid() = user_id);
create policy "Users can update own cycles" on cycles for update using (auth.uid() = user_id);
create policy "Users can delete own cycles" on cycles for delete using (auth.uid() = user_id);

-- Symptoms policies
create policy "Users can view own symptoms" on symptoms for select using (auth.uid() = user_id);
create policy "Users can insert own symptoms" on symptoms for insert with check (auth.uid() = user_id);
create policy "Users can update own symptoms" on symptoms for update using (auth.uid() = user_id);
create policy "Users can delete own symptoms" on symptoms for delete using (auth.uid() = user_id);

-- Moods policies
create policy "Users can view own moods" on moods for select using (auth.uid() = user_id);
create policy "Users can insert own moods" on moods for insert with check (auth.uid() = user_id);
create policy "Users can update own moods" on moods for update using (auth.uid() = user_id);
create policy "Users can delete own moods" on moods for delete using (auth.uid() = user_id);

-- Create function to automatically create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (user_id, email, name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'first_name', split_part(new.email, '@', 1)));
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language 'plpgsql';

-- Create triggers for updated_at
drop trigger if exists update_profiles_updated_at on profiles;
create trigger update_profiles_updated_at before update on profiles for each row execute procedure update_updated_at_column();

drop trigger if exists update_cycles_updated_at on cycles;
create trigger update_cycles_updated_at before update on cycles for each row execute procedure update_updated_at_column();
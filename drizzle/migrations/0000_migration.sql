-- Roles
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "Users read own roles" on public.user_roles for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

-- Auto-grant admin to the owner email once the email is confirmed
create or replace function public.grant_owner_admin()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.email_confirmed_at is not null and lower(new.email) = 'aguilaprinteg@gmail.com' then
    insert into public.user_roles (user_id, role) values (new.id, 'admin')
    on conflict (user_id, role) do nothing;
  end if;
  return new;
end;
$$;

create trigger on_auth_user_owner_admin
after insert or update of email_confirmed_at on auth.users
for each row execute function public.grant_owner_admin();

-- Products
create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  model text,
  sku text,
  category text not null default 'smart-locks',
  system text not null default 'wifi',
  short_description text,
  description text,
  specs jsonb not null default '[]'::jsonb,
  price numeric(12,2) not null default 0,
  compare_at_price numeric(12,2),
  image_url text,
  gallery text[] not null default '{}',
  stock integer not null default 0,
  featured boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.products to anon;
grant select, insert, update, delete on public.products to authenticated;
grant all on public.products to service_role;
alter table public.products enable row level security;

create policy "Public reads active products" on public.products for select to anon, authenticated
  using (is_active = true or public.has_role(auth.uid(), 'admin'));
create policy "Admins insert products" on public.products for insert to authenticated
  with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins update products" on public.products for update to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins delete products" on public.products for delete to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create index products_category_idx on public.products (category);
create index products_system_idx on public.products (system);

create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

create trigger products_touch before update on public.products
for each row execute function public.touch_updated_at();

-- Orders (written by server code after recomputing totals; admins manage)
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number bigint generated always as identity,
  customer_name text not null,
  phone text not null,
  email text,
  city text,
  address text,
  notes text,
  items jsonb not null default '[]'::jsonb,
  total numeric(12,2) not null default 0,
  payment_method text not null default 'request',
  status text not null default 'new',
  created_at timestamptz not null default now()
);
grant select, update, delete on public.orders to authenticated;
grant all on public.orders to service_role;
alter table public.orders enable row level security;

create policy "Admins read orders" on public.orders for select to authenticated
  using (public.has_role(auth.uid(), 'admin'));
create policy "Admins update orders" on public.orders for update to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins delete orders" on public.orders for delete to authenticated
  using (public.has_role(auth.uid(), 'admin'));

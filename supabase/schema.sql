-- Esquema Banco de Dados Lumina Finance
-- Execute este script no SQL Editor do Supabase

-- Habilita extensão para certas otimizações se necessário (opcional)
-- create extension if not exists "uuid-ossp";

-- 1. Tabela de Perfis (Profiles)
create table if not exists profiles (
  id text primary key, -- Usando text para IDs gerados no frontend (ex: 'profile_123456')
  name text not null,
  color text,
  avatar text default 'User',
  xp numeric default 0,
  level numeric default 1,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Tabela de Categorias (Categories)
create table if not exists categories (
  id text primary key,
  profile_id text not null references profiles(id) on delete cascade,
  name text not null,
  icon text not null,
  color text not null,
  parent_id text references categories(id) on delete set null, -- Para subcategorias
  budget numeric default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Tabela de Contas (Accounts)
create table if not exists accounts (
  id text primary key,
  profile_id text not null references profiles(id) on delete cascade,
  name text not null,
  type text not null, -- 'CHECKING', 'SAVINGS', etc.
  balance numeric not null default 0,
  currency text default 'BRL',
  "limit" numeric, -- Usado para cartão de crédito
  closing_date numeric, -- Dia do fechamento
  due_date numeric, -- Dia de vencimento
  color text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. Tabela de Transações (Transactions)
create table if not exists transactions (
  id text primary key,
  profile_id text not null references profiles(id) on delete cascade,
  amount numeric not null,
  date timestamp with time zone not null, -- ISO String do JS
  description text not null,
  category_id text references categories(id) on delete set null,
  account_id text not null references accounts(id) on delete cascade,
  destination_account_id text references accounts(id) on delete set null, -- Para transferências
  type text not null, -- 'EXPENSE', 'INCOME', 'TRANSFER'
  status text default 'COMPLETED', -- 'PENDING', 'COMPLETED'
  tags text[], -- Array de strings
  is_recurring boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 5. Tabela de Cofres/Metas (Vaults)
create table if not exists vaults (
  id text primary key,
  profile_id text not null references profiles(id) on delete cascade,
  name text not null,
  target_amount numeric not null,
  current_amount numeric default 0,
  deadline timestamp with time zone,
  icon text,
  color text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 6. Tabela de Dívidas (Debts)
create table if not exists debts (
  id text primary key,
  profile_id text not null references profiles(id) on delete cascade,
  name text not null,
  total_amount numeric not null,
  installments_total numeric not null,
  installments_paid numeric default 0,
  due_date numeric, -- Timestamp (ms) ou dia do mês, dependendo da implementação. No App parece ser timestamp ou dia.
  category_id text references categories(id) on delete set null,
  status text default 'ACTIVE', -- 'ACTIVE', 'PAID', 'CRITICAL'
  color text,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 7. Tabela de Despesas Fixas (Fixed Expenses)
create table if not exists fixed_expenses (
  id text primary key,
  profile_id text not null references profiles(id) on delete cascade,
  name text not null,
  amount numeric not null,
  due_date numeric, -- Dia do vencimento ou timestamp
  category_id text references categories(id) on delete set null,
  last_paid_month text, -- Formato 'YYYY-MM'
  color text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Row Level Security (RLS)
-- Como é um app pessoal/local-first simplificado, vamos permitir acesso total por enquanto.
-- Numa implementação multi-usuário real com Supabase Auth, usaríamos 'auth.uid() = user_id'.

alter table profiles enable row level security;
alter table accounts enable row level security;
alter table categories enable row level security;
alter table transactions enable row level security;
alter table vaults enable row level security;
alter table debts enable row level security;
alter table fixed_expenses enable row level security;

-- Políticas permissivas (CUIDADO: Isso expõe os dados se a chave pública for usada sem Auth real.
-- Idealmente o usuário deve configurar RLS baseado em user_id se conectar autenticação).
-- Para este caso de uso "local-sync", assumimos que o cliente possui a chave correta.

create policy "Allow all access to profiles" on profiles for all using (true) with check (true);
create policy "Allow all access to accounts" on accounts for all using (true) with check (true);
create policy "Allow all access to categories" on categories for all using (true) with check (true);
create policy "Allow all access to transactions" on transactions for all using (true) with check (true);
create policy "Allow all access to vaults" on vaults for all using (true) with check (true);
create policy "Allow all access to debts" on debts for all using (true) with check (true);
create policy "Allow all access to fixed_expenses" on fixed_expenses for all using (true) with check (true);

-- 8. Tabela de Configurações Globais (App Settings)
create table if not exists app_settings (
  id text primary key, -- 'global_settings'
  pin_enabled boolean default false,
  pin_code text,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

alter table app_settings enable row level security;
create policy "Allow all access to app_settings" on app_settings for all using (true) with check (true);

-- Inserir valor inicial
insert into app_settings (id, pin_enabled, pin_code)
values ('global_settings', false, '')
on conflict (id) do nothing;

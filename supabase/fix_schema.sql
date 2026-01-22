-- Script de Correção do Banco de Dados
-- Execute isso no SQL Editor do Supabase para garantir que todas as colunas existem

-- 1. Atualizar Tabela Accounts
alter table accounts add column if not exists color text;
alter table accounts add column if not exists "limit" numeric;
alter table accounts add column if not exists closing_date numeric;
alter table accounts add column if not exists due_date numeric;
alter table accounts add column if not exists currency text default 'BRL';

-- 2. Atualizar Tabela Profiles
alter table profiles add column if not exists xp numeric default 0;
alter table profiles add column if not exists level numeric default 1;
alter table profiles add column if not exists avatar text default 'User';

-- 3. Atualizar Tabela Transactions
alter table transactions add column if not exists destination_account_id text references accounts(id) on delete set null;
alter table transactions add column if not exists tags text[];
alter table transactions add column if not exists is_recurring boolean default false;

-- 4. Atualizar Tabela Categories
alter table categories add column if not exists parent_id text references categories(id) on delete set null;
alter table categories add column if not exists budget numeric default 0;

-- 5. Atualizar Tabela Debts
alter table debts add column if not exists description text;
alter table debts add column if not exists status text default 'ACTIVE';
alter table debts add column if not exists color text;

-- 6. Atualizar Tabela Fixed Expenses
alter table fixed_expenses add column if not exists last_paid_month text;
alter table fixed_expenses add column if not exists color text;

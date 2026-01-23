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

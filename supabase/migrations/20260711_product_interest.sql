-- 產品興趣名單：商品暫停銷售期間，收集「開賣時通知我」的登記
-- （目前用於講師 AI 幕僚 lgzuc8wf1ulcw5qu8e78uxjs 停售改等候名單）
create table if not exists public.product_interest (
  id uuid primary key default gen_random_uuid(),
  product_id text not null,
  email text not null,
  name text,
  created_at timestamptz not null default now(),
  constraint product_interest_product_email_unique unique (product_id, email)
);

-- RLS 僅 service role 可存取，比照 download_tokens 的模式
alter table public.product_interest enable row level security;

create policy "service_role_all" on public.product_interest
  for all using (auth.role() = 'service_role');

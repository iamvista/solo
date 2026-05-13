-- consulting_leads: 表單投件
CREATE TABLE consulting_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  contact_method text NOT NULL CHECK (contact_method IN ('email','line','ig')),
  contact_id text,
  topics text[] NOT NULL,
  specific_problem text NOT NULL,
  expected_outcome text,
  level text NOT NULL CHECK (level IN ('beginner','basic','intermediate','advanced','expert')),
  desired_start text CHECK (desired_start IN ('this_week','2_weeks','1_month','no_rush')),
  plan text NOT NULL CHECK (plan IN ('1hr','3hr','5hr','10hr','20hr','undecided')),
  attribution text,
  consent_terms boolean NOT NULL,
  subscribe_newsletter boolean DEFAULT false,
  status text DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','enrolled','stale')),
  vista_notes text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX idx_consulting_leads_status ON consulting_leads(status);
CREATE INDEX idx_consulting_leads_created_at ON consulting_leads(created_at DESC);

-- consulting_enrollments: 已付款學員
CREATE TABLE consulting_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES consulting_leads(id),
  name text NOT NULL,
  email text NOT NULL,
  contact_method text,
  contact_id text,
  plan text NOT NULL,
  total_hours numeric NOT NULL,
  recur_product_id text,
  recur_payment_id text,
  purchased_at timestamptz NOT NULL,
  expires_at timestamptz NOT NULL,
  extended_once boolean DEFAULT false,
  status text DEFAULT 'active' CHECK (status IN ('active','expired','completed','transferred')),
  transferred_to text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX idx_consulting_enrollments_status ON consulting_enrollments(status);
CREATE INDEX idx_consulting_enrollments_expires_at ON consulting_enrollments(expires_at);

-- consulting_sessions: 每堂課紀錄
CREATE TABLE consulting_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id uuid REFERENCES consulting_enrollments(id) ON DELETE CASCADE,
  session_date date NOT NULL,
  time_start time,
  time_end time,
  hours_used numeric NOT NULL,
  topic text NOT NULL,
  shared_doc_url text,
  vista_notes text,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX idx_consulting_sessions_enrollment_id ON consulting_sessions(enrollment_id);
CREATE INDEX idx_consulting_sessions_date ON consulting_sessions(session_date DESC);

-- 剩餘時數 view（展開欄位寫法，避開 Supabase SQL Editor 對 e.* + GROUP BY id 的 parser 限制）
CREATE VIEW consulting_enrollments_with_balance AS
SELECT
  e.id,
  e.lead_id,
  e.name,
  e.email,
  e.contact_method,
  e.contact_id,
  e.plan,
  e.total_hours,
  e.recur_product_id,
  e.recur_payment_id,
  e.purchased_at,
  e.expires_at,
  e.extended_once,
  e.status,
  e.transferred_to,
  e.created_at,
  e.updated_at,
  COALESCE(SUM(s.hours_used), 0) AS hours_used,
  e.total_hours - COALESCE(SUM(s.hours_used), 0) AS hours_remaining,
  MAX(s.session_date) AS last_session_date
FROM consulting_enrollments e
LEFT JOIN consulting_sessions s ON s.enrollment_id = e.id
GROUP BY
  e.id,
  e.lead_id,
  e.name,
  e.email,
  e.contact_method,
  e.contact_id,
  e.plan,
  e.total_hours,
  e.recur_product_id,
  e.recur_payment_id,
  e.purchased_at,
  e.expires_at,
  e.extended_once,
  e.status,
  e.transferred_to,
  e.created_at,
  e.updated_at;

-- RLS: 只允許 service role 操作（admin only）
ALTER TABLE consulting_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE consulting_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE consulting_sessions ENABLE ROW LEVEL SECURITY;

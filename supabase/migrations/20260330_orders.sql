-- ============================================
-- 訂單資料表（PAYUNi 統一金流）
-- Created: 2026-03-30
-- ============================================

CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  order_no TEXT UNIQUE NOT NULL,
  trade_no TEXT,
  product_type TEXT NOT NULL DEFAULT 'general',
  product_id TEXT,
  amount INTEGER NOT NULL,
  payment_method TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  buyer_email TEXT NOT NULL,
  buyer_name TEXT,
  paid_at TIMESTAMPTZ,
  payuni_response JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_orders_order_no ON orders(order_no);
CREATE INDEX IF NOT EXISTS idx_orders_buyer_email ON orders(buyer_email);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);

-- RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 使用者只能查看自己的訂單
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (
    auth.uid() = user_id
    OR buyer_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- Admin 可以管理所有訂單（透過 service role）
-- API Routes 使用 admin client 操作

COMMENT ON TABLE orders IS 'PAYUNi 統一金流訂單記錄';
COMMENT ON COLUMN orders.order_no IS '自產訂單編號（SOLO + timestamp + random）';
COMMENT ON COLUMN orders.trade_no IS 'PAYUNi 交易編號';
COMMENT ON COLUMN orders.product_type IS '產品類型：workshop, course, consulting, digital_product, general';
COMMENT ON COLUMN orders.payment_status IS '付款狀態：pending, paid, failed, refunded';

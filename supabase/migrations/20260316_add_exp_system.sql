-- EXP & Level system
-- Grant EXP to a user and auto-calculate level

CREATE OR REPLACE FUNCTION grant_exp(
  target_user_id UUID,
  exp_amount INTEGER,
  action_name TEXT DEFAULT 'unknown'
)
RETURNS TABLE(new_exp INTEGER, new_level INTEGER, leveled_up BOOLEAN) AS $$
DECLARE
  current_exp INTEGER;
  current_level INTEGER;
  calc_level INTEGER;
  remaining INTEGER;
  needed INTEGER;
BEGIN
  -- Get current values
  SELECT COALESCE(p.exp, 0), COALESCE(p.level, 1)
  INTO current_exp, current_level
  FROM profiles p WHERE p.id = target_user_id;

  -- Add EXP
  current_exp := current_exp + exp_amount;

  -- Recalculate level: each level requires level * 200 EXP
  calc_level := 1;
  remaining := current_exp;
  LOOP
    needed := calc_level * 200;
    EXIT WHEN remaining < needed OR calc_level >= 50;
    remaining := remaining - needed;
    calc_level := calc_level + 1;
  END LOOP;

  -- Update profile
  UPDATE profiles
  SET exp = current_exp, level = calc_level, updated_at = NOW()
  WHERE id = target_user_id;

  -- Log the EXP event
  INSERT INTO exp_events (user_id, action, exp_gained, created_at)
  VALUES (target_user_id, action_name, exp_amount, NOW());

  RETURN QUERY SELECT current_exp, calc_level, (calc_level > current_level);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- EXP event log table
CREATE TABLE IF NOT EXISTS exp_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  exp_gained INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exp_events_user ON exp_events (user_id, created_at DESC);

-- RLS: users can read their own EXP events
ALTER TABLE exp_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own EXP events"
  ON exp_events FOR SELECT
  USING (auth.uid() = user_id);

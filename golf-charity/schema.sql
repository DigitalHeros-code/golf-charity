-- ========================================================
-- DIGITAL HEROES - GOLF CHARITY PLATFORM
-- PRODUCTION SCHEMA (v1.1)
-- ========================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. CLEAN START
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP TABLE IF EXISTS public.winners CASCADE;
DROP TABLE IF EXISTS public.scores CASCADE;
DROP TABLE IF EXISTS public.draws CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.charities CASCADE;

-- 3. CHARITIES (Section 08 of PRD)
CREATE TABLE public.charities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'General',
  location TEXT DEFAULT 'Global',
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. PROFILES (Section 03 & 10 of PRD)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'user', -- 'user' or 'admin'
  subscription_status TEXT DEFAULT 'inactive', -- 'active', 'inactive', 'lapsed'
  subscription_tier TEXT DEFAULT 'monthly', -- 'monthly' or 'yearly'
  subscription_renewal_date TIMESTAMP WITH TIME ZONE,
  selected_charity_id UUID REFERENCES public.charities(id),
  charity_percentage INTEGER DEFAULT 10, -- min 10% as per PRD Section 08
  total_winnings NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. SCORES (Section 05 of PRD - Stableford 1-45)
CREATE TABLE public.scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  score_value INTEGER CHECK (score_value >= 1 AND score_value <= 45),
  date_played DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 6. DRAWS (Section 06 & 07 of PRD)
CREATE TABLE public.draws (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draw_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'simulated', 'published'
  winning_numbers INTEGER[] DEFAULT '{}',
  jackpot_amount_5 NUMERIC(14,2) DEFAULT 0, -- Rollover logic
  pool_4_match NUMERIC(14,2) DEFAULT 0,
  pool_3_match NUMERIC(14,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 7. WINNERS (Section 09 of PRD)
CREATE TABLE public.winners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draw_id UUID REFERENCES public.draws(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  prize_amount NUMERIC(10,2) NOT NULL,
  match_type INTEGER, -- 3, 4, or 5
  verification_status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  payment_status TEXT DEFAULT 'pending', -- 'pending', 'paid'
  proof_url TEXT, -- Verification proof screenshot
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 8. SEED DATA (Charities)
INSERT INTO public.charities (name, description, category, location)
VALUES 
('Golfers Against Cancer', 'Funding research through community golf events globally.', 'Health', 'National'),
('First Tee Education', 'Empowering youth through character-building skills and golf.', 'Youth', 'Global'),
('Green Fairways Initiative', 'Promoting environmental sustainability within the golf industry.', 'Environment', 'Local');

-- 9. SECURITY (Disable RLS for Dev/Trainee ease as requested)
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.scores DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.draws DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.charities DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.winners DISABLE ROW LEVEL SECURITY;

-- 10. ADMIN USER CREATION (surajkosliya2004@gmail.com / Suraj@123)
DELETE FROM auth.users WHERE email = 'surajkosliya2004@gmail.com';

WITH new_user AS (
  INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, role, aud)
  VALUES (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'surajkosliya2004@gmail.com',
    crypt('Suraj@123', gen_salt('bf')),
    now(),
    'authenticated',
    'authenticated'
  )
  RETURNING id, email
)
INSERT INTO public.profiles (id, email, full_name, role, subscription_status, subscription_tier)
SELECT id, email, 'Suraj Administrator', 'admin', 'active', 'yearly'
FROM new_user;

-- 11. PROFILE AUTOMATION TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, subscription_status)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Guest Member'),
    'user',
    'active'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
-- Create role enum if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role') THEN
    CREATE TYPE public.role AS ENUM ('admin', 'supervisor', 'operator');
  END IF;
END $$;

-- Check if profiles table exists and add columns if needed
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
    -- Add role column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'role') THEN
      ALTER TABLE public.profiles ADD COLUMN role public.role DEFAULT 'operator';
    END IF;
    
    -- Add title column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'title') THEN
      ALTER TABLE public.profiles ADD COLUMN title TEXT;
    END IF;
    
    -- Add department column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'department') THEN
      ALTER TABLE public.profiles ADD COLUMN department TEXT;
    END IF;
    
    -- Add employee_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'employee_id') THEN
      ALTER TABLE public.profiles ADD COLUMN employee_id TEXT;
    END IF;
  ELSE
    -- Create profiles table if it doesn't exist
    CREATE TABLE public.profiles (
      user_id TEXT PRIMARY KEY, -- Clerk user ID
      role public.role NOT NULL DEFAULT 'operator',
      title TEXT,
      department TEXT,
      employee_id TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  END IF;
END $$;

-- Create sites table for manufacturing facilities if it doesn't exist
CREATE TABLE IF NOT EXISTS public.sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id TEXT NOT NULL, -- Clerk organization ID
  name TEXT NOT NULL,
  location TEXT,
  address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create index on organization_id for efficient queries if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_sites_organization_id ON public.sites(organization_id); 
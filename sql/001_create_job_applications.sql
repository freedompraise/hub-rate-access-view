-- SQL migration to create job_applications table for Supabase

-- 1) Create extension for UUID if not present (Postgres default on Supabase already provides gen_random_uuid)
-- CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS public.job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text,
  phone text,
  resume_path text,
  resume_url text,
  portfolio_link text,
  can_resume_immediately boolean DEFAULT false,
  based_in_lagos boolean DEFAULT false,
  lagos_area text,
  nysc_completed boolean DEFAULT false,
  tools_email_marketing text,
  influencer_experience text,
  platforms_managed text[],
  why_fit text,
  consent_given boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_job_applications_created_at ON public.job_applications (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_job_applications_email ON public.job_applications (email);

-- Optional: Enable Row Level Security (RLS) and example policies.
-- Uncomment and adapt the policies to suit your authentication model.

-- ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
--
-- -- Allow inserts from the anon or authenticated role depending on your setup.
-- CREATE POLICY "Allow public inserts" ON public.job_applications
--   FOR INSERT
--   TO anon
--   USING (true)
--   WITH CHECK (consent_given = true);
--
-- -- Allow admins (authenticated) to select
-- CREATE POLICY "Allow authenticated select" ON public.job_applications
--   FOR SELECT
--   TO authenticated
--   USING (true);
--
-- -- You may want to lock down deletes/updates to a dedicated service role or admin accounts.

-- Notes for Supabase storage bucket "Careers":
-- In Supabase UI or via CLI, create a new bucket named: Careers
-- Set public/private based on your preference. If private, you must generate signed URLs for downloads.
-- Example CLI (supabase CLI required):
-- supabase storage bucket create Careers

-- After running this migration, the frontend will upload resumes to the 'Careers' bucket and store the path & public URL in the job_applications table.

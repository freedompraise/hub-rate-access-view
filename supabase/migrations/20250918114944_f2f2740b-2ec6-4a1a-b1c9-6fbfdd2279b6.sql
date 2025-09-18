-- Add new fields to the rate_card_requests table
ALTER TABLE public.rate_card_requests 
ADD COLUMN about_business TEXT,
ADD COLUMN additional_info TEXT,
ADD COLUMN service_interest TEXT;
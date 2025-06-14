
-- Add new columns to the rate_card_requests table
ALTER TABLE public.rate_card_requests 
ADD COLUMN brand_name TEXT,
ADD COLUMN instagram_handle TEXT,
ADD COLUMN help_needed TEXT;

-- Update the create_rate_card_request function to include the new fields
CREATE OR REPLACE FUNCTION public.create_rate_card_request(
  full_name text, 
  phone_number text, 
  email text,
  brand_name text DEFAULT NULL,
  instagram_handle text DEFAULT NULL,
  help_needed text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO rate_card_requests (full_name, phone_number, email, brand_name, instagram_handle, help_needed)
  VALUES (full_name, phone_number, email, brand_name, instagram_handle, help_needed);
END;
$function$

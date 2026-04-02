-- Add voucher_code column to assets for storing the digital voucher code/barcode number
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS voucher_code TEXT;

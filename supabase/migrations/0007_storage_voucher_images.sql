-- Create the voucher-images storage bucket (public for reading)
INSERT INTO storage.buckets (id, name, public)
VALUES ('voucher-images', 'voucher-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Allow authenticated users to upload images to their own folder
CREATE POLICY "Users can upload voucher images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'voucher-images'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow anyone to view voucher images (bucket is public)
CREATE POLICY "Public can view voucher images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'voucher-images');

-- Allow users to delete their own images
CREATE POLICY "Users can delete own voucher images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'voucher-images'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

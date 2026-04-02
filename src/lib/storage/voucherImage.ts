const BUCKET = "voucher-images";

/**
 * Build the public URL for a voucher image stored in Supabase Storage.
 * Requires the bucket to be set to "public" in Supabase dashboard.
 */
export function voucherImageUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return "";
  return `${base}/storage/v1/object/public/${BUCKET}/${path}`;
}

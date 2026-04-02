import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AssetForm } from "@/components/dashboard/AssetForm";
import type { AssetFormData } from "@/components/dashboard/AssetForm";

type Props = { params: Promise<{ id: string }> };

export default async function EditAssetPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: asset, error } = await supabase
    .from("assets")
    .select("id, title, nominal_value, ask_price, category, voucher_code, expiry, notes, image_path, status")
    .eq("id", id)
    .eq("owner_id", user.id)
    .single();

  if (error || !asset) notFound();

  const formData: AssetFormData = {
    id: asset.id,
    title: asset.title,
    nominal_value: Number(asset.nominal_value),
    ask_price: Number(asset.ask_price),
    category: asset.category,
    voucher_code: asset.voucher_code,
    expiry: asset.expiry,
    notes: asset.notes,
    image_path: asset.image_path,
    status: asset.status,
  };

  return (
    <main className="mx-auto max-w-xl px-4 py-12">
      <Link href={`/dashboard/assets/${id}`} className="link-back">
        ← חזרה לפרטי השובר
      </Link>
      <h1 className="mt-6 text-2xl font-bold text-brand-deep">עריכת שובר</h1>
      <p className="mt-2 text-sm font-medium text-slate-600">
        שנו פרטים, מחיר, קוד או תמונה — ושמרו.
      </p>
      <AssetForm userId={user.id} asset={formData} />
    </main>
  );
}

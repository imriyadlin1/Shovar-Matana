import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const STATUS_LABEL: Record<string, string> = {
  draft: "רק אצלכם",
  listed: "מוצג לאחרים",
  sold: "נסגר",
};

type Props = { params: Promise<{ id: string }> };

export default async function AssetDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: asset, error } = await supabase
    .from("assets")
    .select("*")
    .eq("id", id)
    .eq("owner_id", user.id)
    .single();

  if (error || !asset) notFound();

  return (
    <main className="mx-auto max-w-xl px-4 py-12">
      <Link href="/dashboard" className="text-sm font-semibold text-brand">
        ← חזרה לשוברים שלכם
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-brand-deep">{asset.title}</h1>
      <p className="mt-2 text-slate-600">
        {asset.nominal_value} ₪ שווי · {asset.ask_price} ₪ מבוקש · {STATUS_LABEL[asset.status] ?? asset.status}
      </p>
    </main>
  );
}

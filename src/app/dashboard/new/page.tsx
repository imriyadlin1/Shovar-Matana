import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AssetForm } from "@/components/dashboard/AssetForm";

export default async function NewAssetPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?next=/dashboard/new");

  return (
    <main className="mx-auto max-w-xl px-4 py-12">
      <h1 className="text-2xl font-bold text-brand-deep">הוספת שובר</h1>
      <p className="mt-2 text-sm font-medium text-slate-600">
        מוסיפים שובר או זיכוי — ורואים אותו מיד ברשימה שלכם.
      </p>
      <AssetForm userId={user.id} />
    </main>
  );
}

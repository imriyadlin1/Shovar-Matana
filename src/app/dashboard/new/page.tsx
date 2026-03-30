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
      <h1 className="text-2xl font-bold text-brand-deep">הוסיפו שובר שלא נגעתם בו</h1>
      <p className="mt-2 text-sm font-medium text-slate-600">
        דקה — ומיד רואים כמה כסף „יושן” אצלכם במסך הראשי.
      </p>
      <AssetForm userId={user.id} />
    </main>
  );
}

import { redirect } from "next/navigation";
import Link from "next/link";
import { User } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/profile/ProfileForm";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?next=/profile");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone, email, role, created_at")
    .eq("id", user.id)
    .single();

  const fullName = profile?.full_name ?? "";
  const phone = profile?.phone ?? "";
  const email = user.email ?? "";
  const initials = (fullName || email).slice(0, 2).toUpperCase();

  return (
    <main className="page-shell max-w-xl py-10 pb-24 md:py-14">
      <Link href="/dashboard" className="link-back">
        ← חזרה לדשבורד
      </Link>

      <div className="mt-8 flex items-center gap-4">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-brand-faint text-2xl font-bold text-brand">
          {initials || <User className="size-7" />}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-brand-deep">הפרופיל שלי</h1>
          <p className="mt-1 text-sm text-ink-muted">{email}</p>
        </div>
      </div>

      <div className="mt-8 card-elevated p-6 md:p-8">
        <ProfileForm
          userId={user.id}
          initialFullName={fullName}
          initialPhone={phone}
          email={email}
        />
      </div>

      {profile?.created_at && (
        <p className="mt-6 text-center text-xs text-ink-faint">
          חשבון נוצר ב-{new Date(profile.created_at).toLocaleDateString("he-IL", { dateStyle: "long" })}
        </p>
      )}
    </main>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Props = {
  userId: string;
  initialFullName: string;
  initialPhone: string;
  email: string;
};

export function ProfileForm({ userId, initialFullName, initialPhone, email }: Props) {
  const router = useRouter();
  const [fullName, setFullName] = useState(initialFullName);
  const [phone, setPhone] = useState(initialPhone);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSaved(false);
    try {
      const supabase = createClient();
      const { error: err } = await supabase
        .from("profiles")
        .update({
          full_name: fullName.trim() || null,
          phone: phone.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);
      if (err) {
        setError(err.message);
        return;
      }
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("שמירה נכשלה");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <label className="label-form">
        אימייל
        <input
          type="email"
          value={email}
          disabled
          className="input-field opacity-60"
        />
        <span className="text-xs text-ink-faint">לא ניתן לשנות</span>
      </label>
      <label className="label-form">
        שם מלא
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="input-field"
          placeholder="ישראל ישראלי"
          disabled={loading}
        />
      </label>
      <label className="label-form">
        טלפון
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="input-field"
          placeholder="050-1234567"
          dir="ltr"
          disabled={loading}
        />
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="btn-primary flex items-center justify-center gap-2 py-3 disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            שומר…
          </>
        ) : saved ? (
          <>
            <Check className="size-4" strokeWidth={2.5} />
            נשמר!
          </>
        ) : (
          "שמירת שינויים"
        )}
      </button>
    </form>
  );
}

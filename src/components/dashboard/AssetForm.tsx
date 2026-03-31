"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { CATEGORIES } from "@/lib/categories";

type Props = { userId: string };

export function AssetForm({ userId }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [nominal, setNominal] = useState("");
  const [ask, setAsk] = useState("");
  const [category, setCategory] = useState("");
  const [publish, setPublish] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const nominalNum = parseFloat(nominal) || 0;
    let askNum = parseFloat(ask);
    if (!Number.isFinite(askNum) || askNum < 0) {
      askNum = Math.round(nominalNum * 0.85);
    }
    try {
      const supabase = createClient();
      const { error: err } = await supabase.from("assets").insert({
        owner_id: userId,
        title: title.trim() || "ללא כותרת",
        nominal_value: nominalNum,
        ask_price: askNum,
        category: category || null,
        status: publish ? "listed" : "draft",
        published_at: publish ? new Date().toISOString() : null,
      });
      if (err) {
        setError(err.message);
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("שמירה נכשלה");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-5">
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        שם השובר
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="rounded-lg border px-3 py-2.5"
          required
          placeholder="למשל: שובר לארוחה במסעדה"
        />
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        קטגוריה
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border bg-white px-3 py-2.5 text-sm"
          required
        >
          <option value="">בחרו קטגוריה</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </label>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          שווי השובר · ₪
          <input
            type="number"
            value={nominal}
            onChange={(e) => setNominal(e.target.value)}
            className="rounded-lg border px-3 py-2.5 font-semibold tabular-nums"
            placeholder="200"
            min={0}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          מחיר מבוקש · ₪
          <input
            type="number"
            value={ask}
            onChange={(e) => setAsk(e.target.value)}
            className="rounded-lg border px-3 py-2.5 font-semibold tabular-nums"
            placeholder="ריק = 85% מהשווי"
            min={0}
          />
        </label>
      </div>
      <label className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-surface-muted/30 px-4 py-3 text-sm font-medium">
        <input
          type="checkbox"
          checked={publish}
          onChange={(e) => setPublish(e.target.checked)}
          className="size-4 rounded"
        />
        פרסמו מיד (גלוי לכולם)
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-brand py-3 text-base font-bold text-white shadow-md transition hover:bg-brand-deep disabled:opacity-60"
      >
        {loading ? "שומרים…" : "הוספת שובר"}
      </button>
    </form>
  );
}

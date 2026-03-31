"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { CATEGORIES } from "@/lib/categories";

type Props = { userId: string };

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

export function AssetForm({ userId }: Props) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [nominal, setNominal] = useState("");
  const [ask, setAsk] = useState("");
  const [category, setCategory] = useState("");
  const [publish, setPublish] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_IMAGE_SIZE) {
      setError("הקובץ גדול מדי (עד 5MB).");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("יש להעלות קובץ תמונה בלבד.");
      return;
    }
    setError(null);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function removeImage() {
    setImageFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = "";
  }

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

      let imagePath: string | null = null;
      if (imageFile) {
        const ext = imageFile.name.split(".").pop() ?? "jpg";
        const path = `${userId}/${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("voucher-images")
          .upload(path, imageFile, { upsert: false });
        if (upErr) {
          console.warn("Image upload failed, continuing without image:", upErr.message);
        } else {
          imagePath = path;
        }
      }

      const { error: err } = await supabase.from("assets").insert({
        owner_id: userId,
        title: title.trim() || "ללא כותרת",
        nominal_value: nominalNum,
        ask_price: askNum,
        category: category || null,
        image_path: imagePath,
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

      {/* Image upload */}
      <div className="flex flex-col gap-1.5 text-sm font-medium">
        <span>תמונה של השובר <span className="font-normal text-ink-faint">(אופציונלי)</span></span>
        {imagePreview ? (
          <div className="relative w-fit">
            <img
              src={imagePreview}
              alt="תצוגה מקדימה"
              className="h-32 w-auto rounded-xl border border-slate-200 object-contain shadow-sm"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute -left-2 -top-2 flex size-6 items-center justify-center rounded-full bg-red-500 text-white shadow-sm transition hover:bg-red-600"
              aria-label="הסרת תמונה"
            >
              <X className="size-3.5" strokeWidth={2.5} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 rounded-lg border border-dashed border-slate-300 px-4 py-3 text-sm text-ink-muted transition hover:border-brand hover:text-brand"
          >
            <ImagePlus className="size-5" strokeWidth={1.5} />
            הוספת תמונה
          </button>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
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

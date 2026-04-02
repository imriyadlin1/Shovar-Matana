"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { ImagePlus, X, QrCode } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { CATEGORIES } from "@/lib/categories";
import { voucherImageUrl } from "@/lib/storage/voucherImage";

export type AssetFormData = {
  id: string;
  title: string;
  nominal_value: number;
  ask_price: number;
  category: string | null;
  voucher_code: string | null;
  expiry: string | null;
  notes: string | null;
  image_path: string | null;
  status: string;
};

type Props = { userId: string; asset?: AssetFormData };

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export function AssetForm({ userId, asset }: Props) {
  const isEdit = !!asset;
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(asset?.title ?? "");
  const [nominal, setNominal] = useState(asset ? String(asset.nominal_value) : "");
  const [ask, setAsk] = useState(asset ? String(asset.ask_price) : "");
  const [category, setCategory] = useState(asset?.category ?? "");
  const [voucherCode, setVoucherCode] = useState(asset?.voucher_code ?? "");
  const [expiry, setExpiry] = useState(asset?.expiry ?? "");
  const [notes, setNotes] = useState(asset?.notes ?? "");
  const [publish, setPublish] = useState(asset?.status === "listed");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    asset?.image_path ? voucherImageUrl(asset.image_path) : null,
  );
  const [removeExistingImage, setRemoveExistingImage] = useState(false);
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
    setRemoveExistingImage(true);
    setImagePreview(URL.createObjectURL(file));
  }

  function removeImage() {
    setImageFile(null);
    if (imagePreview && imagePreview.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    setRemoveExistingImage(true);
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

      let imagePath: string | null = isEdit && !removeExistingImage ? (asset?.image_path ?? null) : null;
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

      const row = {
        title: title.trim() || "ללא כותרת",
        nominal_value: nominalNum,
        ask_price: askNum,
        category: category || null,
        voucher_code: voucherCode.trim() || null,
        expiry: expiry || null,
        notes: notes.trim() || null,
        image_path: imagePath,
        status: publish ? "listed" : (isEdit ? asset.status === "sold" ? "sold" : "draft" : "draft"),
        published_at: publish ? (asset?.status === "listed" ? undefined : new Date().toISOString()) : null,
      };

      if (isEdit) {
        const { error: err } = await supabase.from("assets").update(row).eq("id", asset.id);
        if (err) { setError(err.message); return; }
        router.push(`/dashboard/assets/${asset.id}`);
      } else {
        const { error: err } = await supabase.from("assets").insert({ owner_id: userId, ...row });
        if (err) { setError(err.message); return; }
        router.push("/dashboard");
      }
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
          className="input-field"
          required
          placeholder="למשל: שובר לארוחה במסעדה"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        קטגוריה
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="input-field"
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
            className="input-field font-semibold tabular-nums"
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
            className="input-field font-semibold tabular-nums"
            placeholder="ריק = 85% מהשווי"
            min={0}
          />
        </label>
      </div>

      <div className="rounded-2xl border border-brand/15 bg-brand-faint/30 p-4">
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          <span className="flex items-center gap-2">
            <QrCode className="size-4 text-brand" strokeWidth={2} />
            קוד השובר / מספר שובר
            <span className="font-normal text-ink-faint">(נראה רק לכם)</span>
          </span>
          <input
            value={voucherCode}
            onChange={(e) => setVoucherCode(e.target.value)}
            className="input-field font-mono tracking-wider"
            placeholder="למשל: SHV-4829-XLPR או 7290012345678"
            dir="ltr"
          />
        </label>
        <p className="mt-2 text-xs leading-relaxed text-ink-faint">
          ברקוד, קוד דיגיטלי או מספר שובר — שמרו אותו כאן ותשתפו עם הקונה בצ׳אט כשתסגרו עסקה.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          תוקף השובר
          <input
            type="date"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            className="input-field"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        הערות
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="input-field min-h-[5rem] resize-y"
          placeholder="תנאים מיוחדים, הגבלות, פרטים שכדאי לדעת…"
          rows={3}
        />
      </label>

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

      {asset?.status !== "sold" && (
        <label className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-surface-muted/30 px-4 py-3 text-sm font-medium">
          <input
            type="checkbox"
            checked={publish}
            onChange={(e) => setPublish(e.target.checked)}
            className="size-4 rounded"
          />
          {isEdit ? "מוצג לאחרים (פורסם)" : "פרסמו מיד (גלוי לכולם)"}
        </label>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="btn-cta py-3.5 text-base font-bold"
      >
        {loading ? "שומרים…" : isEdit ? "שמירת שינויים" : "הוספת שובר"}
      </button>
    </form>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";
import { Eye, EyeOff, Package, Plus, ShoppingBag } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatNis } from "@/lib/format/nis";

const STATUS_LABEL: Record<string, string> = {
  draft: "רק אצלכם",
  listed: "מוצג לאחרים",
  sold: "נסגר",
};

const STATUS_COLOR: Record<string, string> = {
  draft: "bg-slate-100 text-ink-muted",
  listed: "bg-money/15 text-money-dark",
  sold: "bg-brand-faint text-brand-deep",
};

type AssetRow = {
  id: string;
  title: string;
  nominal_value: number | string;
  ask_price: number | string;
  status: string;
  category: string | null;
  created_at: string;
  sold_at: string | null;
};

function num(v: number | string): number {
  return typeof v === "number" ? v : parseFloat(String(v)) || 0;
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ forbidden?: string }>;
}) {
  const sp = await searchParams;
  const adminForbidden = sp.forbidden === "admin";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?next=/dashboard");
  }

  const { data: assets, error } = await supabase
    .from("assets")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="page-shell py-12 pb-20">
        <div className="alert-danger max-w-2xl">
          <p className="font-semibold">לא נטענו השוברים</p>
          <p className="mt-2 text-sm opacity-90">
            בדקו חיבור ל-Supabase ושהמיגרציות הורצו. אם הבעיה נמשכת — עיינו בלוגים.
          </p>
          <code className="mt-4 block rounded-xl bg-red-100/50 px-3 py-2 text-xs text-red-950">
            {error.message}
          </code>
        </div>
      </main>
    );
  }

  const rows = (assets ?? []) as AssetRow[];
  const listedRows = rows.filter((a) => a.status === "listed");
  const draftRows = rows.filter((a) => a.status === "draft");
  const soldRows = rows.filter((a) => a.status === "sold");

  const totalValue = rows.reduce((s, a) => s + num(a.nominal_value), 0);
  const totalAsk = rows.filter((a) => a.status !== "sold").reduce((s, a) => s + num(a.ask_price), 0);

  return (
    <main className="page-shell py-10 pb-24 md:py-14">
      {adminForbidden && (
        <div className="alert-warn mb-8" role="status">
          <p className="font-medium">גישה לניהול המערכת נחסמה</p>
          <p className="mt-1 text-sm opacity-95">
            החשבון שלכם אינו אדמין — הופניתם ללוח הרגיל.
          </p>
        </div>
      )}

      {/* ── Header + CTA ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-deep md:text-3xl">השוברים שלי</h1>
          <p className="mt-1 text-sm text-ink-muted">
            {user.email}
          </p>
        </div>
        <Link href="/dashboard/new" className="btn-cta flex items-center gap-2 px-5 py-3 font-bold">
          <Plus className="size-4" strokeWidth={2.5} aria-hidden />
          הוספת שובר
        </Link>
      </div>

      {/* ── Summary cards ── */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card-elevated px-5 py-5">
          <div className="flex items-center gap-2 text-xs font-semibold text-ink-faint">
            <Package className="size-4" strokeWidth={2} aria-hidden />
            סה״כ שוברים
          </div>
          <p className="mt-2 text-3xl font-black tabular-nums text-brand-deep">{rows.length}</p>
        </div>
        <div className="card-elevated px-5 py-5">
          <div className="flex items-center gap-2 text-xs font-semibold text-ink-faint">
            <ShoppingBag className="size-4" strokeWidth={2} aria-hidden />
            שווי כולל
          </div>
          <p className="mt-2 text-3xl font-black tabular-nums text-money-dark">
            {formatNis(Math.round(totalValue))} <span className="text-lg">₪</span>
          </p>
        </div>
        <div className="card-elevated px-5 py-5">
          <div className="flex items-center gap-2 text-xs font-semibold text-money-dark">
            <Eye className="size-4" strokeWidth={2} aria-hidden />
            מפורסמים
          </div>
          <p className="mt-2 text-3xl font-black tabular-nums text-money">{listedRows.length}</p>
        </div>
        <div className="card-elevated px-5 py-5">
          <div className="flex items-center gap-2 text-xs font-semibold text-ink-faint">
            <EyeOff className="size-4" strokeWidth={2} aria-hidden />
            לא מפורסמים
          </div>
          <p className="mt-2 text-3xl font-black tabular-nums text-ink">{draftRows.length}</p>
          {totalAsk > 0 && (
            <p className="mt-1 text-xs text-ink-muted">
              מחיר מבוקש כולל: {formatNis(Math.round(totalAsk))} ₪
            </p>
          )}
        </div>
      </div>

      {/* ── Empty state ── */}
      {!rows.length && (
        <div className="card-elevated mt-10 border-dashed border-slate-300/80 bg-surface-muted/30 px-8 py-14 text-center">
          <p className="text-xl font-bold text-brand-deep">עדיין לא הוספתם שוברים</p>
          <p className="mx-auto mt-3 max-w-md text-sm font-medium text-ink-muted">
            יש לכם שובר מתנה, זיכוי או הטבה שלא השתמשתם בהם? הוסיפו אותם כאן.
          </p>
          <Link href="/dashboard/new" className="btn-cta mx-auto mt-8 inline-flex min-w-[14rem] justify-center font-bold">
            הוספת שובר ראשון
          </Link>
        </div>
      )}

      {/* ── Published section ── */}
      {listedRows.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-bold text-brand-deep">מפורסמים — גלויים לאחרים</h2>
          <p className="mt-1 text-sm text-ink-muted">שוברים שמשתמשים אחרים יכולים לראות ולפנות אליכם בצ׳אט.</p>
          <ul className="mt-5 space-y-3">
            {listedRows.map((a) => (
              <AssetListItem key={a.id} asset={a} />
            ))}
          </ul>
        </section>
      )}

      {/* ── Draft section ── */}
      {draftRows.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-bold text-ink">רק אצלכם — טרם פורסמו</h2>
          <p className="mt-1 text-sm text-ink-muted">שוברים ששמרתם אבל עדיין לא גלויים לאחרים.</p>
          <ul className="mt-5 space-y-3">
            {draftRows.map((a) => (
              <AssetListItem key={a.id} asset={a} />
            ))}
          </ul>
        </section>
      )}

      {/* ── Sold section ── */}
      {soldRows.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-bold text-ink-muted">נסגרו</h2>
          <ul className="mt-5 space-y-3">
            {soldRows.map((a) => (
              <AssetListItem key={a.id} asset={a} />
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}

function AssetListItem({ asset }: { asset: AssetRow }) {
  const nominal = num(asset.nominal_value);
  const ask = num(asset.ask_price);

  return (
    <li className="card-elevated flex flex-wrap items-center justify-between gap-4 px-5 py-4 transition duration-200 hover:border-brand/15 hover:shadow-card-hover md:px-6">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold text-brand-deep">{asset.title}</p>
          {asset.category && (
            <span className="rounded-full bg-accent-faint/80 px-2.5 py-0.5 text-[0.65rem] font-semibold text-accent ring-1 ring-accent/15">
              {asset.category}
            </span>
          )}
          <span className={`rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold ${STATUS_COLOR[asset.status] ?? "bg-slate-100 text-ink-muted"}`}>
            {STATUS_LABEL[asset.status] ?? asset.status}
          </span>
        </div>
        <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm">
          <span className="font-bold tabular-nums text-money">
            {formatNis(Math.round(nominal))} ₪ שווי
          </span>
          <span className="font-semibold tabular-nums text-brand-deep">
            {formatNis(Math.round(ask))} ₪ מבוקש
          </span>
        </div>
      </div>
      <Link
        href={`/dashboard/assets/${asset.id}`}
        className="btn-secondary border-transparent bg-brand-faint/50 px-4 py-2 text-sm font-bold text-brand-deep transition hover:bg-brand hover:text-white"
      >
        ניהול
      </Link>
    </li>
  );
}

import Link from "next/link";
import { Check, ShieldCheck } from "lucide-react";

export default function StripeSuccessPage() {
  return (
    <main className="page-shell flex min-h-[60vh] flex-col items-center justify-center py-10 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-money-faint">
        <Check className="size-8 text-money" strokeWidth={2.5} />
      </div>
      <h1 className="mt-6 text-2xl font-bold text-brand-deep md:text-3xl">
        התשלום בוצע בהצלחה!
      </h1>
      <p className="mt-3 max-w-md text-sm text-ink-muted">
        הכסף מוחזק בנאמנות. ברגע שתקבלו את קוד השובר ותאשרו — הכסף ישוחרר
        למוכר.
      </p>
      <div className="mt-2 flex items-center gap-1.5 text-xs text-money">
        <ShieldCheck className="size-3.5" strokeWidth={2} />
        <span>הכסף שלכם מוגן</span>
      </div>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/messages" className="btn-cta px-6 py-3 font-bold">
          חזרו לצ׳אט
        </Link>
        <Link
          href="/dashboard/transactions"
          className="btn-secondary px-6 py-3 font-bold"
        >
          היסטוריית עסקאות
        </Link>
      </div>
    </main>
  );
}

import Link from "next/link";
import { X } from "lucide-react";

export default async function StripeCancelPage({
  searchParams,
}: {
  searchParams: Promise<{ asset_id?: string }>;
}) {
  const sp = await searchParams;

  return (
    <main className="page-shell flex min-h-[60vh] flex-col items-center justify-center py-10 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-red-50">
        <X className="size-8 text-red-500" strokeWidth={2.5} />
      </div>
      <h1 className="mt-6 text-2xl font-bold text-brand-deep md:text-3xl">
        התשלום בוטל
      </h1>
      <p className="mt-3 max-w-md text-sm text-ink-muted">
        לא חויבתם. תוכלו לנסות שוב בכל עת.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {sp.asset_id && (
          <Link
            href={`/market/${sp.asset_id}`}
            className="btn-cta px-6 py-3 font-bold"
          >
            חזרו לשובר
          </Link>
        )}
        <Link href="/market" className="btn-secondary px-6 py-3 font-bold">
          למסחר השוברים
        </Link>
      </div>
    </main>
  );
}

export default function MarketAssetLoading() {
  return (
    <main className="mx-auto max-w-4xl animate-pulse px-4 py-10">
      <div className="h-4 w-48 rounded bg-slate-200" />
      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4 rounded-3xl bg-slate-200/80 p-8">
          <div className="h-48 rounded-2xl bg-slate-200" />
          <div className="h-8 w-3/4 rounded bg-slate-200" />
          <div className="h-24 rounded bg-slate-200" />
        </div>
        <div className="h-64 rounded-3xl bg-slate-200/80" />
      </div>
    </main>
  );
}

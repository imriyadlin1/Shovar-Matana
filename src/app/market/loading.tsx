export default function MarketLoading() {
  return (
    <main className="page-shell animate-pulse py-14">
      <div className="h-3 w-20 rounded bg-slate-200/80" />
      <div className="mt-4 h-11 w-64 rounded-xl bg-slate-200/80" />
      <div className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-80 rounded-3xl bg-slate-200/55" />
        ))}
      </div>
    </main>
  );
}

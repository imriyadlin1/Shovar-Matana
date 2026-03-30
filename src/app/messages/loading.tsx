export default function MessagesLoading() {
  return (
    <main className="page-shell-narrow animate-pulse py-12">
      <div className="h-3 w-24 rounded bg-slate-200/80" />
      <div className="mt-4 h-10 w-56 rounded-xl bg-slate-200/80" />
      <div className="mt-8 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 rounded-3xl bg-slate-200/60" />
        ))}
      </div>
    </main>
  );
}

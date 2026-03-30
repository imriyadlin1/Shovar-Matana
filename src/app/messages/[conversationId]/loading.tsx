export default function ConversationLoading() {
  return (
    <main className="mx-auto max-w-3xl animate-pulse px-4 py-8">
      <div className="h-4 w-28 rounded bg-slate-200" />
      <div className="mt-6 h-28 rounded-3xl bg-slate-200/80" />
      <div className="mt-6 h-72 rounded-3xl bg-slate-200/60" />
      <div className="mt-4 h-40 rounded-3xl bg-slate-200/60" />
    </main>
  );
}

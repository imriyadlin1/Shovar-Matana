export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] border-t-4 border-amber-400 bg-gradient-to-b from-amber-50/40 to-surface-muted/80">
      {children}
    </div>
  );
}

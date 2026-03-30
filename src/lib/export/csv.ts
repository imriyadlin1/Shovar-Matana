export function rowsToCsv(rows: Record<string, unknown>[]): string {
  if (!rows.length) return "";
  const keys = Object.keys(rows[0]);
  const esc = (v: unknown): string => {
    const s = v == null ? "" : String(v);
    if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const header = keys.map(esc).join(",");
  const lines = rows.map((row) => keys.map((k) => esc(row[k])).join(","));
  return [header, ...lines].join("\n");
}

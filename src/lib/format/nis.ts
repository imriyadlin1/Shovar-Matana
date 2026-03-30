export function formatNis(n: number) {
  return new Intl.NumberFormat("he-IL", { maximumFractionDigits: 0 }).format(n);
}

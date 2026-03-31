export const CATEGORIES = [
  "מסעדות וקפה",
  "קניות ואופנה",
  "טכנולוגיה ואלקטרוניקה",
  "טיסות ונסיעות",
  "בריאות וספורט",
  "בילויים ופנאי",
  "סופר ומזון",
  "לימודים וקורסים",
  "יופי וטיפוח",
  "אחר",
] as const;

export type Category = (typeof CATEGORIES)[number];

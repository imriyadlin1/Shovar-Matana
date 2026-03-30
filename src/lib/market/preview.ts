import { createClient } from "@/lib/supabase/server";
import type { MarketAssetCardData } from "@/components/market/MarketAssetCard";

export async function getListedAssetsPreview(limit = 6): Promise<MarketAssetCardData[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("assets")
      .select("id, title, nominal_value, ask_price, category")
      .eq("status", "listed")
      .order("published_at", { ascending: false })
      .limit(limit);

    if (error) return [];
    return (data ?? []) as MarketAssetCardData[];
  } catch {
    return [];
  }
}

import { HeaderChrome } from "@/components/layout/HeaderChrome";
import type { NavSession } from "@/lib/auth/navSession";

export function SiteHeader(props: NavSession) {
  return <HeaderChrome {...props} />;
}

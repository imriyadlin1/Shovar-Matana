import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { rowsToCsv } from "@/lib/export/csv";
import { NextRequest, NextResponse } from "next/server";

const RESOURCES = ["profiles", "assets", "messages", "site_content"] as const;
type Resource = (typeof RESOURCES)[number];

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const resource = request.nextUrl.searchParams.get("resource") as Resource | null;
  if (!resource || !RESOURCES.includes(resource)) {
    return NextResponse.json({ error: "Invalid resource" }, { status: 400 });
  }

  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return NextResponse.json({ error: "Server misconfigured: service role" }, { status: 500 });
  }

  const { data: rows, error } = await admin.from(resource).select("*").limit(50_000);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const csv = rowsToCsv((rows ?? []) as Record<string, unknown>[]);
  const filename = `${resource}_export_${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}

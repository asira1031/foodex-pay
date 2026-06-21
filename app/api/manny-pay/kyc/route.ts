import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("foodex_pay_kyc")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      ok: true,
      records: data || [],
    });
  } catch (error: any) {
    console.error("ADMIN KYC GET ERROR:", error);

    return NextResponse.json(
      {
        ok: false,
        message: error.message || "Failed to load KYC records.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json(
        { ok: false, message: "Missing id or status." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("foodex_pay_kyc")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      ok: true,
      record: data,
    });
  } catch (error: any) {
    console.error("ADMIN KYC UPDATE ERROR:", error);

    return NextResponse.json(
      {
        ok: false,
        message: error.message || "Failed to update KYC status.",
      },
      { status: 500 }
    );
  }
}
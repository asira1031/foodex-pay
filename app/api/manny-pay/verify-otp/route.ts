import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { ok: false, message: "Missing email or OTP." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("manny_pay_clients")
      .select("*")
      .eq("email", email)
      .eq("otp_code", otp)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { ok: false, message: "Invalid OTP." },
        { status: 400 }
      );
    }

    if (new Date(data.otp_expires_at).getTime() < Date.now()) {
      return NextResponse.json(
        { ok: false, message: "OTP expired." },
        { status: 400 }
      );
    }

    const { error: updateError } = await supabase
      .from("manny_pay_clients")
      .update({
        email_verified: true,
        otp_code: null,
        otp_expires_at: null,
      })
      .eq("email", email);

    if (updateError) throw updateError;

    return NextResponse.json({
      ok: true,
      message: "Email verified successfully.",
      client: data,
    });
  } catch (error: any) {
    console.error("VERIFY OTP ERROR:", error);

    return NextResponse.json(
      { ok: false, message: error.message || "OTP verification failed." },
      { status: 500 }
    );
  }
}
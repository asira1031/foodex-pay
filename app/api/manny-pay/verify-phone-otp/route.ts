import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { email, phone, otp } = await req.json();

    if (!email || !phone || !otp) {
      return NextResponse.json(
        { ok: false, message: "Missing email, phone, or OTP." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("manny_pay_clients")
      .select("*")
      .eq("email", email)
      .eq("phone", phone)
      .eq("phone_otp_code", otp)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { ok: false, message: "Invalid phone OTP." },
        { status: 400 }
      );
    }

    if (new Date(data.phone_otp_expires_at).getTime() < Date.now()) {
      return NextResponse.json(
        { ok: false, message: "Phone OTP expired." },
        { status: 400 }
      );
    }

    const { error: updateError } = await supabase
      .from("manny_pay_clients")
      .update({
        phone_verified: true,
        phone_otp_code: null,
        phone_otp_expires_at: null,
      })
      .eq("email", email)
      .eq("phone", phone);

    if (updateError) throw updateError;

    return NextResponse.json({
      ok: true,
      message: "Phone verified successfully.",
    });
  } catch (error: any) {
    console.error("VERIFY PHONE OTP ERROR:", error);

    return NextResponse.json(
      { ok: false, message: error.message || "Phone verification failed." },
      { status: 500 }
    );
  }
}
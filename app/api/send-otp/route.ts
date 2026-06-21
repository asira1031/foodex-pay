import { NextResponse } from "next/server";
import twilio from "twilio";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();

    if (!phone) {
      return NextResponse.json({ ok: false, error: "Phone is required" }, { status: 400 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    const { error: dbError } = await supabaseAdmin
      .from("foodex_pay_phone_otps")
      .insert({
        phone,
        otp_code: otp,
        expires_at: expiresAt,
        verified: false,
      });

    if (dbError) throw dbError;

    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID!,
      process.env.TWILIO_AUTH_TOKEN!
    );

    await client.messages.create({
      body: `Your Foodex Pay verification code is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER!,
      to: phone,
    });

    return NextResponse.json({ ok: true, message: "OTP sent successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error.message || "Failed to send OTP" },
      { status: 500 }
    );
  }
}
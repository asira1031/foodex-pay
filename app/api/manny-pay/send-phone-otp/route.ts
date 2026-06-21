import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import twilio from "twilio";

export const runtime = "nodejs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

function makeOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();

    if (!phone) {
      return NextResponse.json(
        { ok: false, message: "Phone number required." },
        { status: 400 }
      );
    }

    const otp = makeOtp();
    const expires = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    console.log("PHONE OTP FOR TEST:", otp);

    const { error } = await supabase
      .from("manny_pay_clients")
      .update({
        phone_otp_code: otp,
        phone_otp_expires_at: expires,
      })
      .eq("phone", phone);

    if (error) throw error;

    await twilioClient.messages.create({
      body: `Your Manny Pay verification code is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER!,
      to: phone,
    });

    return NextResponse.json({
      ok: true,
      message: "Phone OTP sent.",
    });
  } catch (error: any) {
    console.error("SEND PHONE OTP ERROR:", error);

    return NextResponse.json(
      {
        ok: false,
        message: error.message || "Failed to send phone OTP.",
      },
      { status: 500 }
    );
  }
}
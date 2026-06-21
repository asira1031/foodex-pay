import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY!);

function makeOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  try {
    const { fullName, email, phone, password } = await req.json();

    if (!fullName || !email || !phone || !password) {
      return NextResponse.json(
        { ok: false, message: "Missing required fields." },
        { status: 400 }
      );
    }

    const otp = makeOtp();
    const expires = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    console.log("FOODEX PAY OTP FOR TEST:", otp);

    const { error } = await supabase.from("foodex_pay_clients").upsert(
      {
        full_name: fullName,
        email,
        phone,
        password,
        email_verified: false,
        otp_code: otp,
        otp_expires_at: expires,
      },
      { onConflict: "email" }
    );

    if (error) throw error;

    const emailResult = await resend.emails.send({
      from: process.env.FOODEX_EMAIL_FROM || "Foodex Pay <onboarding@resend.dev>",
      to: email,
      subject: "Your Foodex Pay OTP Code",
      html: `
        <h2>Foodex Pay Email Verification</h2>
        <p>Hello ${fullName},</p>
        <p>Your OTP code is:</p>
        <h1>${otp}</h1>
        <p>This code expires in 10 minutes.</p>
      `,
    });

    console.log("RESEND RESULT:", emailResult);

    return NextResponse.json({
      ok: true,
      message: "OTP sent successfully.",
    });
  } catch (error: any) {
    console.error("SEND OTP ERROR:", error);

    return NextResponse.json(
      {
        ok: false,
        message: error.message || "Failed to send OTP.",
      },
      { status: 500 }
    );
  }
}
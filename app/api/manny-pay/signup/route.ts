import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { Resend } from "resend";

export const runtime = "nodejs";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { fullName, email, mobile, birthday, birthPlace, pin } = body;

    if (!fullName || !email || !mobile || !birthday || !birthPlace || !pin) {
      return NextResponse.json(
        { ok: false, message: "Missing required fields." },
        { status: 400 }
      );
    }

    if (String(pin).length !== 6) {
      return NextResponse.json(
        { ok: false, message: "PIN must be 6 digits." },
        { status: 400 }
      );
    }

    const { data: existingUser } = await supabase
      .from("wallet_users")
      .select("id")
      .or(`mobile.eq.${mobile},email.eq.${email}`)
      .maybeSingle();

    if (existingUser) {
      return NextResponse.json(
        { ok: false, message: "Mobile number or email already registered." },
        { status: 409 }
      );
    }

    const walletId = `MP-${Date.now()}`;

    const { data, error } = await supabase
      .from("wallet_users")
      .insert([
        {
          full_name: fullName,
          email,
          mobile,
          birthday,
          birth_place: birthPlace,
          pin_code: pin,
          balance: 0,
          wallet_id: walletId,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { ok: false, message: error.message },
        { status: 500 }
      );
    }

    try {
      await resend.emails.send({
        from:
          process.env.FOODEX_EMAIL_FROM ||
          "Foodex Pay <noreply@foodex-pay.com>",
        to: email,
        subject: "Welcome to Foodex Pay",
        html: `
          <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:24px; background:#ffffff; color:#111827;">
            <div style="text-align:center; padding:20px 0;">
              <h1 style="margin:0; font-size:28px; color:#111827;">
                Welcome to Foodex Pay
              </h1>
              <p style="margin-top:8px; color:#6b7280;">
                Mobile fintech super app
              </p>
            </div>

            <div style="background:#f9fafb; border-radius:16px; padding:24px; border:1px solid #e5e7eb;">
              <p>Hello <strong>${fullName}</strong>,</p>

              <p>
                Thank you for joining <strong>Foodex Pay</strong>.
                Your wallet account has been successfully created.
              </p>

              <p>You can now access:</p>

              <ul>
                <li>Digital wallet services</li>
                <li>QR payments</li>
                <li>Bank transfers</li>
                <li>Merchant payments</li>
                <li>Real-time transaction notifications</li>
              </ul>

              <p>
                Your Foodex Pay Wallet ID:
                <strong>${walletId}</strong>
              </p>

              <p>
                Best regards,<br />
                <strong>Foodex Pay Team</strong>
              </p>
            </div>

            <p style="font-size:12px; color:#6b7280; text-align:center; margin-top:24px;">
              This is an automated email from Foodex Pay. Please do not reply directly to this message.
            </p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("WELCOME EMAIL FAILED:", emailError);
    }

    return NextResponse.json({
      ok: true,
      user: data,
      message: "Wallet account created successfully.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, message: error.message || "Server error." },
      { status: 500 }
    );
  }
}
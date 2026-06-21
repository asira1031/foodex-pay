import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function GET() {
  try {
    const result = await resend.emails.send({
      from:
        process.env.FOODEX_EMAIL_FROM ||
        "Fodex Pay <noreply@fooder-pay.com>",
      to: "asira1031@gmail.com",
      subject: "Welcome to Fooder Pay",
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
            <p>Hello,</p>

            <p>
              Thank you for joining <strong>Foodex Pay</strong>.
              Your account has been successfully created.
            </p>

            <p>You can now enjoy:</p>

            <ul>
              <li>Bank transfers</li>
              <li>QR payments</li>
              <li>Digital wallet services</li>
              <li>Secure transactions</li>
              <li>Real-time notifications</li>
            </ul>

            <p>
              We are excited to have you as part of the Foodex Pay community.
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

    return NextResponse.json({
      ok: true,
      result,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        message: error.message || "Email test failed.",
      },
      { status: 500 }
    );
  }
}
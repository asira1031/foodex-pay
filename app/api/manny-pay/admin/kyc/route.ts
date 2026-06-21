import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

export const runtime = "nodejs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY!);

function kycApprovedEmail(fullName: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:24px; background:#ffffff; color:#111827;">
      <div style="text-align:center; padding:20px 0;">
        <h1 style="margin:0; font-size:28px; color:#111827;">
          Manny Pay KYC Approved
        </h1>
        <p style="margin-top:8px; color:#6b7280;">
          Your identity verification has been completed.
        </p>
      </div>

      <div style="background:#f9fafb; border-radius:16px; padding:24px; border:1px solid #e5e7eb;">
        <p>Hello <strong>${fullName || "Manny Pay User"}</strong>,</p>

        <p>
          Congratulations! Your Manny Pay KYC verification has been approved.
          Your account is now verified.
        </p>

        <p>You may now access verified wallet features, including:</p>

        <ul>
          <li>Cash In</li>
          <li>Send Money</li>
          <li>Bank Transfers</li>
          <li>QR Payments</li>
          <li>Wallet Services</li>
        </ul>

        <p>
          Thank you for completing your verification.
        </p>

        <p>
          Best regards,<br />
          <strong>Manny Pay Team</strong>
        </p>
      </div>

      <p style="font-size:12px; color:#6b7280; text-align:center; margin-top:24px;">
        This is an automated email from Manny Pay. Please do not reply directly to this message.
      </p>
    </div>
  `;
}

function kycRejectedEmail(fullName: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:24px; background:#ffffff; color:#111827;">
      <div style="text-align:center; padding:20px 0;">
        <h1 style="margin:0; font-size:28px; color:#111827;">
          Manny Pay KYC Update
        </h1>
        <p style="margin-top:8px; color:#6b7280;">
          Your verification needs attention.
        </p>
      </div>

      <div style="background:#f9fafb; border-radius:16px; padding:24px; border:1px solid #e5e7eb;">
        <p>Hello <strong>${fullName || "Manny Pay User"}</strong>,</p>

        <p>
          We reviewed your KYC submission, but it could not be approved at this time.
          Please submit clear and valid documents again.
        </p>

        <p>
          Best regards,<br />
          <strong>Manny Pay Team</strong>
        </p>
      </div>

      <p style="font-size:12px; color:#6b7280; text-align:center; margin-top:24px;">
        This is an automated email from Manny Pay. Please do not reply directly to this message.
      </p>
    </div>
  `;
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("manny_pay_kyc")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      ok: true,
      records: data || [],
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, message: error.message || "Failed to load KYC records." },
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
      .from("manny_pay_kyc")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    if (data?.client_email && status === "APPROVED") {
      await resend.emails.send({
        from:
          process.env.MANNY_EMAIL_FROM ||
          "Manny Pay <noreply@manny-pay.com>",
        to: data.client_email,
        subject: "Your Manny Pay KYC Has Been Approved",
        html: kycApprovedEmail(data.full_name),
      });
    }

    if (data?.client_email && status === "REJECTED") {
      await resend.emails.send({
        from:
          process.env.MANNY_EMAIL_FROM ||
          "Manny Pay <noreply@manny-pay.com>",
        to: data.client_email,
        subject: "Manny Pay KYC Update",
        html: kycRejectedEmail(data.full_name),
      });
    }

    return NextResponse.json({
      ok: true,
      record: data,
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, message: error.message || "Failed to update KYC status." },
      { status: 500 }
    );
  }
}
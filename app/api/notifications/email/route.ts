import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { to, subject, message } = await req.json();

    if (!to || !subject || !message) {
      return NextResponse.json(
        { ok: false, error: "Missing email fields." },
        { status: 400 }
      );
    }

    const from =
      process.env.FOODEX_EMAIL_FROM ||
      "Foodex Pay <onboarding@resend.dev>";

    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html: `
        <div style="font-family:Arial;padding:24px">
          <h2 style="color:#1E3A8A">Foodex Pay</h2>
          <p>${message}</p>
          <hr />
          <p style="font-size:12px;color:#777">
            This is an automated notification from Foodex Pay.
          </p>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json(
        { ok: false, error },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, data });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 }
    );
  }
}
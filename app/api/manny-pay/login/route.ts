import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import crypto from "crypto";

function hashPin(pin: string) {
  return crypto
    .createHash("sha256")
    .update(pin)
    .digest("hex");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const phone = String(body.phone || "").trim();
    const pin = String(body.pin || "").trim();
    const deviceName = body.deviceName || "Unknown Device";

    if (!phone || !pin) {
      return NextResponse.json(
        {
          ok: false,
          message: "Phone and PIN are required",
        },
        { status: 400 }
      );
    }

    const pinHash = hashPin(pin);

    const { data: user, error } = await supabase
      .from("wallet_users")
      .select("*")
      .eq("mobile", phone)
      .eq("pin_hash", pinHash)
      .single();

    if (error || !user) {
      return NextResponse.json(
        {
          ok: false,
          message: "Invalid phone number or PIN",
        },
        { status: 401 }
      );
    }

    const sessionToken = crypto.randomUUID();

    const expiresAt = new Date(
      Date.now() + 1000 * 60 * 60 * 24 * 7
    ).toISOString();

    await supabase
      .from("wallet_users")
      .update({
        session_token: sessionToken,
        session_expires_at: expiresAt,
        last_login_at: new Date().toISOString(),
        device_name: deviceName,
      })
      .eq("wallet_id", user.wallet_id);

    await supabase.from("notifications").insert([
      {
        wallet_id: user.wallet_id,
        title: "Login Detected",
        message: `New login from ${deviceName}`,
        type: "security",
        is_read: false,
      },
    ]);

    return NextResponse.json({
      ok: true,
      message: "Login successful",
      wallet: {
        wallet_id: user.wallet_id,
        full_name: user.full_name,
        mobile: user.mobile,
        email: user.email,
        balance: user.balance,
        kyc_status: user.kyc_status,
        session_token: sessionToken,
        session_expires_at: expiresAt,
      },
    });
  } catch (error: any) {
    console.log(error);

    return NextResponse.json(
      {
        ok: false,
        message: error.message || "Login failed",
      },
      { status: 500 }
    );
  }
}
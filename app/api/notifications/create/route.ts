import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { user_email, title, message, type } = body;

    if (!user_email || !title || !message) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("notifications")
      .insert([
        {
          user_email,
          title,
          message,
          type: type || "info",
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      notification: data,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 }
    );
  }
}
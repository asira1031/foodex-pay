import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      wallet_phone,
      type,
      amount,
      method,
      status,
      recipient,
      note,
    } = body;

    const { data, error } = await supabase
      .from("wallet_transactions")
      .insert([
        {
          wallet_phone,
          type,
          amount,
          method,
          status,
          recipient,
          note,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        {
          ok: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      transaction: data,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        error: err.message,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  const { data, error } = await supabase
    .from("wallet_transactions")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    transactions: data,
  });
}
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const body = await req.json();

  const walletId = "AW-CLIENT-0001";
  const amount = Number(body.amount);
  const method = body.method;

  if (!amount || amount <= 0) {
    return NextResponse.json(
      { ok: false, message: "Invalid amount" },
      { status: 400 }
    );
  }

  const reference = `AW-CASHIN-${Date.now()}`;

  const { error } = await supabase.from("wallet_transactions").insert([
    {
      wallet_id: walletId,
      reference,
      transaction_type: "Cash In",
      amount,
      status: "PENDING",
      description: `Cash in via ${method}`,
    },
  ]);

  if (error) {
    return NextResponse.json(
      { ok: false, message: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    reference,
    message: "Cash in request submitted",
  });
}
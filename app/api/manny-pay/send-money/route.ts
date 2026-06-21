import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const body = await req.json();

  const senderWalletId = "AW-CLIENT-0001";
  const receiverWalletId = body.receiverWalletId;
  const amount = Number(body.amount);

  if (!receiverWalletId || !amount || amount <= 0) {
    return NextResponse.json(
      { ok: false, message: "Invalid transfer details" },
      { status: 400 }
    );
  }

  const { data: sender } = await supabase
    .from("wallet_users")
    .select("balance")
    .eq("wallet_id", senderWalletId)
    .single();

  const { data: receiver } = await supabase
    .from("wallet_users")
    .select("balance")
    .eq("wallet_id", receiverWalletId)
    .single();

  if (!sender) {
    return NextResponse.json({ ok: false, message: "Sender not found" });
  }

  if (!receiver) {
    return NextResponse.json({ ok: false, message: "Receiver not found" });
  }

  if (Number(sender.balance) < amount) {
    return NextResponse.json({ ok: false, message: "Insufficient balance" });
  }

  const reference = `AW-SEND-${Date.now()}`;

  await supabase
    .from("wallet_users")
    .update({ balance: Number(sender.balance) - amount })
    .eq("wallet_id", senderWalletId);

  await supabase
    .from("wallet_users")
    .update({ balance: Number(receiver.balance) + amount })
    .eq("wallet_id", receiverWalletId);

  await supabase.from("wallet_transactions").insert([
    {
      wallet_id: senderWalletId,
      reference,
      transaction_type: "Send Money",
      amount,
      status: "COMPLETED",
      description: `Sent to ${receiverWalletId}`,
    },
    {
      wallet_id: receiverWalletId,
      reference,
      transaction_type: "Receive Money",
      amount,
      status: "COMPLETED",
      description: `Received from ${senderWalletId}`,
    },
  ]);

  return NextResponse.json({
    ok: true,
    reference,
    message: "Money sent successfully",
  });
}
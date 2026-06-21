import { supabase } from "@/lib/supabase";

export async function getWalletBalance(
  phone: string
) {
  const { data, error } = await supabase
    .from("wallet_users")
    .select("balance")
    .eq("phone", phone)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return Number(data.balance || 0);
}

export async function updateWalletBalance(
  phone: string,
  newBalance: number
) {
  const { error } = await supabase
    .from("wallet_users")
    .update({
      balance: newBalance,
    })
    .eq("phone", phone);

  if (error) {
    throw new Error(error.message);
  }
}

export async function createWalletTransaction({
  wallet_phone,
  type,
  amount,
  method,
  status,
  recipient,
  note,
}: {
  wallet_phone: string;
  type: string;
  amount: number;
  method: string;
  status: string;
  recipient?: string;
  note?: string;
}) {
  const { error } = await supabase
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
    ]);

  if (error) {
    throw new Error(error.message);
  }
}

export async function transferWalletFunds({
  wallet_phone,
  amount,
  type,
  method,
  recipient,
}: {
  wallet_phone: string;
  amount: number;
  type: string;
  method: string;
  recipient?: string;
}) {
  const balance = await getWalletBalance(
    wallet_phone
  );

  if (amount > balance) {
    throw new Error("Insufficient balance");
  }

  const updatedBalance = balance - amount;

  await updateWalletBalance(
    wallet_phone,
    updatedBalance
  );

  await createWalletTransaction({
    wallet_phone,
    type,
    amount,
    method,
    status: "Completed",
    recipient,
  });

  return {
    success: true,
    balance: updatedBalance,
  };
}
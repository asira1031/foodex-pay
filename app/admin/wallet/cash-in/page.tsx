"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminCashInPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadTransactions();
  }, []);

  async function loadTransactions() {
    const { data } = await supabase
      .from("wallet_transactions")
      .select("*")
      .eq("transaction_type", "Cash In")
      .order("created_at", { ascending: false });

    setTransactions(data || []);
  }

  async function approveCashIn(tx: any) {
    setMessage("");

    const { data: wallet } = await supabase
      .from("wallet_users")
      .select("balance")
      .eq("wallet_id", tx.wallet_id)
      .single();

    const newBalance = Number(wallet?.balance || 0) + Number(tx.amount);

    await supabase
      .from("wallet_users")
      .update({ balance: newBalance })
      .eq("wallet_id", tx.wallet_id);

    await supabase
      .from("wallet_transactions")
      .update({ status: "COMPLETED" })
      .eq("id", tx.id);

    setMessage(`✅ Approved ${tx.reference}`);
    loadTransactions();
  }

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold">Cash In Approval</h1>
        <p className="text-white/40 mt-2">
          Review and approve wallet top-up requests.
        </p>

        {message && (
          <div className="mt-6 rounded-2xl bg-white/5 border border-white/10 p-4">
            {message}
          </div>
        )}

        <div className="mt-8 space-y-4">
          {transactions.length === 0 ? (
            <div className="rounded-3xl bg-white/5 border border-white/10 p-6 text-white/40">
              No cash-in transactions found.
            </div>
          ) : (
            transactions.map((tx) => (
              <div
                key={tx.id}
                className="rounded-3xl bg-white/5 border border-white/10 p-5"
              >
                <div className="flex justify-between gap-6">
                  <div>
                    <p className="text-white/40 text-sm">Reference</p>
                    <h2 className="font-bold">{tx.reference}</h2>

                    <p className="text-white/40 text-sm mt-3">Wallet ID</p>
                    <p>{tx.wallet_id}</p>

                    <p className="text-white/40 text-sm mt-3">Description</p>
                    <p>{tx.description}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-white/40 text-sm">Amount</p>
                    <p className="text-2xl font-bold">
                      ₱{Number(tx.amount).toLocaleString("en-PH", {
                        minimumFractionDigits: 2,
                      })}
                    </p>

                    <p className="text-white/40 text-sm mt-3">Status</p>
                    <p
                      className={
                        tx.status === "COMPLETED"
                          ? "text-emerald-400 font-bold"
                          : "text-yellow-400 font-bold"
                      }
                    >
                      {tx.status}
                    </p>

                    {tx.status !== "COMPLETED" && (
                      <button
                        onClick={() => approveCashIn(tx)}
                        className="mt-5 rounded-2xl bg-emerald-500 text-black px-6 py-3 font-bold"
                      >
                        Approve
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
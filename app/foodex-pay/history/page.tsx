"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type WalletTransaction = {
  id: string;
  type: string;
  amount: number;
  method: string;
  status: string;
  createdAt: string;
};

export default function HistoryPage() {
  const router = useRouter();

  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("manny_pay_transactions");

    setTransactions(stored ? JSON.parse(stored) : []);
  }, []);

  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-md">
        <button
          onClick={() => router.back()}
          className="mb-8 text-3xl"
        >
          ←
        </button>

        <h1 className="text-3xl font-bold">
          Transaction History
        </h1>

        <p className="mt-2 text-white/40">
          Wallet activity and transfers
        </p>

        <div className="mt-8 space-y-4">
          {transactions.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center text-white/40">
              No transaction history yet.
            </div>
          ) : (
            transactions.map((tx) => (
              <div
                key={tx.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-5"
              >
                <div className="flex justify-between">
                  <div>
                    <h2 className="text-lg font-bold">
                      {tx.type}
                    </h2>

                    <p className="mt-1 text-sm text-white/40">
                      {tx.id}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold">
                      ₱{Number(tx.amount).toLocaleString()}
                    </p>

                    <p className="mt-1 text-sm text-emerald-400">
                      {tx.status}
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-sm text-white/50">
                  via {tx.method}
                </p>

                <p className="mt-2 text-xs text-white/30">
                  {new Date(tx.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
"use client";

import { useEffect, useState } from "react";

type Transaction = {
  id: string;
  type: string;
  amount: number;
  method: string;
  status: string;
  recipient?: string;
  createdAt: string;
};

export default function MerchantPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [merchantBalance, setMerchantBalance] = useState(0);

  useEffect(() => {
    const existing = localStorage.getItem(
      "manny_pay_wallet_transactions"
    );

    const txs = existing ? JSON.parse(existing) : [];

    const merchantTxs = txs.filter(
      (tx: Transaction) =>
        tx.type === "QR Payment" ||
        tx.type === "Shop Purchase"
    );

    setTransactions(merchantTxs);

    const total = merchantTxs.reduce(
      (sum: number, tx: Transaction) =>
        sum + Number(tx.amount),
      0
    );

    setMerchantBalance(total);
  }, []);

  return (
    <main className="min-h-screen bg-black px-6 py-8 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-3xl bg-white/5 p-8">
          <p className="text-sm text-white/50">
            Manny Pay Merchant Portal
          </p>

          <h1 className="mt-3 text-5xl font-bold">
            ₱{merchantBalance.toLocaleString()}
          </h1>

          <p className="mt-2 text-white/50">
            Merchant Settlement Balance
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <Card
            title="Today's Sales"
            value={`₱${merchantBalance.toLocaleString()}`}
          />

          <Card
            title="Transactions"
            value={`${transactions.length}`}
          />

          <Card
            title="Status"
            value="ACTIVE"
          />
        </div>

        <div className="mt-8 rounded-3xl bg-white/5 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              Merchant Transactions
            </h2>

            <button className="rounded-2xl bg-emerald-600 px-5 py-3 font-semibold">
              Generate QR
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {transactions.length === 0 && (
              <div className="rounded-2xl bg-white/5 p-5 text-white/50">
                No merchant payments yet.
              </div>
            )}

            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="rounded-2xl bg-white/5 p-5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold">
                      {tx.type}
                    </h3>

                    <p className="mt-1 text-sm text-white/50">
                      {tx.recipient}
                    </p>

                    <p className="mt-1 text-xs text-white/30">
                      {new Date(
                        tx.createdAt
                      ).toLocaleString()}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-bold text-emerald-400">
                      ₱{Number(tx.amount).toLocaleString()}
                    </p>

                    <p className="text-sm text-white/50">
                      {tx.status}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-3xl bg-yellow-500/10 p-6 text-yellow-200">
          Demo merchant acquiring system only. Real merchant onboarding and
          settlements will activate during production integration.
        </div>
      </div>
    </main>
  );
}

function Card({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl bg-white/5 p-6">
      <p className="text-sm text-white/50">
        {title}
      </p>

      <h2 className="mt-3 text-3xl font-bold">
        {value}
      </h2>
    </div>
  );
}
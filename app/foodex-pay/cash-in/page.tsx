"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type WalletTransaction = {
  id: string;
  type: string;
  amount: number;
  method: string;
  status: string;
  createdAt: string;
};

export default function CashInPage() {
  const router = useRouter();

  const [method, setMethod] = useState("Bank Transfer");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  function handleContinue() {
    if (!amount || Number(amount) <= 0) {
      setMessage("Please enter a valid amount.");
      return;
    }

    const currentBalance = Number(
      localStorage.getItem("foodex_pay_balance") || "0"
    );

    const updatedBalance = currentBalance + Number(amount);

    localStorage.setItem("foodex_pay_balance", updatedBalance.toString());

    const transaction: WalletTransaction = {
      id: `AW-CASHIN-${Date.now()}`,
      type: "Cash In",
      amount: Number(amount),
      method,
      status: "Completed",
      createdAt: new Date().toISOString(),
    };

    const existing = localStorage.getItem("foodex_pay_transactions");
    const transactions: WalletTransaction[] = existing
      ? JSON.parse(existing)
      : [];

    localStorage.setItem(
      "foodex_pay_transactions",
      JSON.stringify([transaction, ...transactions])
    );

    alert(`Cash in successful: ₱${Number(amount).toLocaleString()} via ${method}`);
    router.push("/foodex-pay/dashboard");
  }

  return (
    <main className="min-h-screen bg-[#f7f7f7] px-6 py-8 text-black">
      <div className="mx-auto max-w-sm">
        <button onClick={() => router.back()} className="mb-8 text-3xl">
          ←
        </button>

        <h1 className="mb-2 text-3xl font-bold">Cash In</h1>

        <p className="mb-8 text-gray-500">Add money to your foodex Pay Wallet.</p>

        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <label className="text-sm text-gray-500">Amount</label>

          <div className="mt-2 flex items-center rounded-2xl bg-gray-100 px-4 py-4">
            <span className="mr-2 text-2xl font-bold">₱</span>

            <input
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value.replace(/[^0-9.]/g, ""))
              }
              placeholder="0.00"
              inputMode="decimal"
              className="w-full bg-transparent text-3xl font-bold outline-none"
            />
          </div>
        </div>

        <h2 className="mb-3 mt-8 text-xl font-bold">Cash-in method</h2>

        <div className="space-y-4">
          {["Bank Transfer", "E-wallet", "Card", "Crypto"].map((item) => (
            <button
              key={item}
              onClick={() => {
                setMethod(item);
                setMessage("");
              }}
              className={`w-full rounded-3xl p-5 text-left font-bold shadow-sm ${
                method === item ? "bg-black text-white" : "bg-white text-black"
              }`}
            >
              {item}
              <span className="float-right">{method === item ? "✓" : "›"}</span>
            </button>
          ))}
        </div>

        {message && (
          <p className="mt-5 rounded-2xl bg-red-100 p-4 text-sm text-red-700">
            {message}
          </p>
        )}

        <button
          onClick={handleContinue}
          className="mt-8 w-full rounded-2xl bg-emerald-600 py-4 font-bold text-white"
        >
          Continue
        </button>
      </div>
    </main>
  );
}
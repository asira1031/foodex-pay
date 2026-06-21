"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

type WalletTransaction = {
  id: string;
  type: string;
  amount: number;
  method: string;
  status: string;
  createdAt: string;
  recipient?: string;
};

export default function NetworkLoadPage() {
  const router = useRouter();
  const params = useParams();

  const network = String(params.network || "")
    .replaceAll("-", " ")
    .toUpperCase();

  const [mobile, setMobile] = useState("");
  const [amount, setAmount] = useState("");

  function handleBuyLoad() {
    if (!mobile || !amount) {
      alert("Please complete all fields.");
      return;
    }

    const loadAmount = Number(amount);

    const currentBalance = Number(
      localStorage.getItem("manny_pay_balance") || "0"
    );

    if (loadAmount <= 0) {
      alert("Invalid amount.");
      return;
    }

    if (loadAmount > currentBalance) {
      alert("Insufficient wallet balance.");
      return;
    }

    const updatedBalance = currentBalance - loadAmount;

    localStorage.setItem(
      "manny_pay_balance",
      updatedBalance.toString()
    );

    const transaction: WalletTransaction = {
      id: `AW-LOAD-${Date.now()}`,
      type: "Mobile Load",
      amount: loadAmount,
      method: network,
      status: "Completed",
      recipient: mobile,
      createdAt: new Date().toISOString(),
    };

    const existing = localStorage.getItem(
      "manny_pay_transactions"
    );

    const transactions: WalletTransaction[] = existing
      ? JSON.parse(existing)
      : [];

    localStorage.setItem(
      "manny_pay_transactions",
      JSON.stringify([transaction, ...transactions])
    );

    localStorage.setItem(
      "manny_pay_latest_receipt",
      JSON.stringify(transaction)
    );

    router.push("/manny-pay/receipt");
  }

  return (
    <main className="min-h-screen bg-[#f5f5f5] px-5 py-6 text-black">
      <div className="mx-auto max-w-sm">
        <button
          onClick={() => router.back()}
          className="mb-6 text-3xl"
        >
          ←
        </button>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold">
            {network}
          </h1>

          <p className="mt-3 text-gray-500">
            Buy prepaid mobile load using Manny Pay.
          </p>

          <div className="mt-8">
            <label className="text-sm text-gray-500">
              Mobile Number
            </label>

            <input
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="09XXXXXXXXX"
              className="mt-2 w-full rounded-2xl bg-gray-100 px-4 py-4 outline-none"
            />
          </div>

          <div className="mt-5">
            <label className="text-sm text-gray-500">
              Amount
            </label>

            <input
              value={amount}
              onChange={(e) =>
                setAmount(
                  e.target.value.replace(/[^0-9.]/g, "")
                )
              }
              placeholder="₱0.00"
              inputMode="decimal"
              className="mt-2 w-full rounded-2xl bg-gray-100 px-4 py-4 outline-none"
            />
          </div>

          <button
            onClick={handleBuyLoad}
            className="mt-8 w-full rounded-2xl bg-emerald-600 py-4 font-bold text-white"
          >
            Buy Load
          </button>
        </div>
      </div>
    </main>
  );
}
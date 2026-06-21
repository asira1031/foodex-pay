"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Receipt = {
  id: string;
  type: string;
  amount: number;
  method: string;
  status: string;
  recipient?: string;
};

export default function ReceiptPage() {
  const router = useRouter();
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("manny_pay_wallet_latest_receipt");
    setReceipt(stored ? JSON.parse(stored) : null);
  }, []);

  const type = receipt?.type || "Transaction";
  const method = receipt?.method || "Manny Pay Wallet";
  const recipient = receipt?.recipient || "-";
  const amount = receipt?.amount || 0;
  const reference = receipt?.id || "-";

  return (
    <main className="min-h-screen bg-[#f5f5f5] px-5 py-8 text-black">
      <div className="mx-auto max-w-sm">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 text-5xl">
              ✓
            </div>

            <h1 className="mt-5 text-3xl font-bold">Payment Successful</h1>
            <p className="mt-2 text-gray-500">
              Your transaction has been completed.
            </p>
          </div>

          <div className="mt-8 space-y-4 rounded-3xl bg-gray-100 p-5">
            <div className="flex justify-between">
              <span className="text-gray-500">Type</span>
              <span className="font-semibold">{type}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Method</span>
              <span className="font-semibold">{method}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Recipient</span>
              <span className="font-semibold">{recipient}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Amount</span>
              <span className="font-bold text-emerald-600">
                ₱{Number(amount).toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Reference</span>
              <span className="font-semibold">{reference}</span>
            </div>
          </div>

          <button
            onClick={() => router.push("/manny-pay/dashboard")}
            className="mt-8 w-full rounded-2xl bg-emerald-600 py-4 font-bold text-white"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </main>
  );
}
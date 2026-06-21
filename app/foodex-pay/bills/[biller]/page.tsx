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
  note?: string;
};

export default function BillerPaymentPage() {
  const router = useRouter();
  const params = useParams();

  const biller = String(params.biller || "")
    .replaceAll("-", " ")
    .toUpperCase();

  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");

  function handlePayBill() {
    if (!accountName || !accountNumber || !amount) {
      alert("Please complete all fields.");
      return;
    }

    const paymentAmount = Number(amount);
    const currentBalance = Number(
      localStorage.getItem("foodex_pay_balance") || "0"
    );

    if (paymentAmount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    if (paymentAmount > currentBalance) {
      alert("Insufficient wallet balance.");
      return;
    }

    const reference = `AW-BILLS-${Date.now()}`;
    const updatedBalance = currentBalance - paymentAmount;

    localStorage.setItem("foodex_pay_balance", updatedBalance.toString());

    const transaction: WalletTransaction = {
      id: reference,
      type: "Bills Payment",
      amount: paymentAmount,
      method: biller,
      status: "Completed",
      recipient: accountName,
      note: accountNumber,
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

    localStorage.setItem("foodex_pay_receipt_type", "Bills Payment");
    localStorage.setItem("foodex_pay_receipt_method", biller);
    localStorage.setItem("foodex_pay_receipt_recipient", accountName);
    localStorage.setItem("foodex_pay_receipt_amount", paymentAmount.toString());
    localStorage.setItem("foodex_pay_receipt_reference", reference);

    router.push("/foodex-pay/receipt");
  }

  return (
    <main className="min-h-screen bg-[#f5f5f5] px-5 py-6 text-black">
      <div className="mx-auto max-w-sm">
        <button onClick={() => router.back()} className="mb-6 text-3xl">
          ←
        </button>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold">{biller}</h1>

          <p className="mt-3 text-gray-500">
            Pay your {biller} bill using foodex Pay.
          </p>

          <div className="mt-8">
            <label className="text-sm text-gray-500">Account Name</label>
            <input
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="Juan Dela Cruz"
              className="mt-2 w-full rounded-2xl bg-gray-100 px-4 py-4 outline-none"
            />
          </div>

          <div className="mt-5">
            <label className="text-sm text-gray-500">
              Account / Reference Number
            </label>
            <input
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="Enter account number"
              className="mt-2 w-full rounded-2xl bg-gray-100 px-4 py-4 outline-none"
            />
          </div>

          <div className="mt-5">
            <label className="text-sm text-gray-500">Amount</label>
            <input
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value.replace(/[^0-9.]/g, ""))
              }
              placeholder="₱0.00"
              inputMode="decimal"
              className="mt-2 w-full rounded-2xl bg-gray-100 px-4 py-4 outline-none"
            />
          </div>

          <button
            onClick={handlePayBill}
            className="mt-8 w-full rounded-2xl bg-emerald-600 py-4 font-bold text-white"
          >
            Pay Bill
          </button>
        </div>
      </div>
    </main>
  );
}
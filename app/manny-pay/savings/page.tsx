"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SavingsPage() {
  const router = useRouter();

  const [walletBalance, setWalletBalance] = useState(0);
  const [savingsBalance, setSavingsBalance] = useState(0);
  const [amount, setAmount] = useState("");

  useEffect(() => {
    const wallet = Number(
      localStorage.getItem("manny_pay_wallet_balance") || "0"
    );

    const savings = Number(
      localStorage.getItem("manny_pay_savings_balance") || "0"
    );

    setWalletBalance(wallet);
    setSavingsBalance(savings);
  }, []);

  function saveBalances(wallet: number, savings: number) {
    setWalletBalance(wallet);
    setSavingsBalance(savings);

    localStorage.setItem(
      "manny_pay_wallet_balance",
      wallet.toString()
    );

    localStorage.setItem(
      "manny_pay_savings_balance",
      savings.toString()
    );
  }

  function addTransaction(
    type: string,
    amount: number,
    method: string
  ) {
    const transaction = {
      id: `AW-SAV-${Date.now()}`,
      type,
      amount,
      method,
      status: "Completed",
      recipient: "Savings Account",
      createdAt: new Date().toISOString(),
    };

    const existing = localStorage.getItem(
      "manny_pay_wallet_transactions"
    );

    const transactions = existing
      ? JSON.parse(existing)
      : [];

    localStorage.setItem(
      "manny_pay_wallet_transactions",
      JSON.stringify([transaction, ...transactions])
    );
  }

  function handleDeposit() {
    const depositAmount = Number(amount);

    if (!amount || depositAmount <= 0) {
      alert("Enter valid amount.");
      return;
    }

    if (depositAmount > walletBalance) {
      alert("Insufficient wallet balance.");
      return;
    }

    const updatedWallet = walletBalance - depositAmount;
    const updatedSavings = savingsBalance + depositAmount;

    saveBalances(updatedWallet, updatedSavings);

    addTransaction(
      "Savings Deposit",
      depositAmount,
      "Savings"
    );

    alert(`₱${depositAmount} deposited to savings.`);
    setAmount("");
  }

  function handleWithdraw() {
    const withdrawAmount = Number(amount);

    if (!amount || withdrawAmount <= 0) {
      alert("Enter valid amount.");
      return;
    }

    if (withdrawAmount > savingsBalance) {
      alert("Insufficient savings balance.");
      return;
    }

    const updatedWallet = walletBalance + withdrawAmount;
    const updatedSavings = savingsBalance - withdrawAmount;

    saveBalances(updatedWallet, updatedSavings);

    addTransaction(
      "Savings Withdraw",
      withdrawAmount,
      "Savings"
    );

    alert(`₱${withdrawAmount} withdrawn from savings.`);
    setAmount("");
  }

  const estimatedInterest = savingsBalance * 0.03;

  return (
    <main className="min-h-screen bg-[#f7f7f7] px-6 py-8 text-black">
      <div className="mx-auto max-w-sm">
        <button
          onClick={() => router.back()}
          className="mb-8 text-3xl"
        >
          ←
        </button>

        <div className="rounded-3xl bg-emerald-600 p-6 text-white shadow-sm">
          <p className="text-sm text-white/70">
            Manny Savings
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            ₱{savingsBalance.toLocaleString()}
          </h1>

          <p className="mt-2 text-white/70">
            Current Savings Balance
          </p>
        </div>

        <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Wallet Balance
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                ₱{walletBalance.toLocaleString()}
              </h2>
            </div>

            <div className="text-5xl">
              💰
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm">
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

          <button
            onClick={handleDeposit}
            className="mt-6 w-full rounded-2xl bg-emerald-600 py-4 font-bold text-white"
          >
            Deposit to Savings
          </button>

          <button
            onClick={handleWithdraw}
            className="mt-4 w-full rounded-2xl bg-black py-4 font-bold text-white"
          >
            Withdraw from Savings
          </button>
        </div>

        <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Estimated Annual Interest
          </p>

          <h2 className="mt-2 text-3xl font-bold text-emerald-600">
            ₱
            {estimatedInterest.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Based on 3% demo savings interest.
          </p>
        </div>
      </div>
    </main>
  );
}
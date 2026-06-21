"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const loanPlans = [
  {
    title: "Quick Loan",
    amount: 5000,
    months: 3,
  },
  {
    title: "Personal Loan",
    amount: 10000,
    months: 6,
  },
  {
    title: "Business Loan",
    amount: 25000,
    months: 12,
  },
];

export default function LoansPage() {
  const router = useRouter();

  const [activeLoan, setActiveLoan] = useState(0);

  useEffect(() => {
    const stored = Number(
      localStorage.getItem("foodex_pay_active_loan") || "0"
    );

    setActiveLoan(stored);
  }, []);

  function saveLoan(value: number) {
    setActiveLoan(value);

    localStorage.setItem(
      "foodex_pay_active_loan",
      value.toString()
    );
  }

  function addTransaction(
    type: string,
    amount: number,
    method: string
  ) {
    const transaction = {
      id: `AW-LOAN-${Date.now()}`,
      type,
      amount,
      method,
      status: "Completed",
      recipient: "Foodex Loans",
      createdAt: new Date().toISOString(),
    };

    const existing = localStorage.getItem(
      "foodex_pay_transactions"
    );

    const transactions = existing
      ? JSON.parse(existing)
      : [];

    localStorage.setItem(
      "foodex_pay_transactions",
      JSON.stringify([transaction, ...transactions])
    );
  }

  function applyLoan(amount: number) {
    if (activeLoan > 0) {
      alert("Existing active loan detected.");
      return;
    }

    const walletBalance = Number(
      localStorage.getItem("foodex_pay_balance") || "0"
    );

    const updatedWallet = walletBalance + amount;

    localStorage.setItem(
      "foodex_pay_balance",
      updatedWallet.toString()
    );

    saveLoan(amount);

    addTransaction(
      "Loan Release",
      amount,
      "Foodex Loans"
    );

    alert(`Loan approved: ₱${amount.toLocaleString()}`);
  }

  function repayLoan() {
    if (activeLoan <= 0) {
      alert("No active loan.");
      return;
    }

    const walletBalance = Number(
      localStorage.getItem("foodex_pay_balance") || "0"
    );

    if (walletBalance < activeLoan) {
      alert("Insufficient wallet balance.");
      return;
    }

    const updatedWallet = walletBalance - activeLoan;

    localStorage.setItem(
      "foodex_pay_balance",
      updatedWallet.toString()
    );

    addTransaction(
      "Loan Repayment",
      activeLoan,
      "Foodex Loans"
    );

    saveLoan(0);

    alert("Loan fully repaid.");
  }

  return (
    <main className="min-h-screen bg-[#f7f7f7] px-6 py-8 text-black">
      <div className="mx-auto max-w-sm">
        <button
          onClick={() => router.back()}
          className="mb-8 text-3xl"
        >
          ←
        </button>

        <div className="rounded-3xl bg-purple-600 p-6 text-white shadow-sm">
          <p className="text-sm text-white/70">
            Foodex Loans
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            ₱{activeLoan.toLocaleString()}
          </h1>

          <p className="mt-2 text-white/70">
            Active Loan Balance
          </p>
        </div>

        <div className="mt-6 space-y-4">
          {loanPlans.map((loan) => (
            <div
              key={loan.title}
              className="rounded-3xl bg-white p-6 shadow-sm"
            >
              <h2 className="text-2xl font-bold">
                {loan.title}
              </h2>

              <p className="mt-2 text-gray-500">
                ₱{loan.amount.toLocaleString()} • {loan.months} months
              </p>

              <button
                onClick={() => applyLoan(loan.amount)}
                className="mt-6 w-full rounded-2xl bg-purple-600 py-4 font-bold text-white"
              >
                Apply Loan
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={repayLoan}
          className="mt-6 w-full rounded-2xl bg-black py-4 font-bold text-white"
        >
          Repay Loan
        </button>

        <div className="mt-6 rounded-3xl bg-yellow-50 p-5 text-sm text-yellow-800">
          Demo loan system only. Real approval and underwriting will activate
          during banking integration.
        </div>
      </div>
    </main>
  );
}
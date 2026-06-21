"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ReferEarnPage() {
  const router = useRouter();

  const [referrals, setReferrals] = useState(0);
  const [earnings, setEarnings] = useState(0);

  const referralCode = "MANNY-2026";

  useEffect(() => {
    const storedReferrals = Number(
      localStorage.getItem("manny_pay_referrals") || "0"
    );

    const storedEarnings = Number(
      localStorage.getItem("manny_pay_referral_earnings") || "0"
    );

    setReferrals(storedReferrals);
    setEarnings(storedEarnings);
  }, []);

  function simulateReferral() {
    const updatedReferrals = referrals + 1;
    const updatedEarnings = earnings + 50;

    setReferrals(updatedReferrals);
    setEarnings(updatedEarnings);

    localStorage.setItem(
      "manny_pay_referrals",
      updatedReferrals.toString()
    );

    localStorage.setItem(
      "manny_pay_referral_earnings",
      updatedEarnings.toString()
    );

    const currentBalance = Number(
      localStorage.getItem("manny_pay_wallet_balance") || "0"
    );

    const updatedBalance = currentBalance + 50;

    localStorage.setItem(
      "manny_pay_wallet_balance",
      updatedBalance.toString()
    );

    const transaction = {
      id: `AW-REF-${Date.now()}`,
      type: "Referral Reward",
      amount: 50,
      method: "Refer & Earn",
      status: "Completed",
      recipient: "Referral Bonus",
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

    alert("Referral reward added: ₱50");
  }

  function copyCode() {
    navigator.clipboard.writeText(referralCode);

    alert("Referral code copied.");
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

        <div className="rounded-3xl bg-black p-6 text-white shadow-sm">
          <p className="text-sm text-white/50">
            Referral Earnings
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            ₱{earnings.toLocaleString()}
          </h1>

          <p className="mt-2 text-white/50">
            Total rewards earned
          </p>
        </div>

        <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold">
            Invite Friends
          </h2>

          <p className="mt-3 text-gray-500">
            Earn ₱50 for every successful referral.
          </p>

          <div className="mt-6 rounded-3xl bg-gray-100 p-5">
            <p className="text-sm text-gray-500">
              Your Referral Code
            </p>

            <h3 className="mt-2 text-3xl font-bold">
              {referralCode}
            </h3>
          </div>

          <button
            onClick={copyCode}
            className="mt-5 w-full rounded-2xl bg-[#1E3A8A]-600 py-4 font-bold text-white"
          >
            Copy Referral Code
          </button>
        </div>

        <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Successful Referrals
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                {referrals}
              </h2>
            </div>

            <div className="text-5xl">
              🎉
            </div>
          </div>

          <button
            onClick={simulateReferral}
            className="mt-6 w-full rounded-2xl bg-gradient-to-r from-[#0B1F6D] to-[#1E3A8A] py-4 font-bold text-white shadow-lg"
          >
            Simulate Referral Reward
          </button>
        </div>

        <div className="mt-6 rounded-3xl bg-yellow-50 p-5 text-sm text-yellow-800">
          Rewards are automatically credited to your Manny Pay Wallet balance after successful referrals.
        </div>
      </div>
    </main>
  );
}
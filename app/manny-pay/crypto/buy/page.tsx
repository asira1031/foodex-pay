"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const coins = ["USDT", "USDC", "BTC", "ETH", "BNB", "XRP"];

const rates: Record<string, number> = {
  USDT: 58,
  USDC: 58,
  BTC: 6000000,
  ETH: 220000,
  BNB: 35000,
  XRP: 35,
};

export default function BuyCryptoPage() {
  const router = useRouter();

  const [coin, setCoin] = useState("USDT");
  const [phpAmount, setPhpAmount] = useState("");

  const amount = Number(phpAmount || 0);
  const cryptoAmount = amount > 0 ? amount / rates[coin] : 0;

  function handleBuy() {
    const currentBalance = Number(
      localStorage.getItem("manny_pay_balance") || "0"
    );

    if (!phpAmount || amount <= 0) {
      alert("Please enter valid amount.");
      return;
    }

    if (amount > currentBalance) {
      alert("Insufficient wallet balance.");
      return;
    }

    const reference = `AW-CRYPTO-BUY-${Date.now()}`;
    const updatedBalance = currentBalance - amount;

    localStorage.setItem("manny_pay_balance", updatedBalance.toString());

    const existingCrypto = localStorage.getItem("manny_pay_crypto_balances");
    const cryptoBalances = existingCrypto ? JSON.parse(existingCrypto) : {};

    const currentCoinBalance = Number(cryptoBalances[coin] || 0);
    const updatedCoinBalance = currentCoinBalance + cryptoAmount;

    cryptoBalances[coin] = updatedCoinBalance;

    localStorage.setItem(
      "manny_pay_crypto_balances",
      JSON.stringify(cryptoBalances)
    );

    const transaction = {
      id: reference,
      type: "Buy Crypto",
      amount,
      method: coin,
      status: "Completed",
      recipient: `${cryptoAmount.toFixed(6)} ${coin}`,
      createdAt: new Date().toISOString(),
    };

    const existing = localStorage.getItem("manny_pay_transactions");
    const transactions = existing ? JSON.parse(existing) : [];

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
    <main className="min-h-screen bg-[#f7f7f7] px-6 py-8 text-black">
      <div className="mx-auto max-w-sm">
        <button onClick={() => router.back()} className="mb-8 text-3xl">
          ←
        </button>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold">Buy Crypto</h1>

          <p className="mt-3 text-gray-500">
            Convert your PHP wallet balance to crypto.
          </p>

          <div className="mt-8">
            <label className="text-sm text-gray-500">Select Coin</label>

            <select
              value={coin}
              onChange={(e) => setCoin(e.target.value)}
              className="mt-2 w-full rounded-2xl bg-gray-100 px-4 py-4 outline-none"
            >
              {coins.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-5">
            <label className="text-sm text-gray-500">PHP Amount</label>

            <input
              value={phpAmount}
              onChange={(e) =>
                setPhpAmount(e.target.value.replace(/[^0-9.]/g, ""))
              }
              placeholder="₱0.00"
              inputMode="decimal"
              className="mt-2 w-full rounded-2xl bg-gray-100 px-4 py-4 outline-none"
            />
          </div>

          <div className="mt-6 rounded-3xl bg-gray-100 p-5">
            <p className="text-sm text-gray-500">You will receive</p>

            <h2 className="mt-2 text-2xl font-bold">
              {cryptoAmount.toFixed(6)} {coin}
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Demo rate: ₱{rates[coin].toLocaleString()} = 1 {coin}
            </p>
          </div>

          <button
            onClick={handleBuy}
            className="mt-8 w-full rounded-2xl bg-emerald-600 py-4 font-bold text-white"
          >
            Buy {coin}
          </button>
        </div>
      </div>
    </main>
  );
}
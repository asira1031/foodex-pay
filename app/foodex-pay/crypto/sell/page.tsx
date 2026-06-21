"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const rates: Record<string, number> = {
  USDT: 58,
  USDC: 58,
  BTC: 6000000,
  ETH: 220000,
  BNB: 35000,
  XRP: 35,
};

export default function SellCryptoPage() {
  const router = useRouter();

  const [coin, setCoin] = useState("USDT");
  const [cryptoAmount, setCryptoAmount] = useState("");
  const [balances, setBalances] = useState<Record<string, number>>({});

  useEffect(() => {
    const stored = localStorage.getItem("foodex_pay_crypto_balances");

    if (stored) {
      setBalances(JSON.parse(stored));
    }
  }, []);

  const amount = Number(cryptoAmount || 0);
  const phpValue = amount * rates[coin];

  function handleSell() {
    const currentCoinBalance = Number(balances[coin] || 0);

    if (!cryptoAmount || amount <= 0) {
      alert("Please enter valid amount.");
      return;
    }

    if (amount > currentCoinBalance) {
      alert("Insufficient crypto balance.");
      return;
    }

    const updatedBalances = {
      ...balances,
      [coin]: currentCoinBalance - amount,
    };

    localStorage.setItem(
      "foodex_pay_crypto_balances",
      JSON.stringify(updatedBalances)
    );

    const currentWalletBalance = Number(
      localStorage.getItem("foodex_pay_balance") || "0"
    );

    const updatedWalletBalance = currentWalletBalance + phpValue;

    localStorage.setItem(
      "foodex_pay_balance",
      updatedWalletBalance.toString()
    );

    const transaction = {
      id: `AW-CRYPTO-SELL-${Date.now()}`,
      type: "Sell Crypto",
      amount: phpValue,
      method: coin,
      status: "Completed",
      recipient: `${amount.toFixed(6)} ${coin}`,
      createdAt: new Date().toISOString(),
    };

    const existing = localStorage.getItem("foodex_pay_transactions");

    const transactions = existing ? JSON.parse(existing) : [];

    localStorage.setItem(
      "foodex_pay_transactions",
      JSON.stringify([transaction, ...transactions])
    );

    localStorage.setItem(
      "foodex_pay_latest_receipt",
      JSON.stringify(transaction)
    );

    router.push("/foodex-pay/receipt");
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

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold">
            Sell Crypto
          </h1>

          <p className="mt-3 text-gray-500">
            Convert crypto assets back to PHP wallet balance.
          </p>

          <div className="mt-8">
            <label className="text-sm text-gray-500">
              Select Coin
            </label>

            <select
              value={coin}
              onChange={(e) => setCoin(e.target.value)}
              className="mt-2 w-full rounded-2xl bg-gray-100 px-4 py-4 outline-none"
            >
              {Object.keys(rates).map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <p className="mt-2 text-sm text-emerald-600">
              Available:{" "}
              {Number(balances[coin] || 0).toFixed(6)} {coin}
            </p>
          </div>

          <div className="mt-5">
            <label className="text-sm text-gray-500">
              Crypto Amount
            </label>

            <input
              value={cryptoAmount}
              onChange={(e) =>
                setCryptoAmount(
                  e.target.value.replace(/[^0-9.]/g, "")
                )
              }
              placeholder="0.000000"
              inputMode="decimal"
              className="mt-2 w-full rounded-2xl bg-gray-100 px-4 py-4 outline-none"
            />
          </div>

          <div className="mt-6 rounded-3xl bg-gray-100 p-5">
            <p className="text-sm text-gray-500">
              You will receive
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              ₱{phpValue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Demo rate: ₱{rates[coin].toLocaleString()} = 1 {coin}
            </p>
          </div>

          <button
            onClick={handleSell}
            className="mt-8 w-full rounded-2xl bg-emerald-600 py-4 font-bold text-white"
          >
            Sell {coin}
          </button>
        </div>
      </div>
    </main>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const coins = ["USDT", "USDC", "BTC", "ETH", "BNB", "XRP"];

export default function SendCryptoPage() {
  const router = useRouter();

  const [coin, setCoin] = useState("USDT");
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [balances, setBalances] = useState<Record<string, number>>({});

  useEffect(() => {
    const stored = localStorage.getItem("manny_pay_crypto_balances");
    setBalances(stored ? JSON.parse(stored) : {});
  }, []);

  function handleSend() {
    const sendAmount = Number(amount);
    const currentCoinBalance = Number(balances[coin] || 0);

    if (!address || !amount || sendAmount <= 0) {
      alert("Please enter wallet address and valid amount.");
      return;
    }

    if (sendAmount > currentCoinBalance) {
      alert("Insufficient crypto balance.");
      return;
    }

    const reference = `AW-CRYPTO-SEND-${Date.now()}`;

    const updatedBalances = {
      ...balances,
      [coin]: currentCoinBalance - sendAmount,
    };

    localStorage.setItem(
      "manny_pay_crypto_balances",
      JSON.stringify(updatedBalances)
    );

    const transaction = {
      id: reference,
      type: "Send Crypto",
      amount: sendAmount,
      method: coin,
      status: "Completed",
      recipient: address,
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
          <h1 className="text-3xl font-bold">Send Crypto</h1>

          <p className="mt-3 text-gray-500">
            Send crypto to another wallet address.
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

            <p className="mt-2 text-sm text-emerald-600">
              Available: {Number(balances[coin] || 0).toFixed(6)} {coin}
            </p>
          </div>

          <div className="mt-5">
            <label className="text-sm text-gray-500">Wallet Address</label>

            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="0x..."
              className="mt-2 w-full rounded-2xl bg-gray-100 px-4 py-4 outline-none"
            />
          </div>

          <div className="mt-5">
            <label className="text-sm text-gray-500">Crypto Amount</label>

            <input
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value.replace(/[^0-9.]/g, ""))
              }
              placeholder="0.000000"
              inputMode="decimal"
              className="mt-2 w-full rounded-2xl bg-gray-100 px-4 py-4 outline-none"
            />
          </div>

          <button
            onClick={handleSend}
            className="mt-8 w-full rounded-2xl bg-emerald-600 py-4 font-bold text-white"
          >
            Send {coin}
          </button>
        </div>
      </div>
    </main>
  );
}
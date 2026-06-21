"use client";

import { useState } from "react";

export default function SendMoneyPage() {
  const [receiverWalletId, setReceiverWalletId] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  async function handleSend() {
    setMessage("");

    const res = await fetch("/api/manny-pay/send-money", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ receiverWalletId, amount }),
    });

    const data = await res.json();

    if (!data.ok) {
      setMessage(`❌ ${data.message}`);
      return;
    }

    setMessage(`✅ Sent successfully. Reference: ${data.reference}`);
    setReceiverWalletId("");
    setAmount("");
  }

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold">Send Money</h1>
        <p className="text-white/40 mt-2">Wallet-to-wallet transfer</p>

        <div className="mt-8">
          <p className="text-sm text-white/50 mb-3">Receiver Wallet ID</p>
          <input
            value={receiverWalletId}
            onChange={(e) => setReceiverWalletId(e.target.value)}
            placeholder="AW-CLIENT-0002"
            className="w-full rounded-2xl bg-white/5 border border-white/10 p-4 outline-none"
          />
        </div>

        <div className="mt-6">
          <p className="text-sm text-white/50 mb-3">Amount</p>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            type="number"
            className="w-full rounded-2xl bg-white/5 border border-white/10 p-4 outline-none text-2xl"
          />
        </div>

        {message && (
          <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm">
            {message}
          </div>
        )}

        <button
          onClick={handleSend}
          disabled={!receiverWalletId || !amount || Number(amount) <= 0}
          className="w-full mt-8 rounded-2xl bg-emerald-500 text-black py-4 font-bold disabled:opacity-50"
        >
          Send Money
        </button>
      </div>
    </main>
  );
}
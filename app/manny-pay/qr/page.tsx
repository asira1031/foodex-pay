"use client";

import { useState } from "react";

export default function QRPage() {
  const [walletId, setWalletId] = useState("");

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold">
          Scan QR
        </h1>

        <p className="text-white/40 mt-2">
          Scan or enter receiver QR details
        </p>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="h-64 rounded-3xl border border-dashed border-white/20 flex items-center justify-center text-white/40">
            Camera scanner coming next
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm text-white/50 mb-3">
            QR / Wallet ID
          </p>

          <input
            value={walletId}
            onChange={(e) => setWalletId(e.target.value)}
            placeholder="Paste or enter wallet ID"
            className="w-full rounded-2xl bg-white/5 border border-white/10 p-4 outline-none"
          />
        </div>

        <button
          className="w-full mt-8 rounded-2xl bg-emerald-500 text-black py-4 font-bold"
        >
          Continue Payment
        </button>
      </div>
    </main>
  );
}
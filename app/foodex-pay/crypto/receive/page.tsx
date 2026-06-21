"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";

export default function ReceiveCryptoPage() {
  const router = useRouter();

  const [network, setNetwork] = useState("ERC20");

  const walletAddress = "0Xfoodex000000000000000000000000000000000000";

  function copyAddress() {
    navigator.clipboard.writeText(walletAddress);
    alert("Wallet address copied.");
  }

  return (
    <main className="min-h-screen bg-[#f7f7f7] px-6 py-8 text-black">
      <div className="mx-auto max-w-sm">
        <button onClick={() => router.back()} className="mb-8 text-3xl">
          ←
        </button>

        <div className="rounded-3xl bg-white p-6 text-center shadow-sm">
          <h1 className="text-3xl font-bold">Receive Crypto</h1>

          <p className="mt-3 text-gray-500">
            Use this wallet address to receive crypto.
          </p>

          <div className="mt-8">
            <label className="block text-left text-sm text-gray-500">
              Network
            </label>

            <select
              value={network}
              onChange={(e) => setNetwork(e.target.value)}
              className="mt-2 w-full rounded-2xl bg-gray-100 px-4 py-4 text-left outline-none"
            >
              <option value="ERC20">Ethereum ERC20</option>
              <option value="BEP20">BNB Smart Chain BEP20</option>
              <option value="TRC20">TRON TRC20</option>
              <option value="POLYGON">Polygon</option>
            </select>
          </div>

          <div className="mx-auto mt-8 flex h-64 w-64 items-center justify-center rounded-3xl bg-gray-100 p-5">
            <QRCodeCanvas
              value={`${network}:${walletAddress}`}
              size={210}
              level="H"
              includeMargin
            />
          </div>

          <div className="mt-6 rounded-3xl bg-gray-100 p-4 text-left">
            <p className="text-sm text-gray-500">Wallet Address</p>

            <p className="mt-2 break-all font-semibold">
              {walletAddress}
            </p>
          </div>

          <button
            onClick={copyAddress}
            className="mt-5 w-full rounded-2xl bg-emerald-600 py-4 font-bold text-white"
          >
            Copy Address
          </button>

          <div className="mt-6 rounded-3xl bg-yellow-50 p-4 text-left text-sm text-yellow-800">
            Send only supported tokens on the selected network. Wrong network
            deposits may be lost.
          </div>
        </div>
      </div>
    </main>
  );
}
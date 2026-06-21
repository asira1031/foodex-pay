"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function FoodexPayIntroPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#f7f7f7] px-5 py-8 text-black">
      <div className="mx-auto max-w-sm pb-10">
        <div className="mb-8 text-center">
          <Image
            src="/icon-192.png"
            alt="Foodex Pay"
            width={90}
            height={90}
            priority
            className="mx-auto rounded-3xl shadow-xl"
          />

          <h1 className="mt-5 text-4xl font-black">Foodex Pay</h1>

          <p className="mt-3 text-gray-500">
            A secure digital wallet for cash-in, send money, QR payments,
            bills, savings, and merchant services.
          </p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold">What is Foodex Pay?</h2>

          <p className="mt-3 text-gray-500">
            Foodex Pay helps users manage money safely and easily through a
            modern digital wallet experience.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl bg-emerald-50 p-4">
              <p className="text-2xl">💸</p>
              <p className="mt-2 font-bold">Send Money</p>
            </div>

            <div className="rounded-2xl bg-emerald-50 p-4">
              <p className="text-2xl">▦</p>
              <p className="mt-2 font-bold">QR Payments</p>
            </div>

            <div className="rounded-2xl bg-emerald-50 p-4">
              <p className="text-2xl">🏦</p>
              <p className="mt-2 font-bold">Cash In</p>
            </div>

            <div className="rounded-2xl bg-emerald-50 p-4">
              <p className="text-2xl">🧾</p>
              <p className="mt-2 font-bold">Bills</p>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-3xl bg-black p-6 text-white shadow-sm">
          <h2 className="text-2xl font-bold">Wallet Policy</h2>

          <p className="mt-3 text-sm text-white/70">
            By using Foodex Pay, users agree to provide accurate account
            information, protect their login access, and use the wallet only
            for lawful transactions.
          </p>

          <p className="mt-3 text-sm text-white/70">
            Transactions may be reviewed for security, compliance, fraud
            prevention, and user protection.
          </p>
        </div>

        <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold">Privacy & Security</h2>

          <p className="mt-3 text-sm text-gray-500">
            Foodex Pay is designed with account protection, transaction
            monitoring, and secure access in mind. Never share your password,
            OTP, or wallet access with anyone.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3">
          <button
            onClick={() => alert("Install App feature will be added soon.")}
            className="rounded-2xl bg-emerald-600 py-4 font-bold text-white"
          >
            Install App
          </button>

          <button
            onClick={() => router.push("/foodex-pay/signup")}
            className="rounded-2xl bg-black py-4 font-bold text-white"
          >
            Open Wallet
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          © 2026 Foodex Pay. All rights reserved.
        </p>
      </div>
    </main>
  );
}
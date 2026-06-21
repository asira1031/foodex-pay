"use client";

import { useState } from "react";
import Image from "next/image";

export default function FoodexPaySignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [birthday, setBirthday] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  function handleCreateWallet() {
    if (!fullName || !email || !mobile || !birthday || !birthPlace || !pin) {
      alert("Please complete all fields.");
      return;
    }

    if (pin.length !== 6) {
      alert("PIN must be 6 digits.");
      return;
    }

    setLoading(true);

    localStorage.setItem("foodex_pay_logged_in", "yes");
    localStorage.setItem("foodex_pay_wallet_logged_in", "yes");
    localStorage.setItem("foodex_pay_full_name", fullName);
    localStorage.setItem("foodex_pay_wallet_full_name", fullName);
    localStorage.setItem("foodex_pay_email", email);
    localStorage.setItem("foodex_pay_wallet_email", email);
    localStorage.setItem("foodex_pay_phone", mobile);
    localStorage.setItem("foodex_pay_wallet_phone", mobile);
    localStorage.setItem(`foodex_pay_wallet_balance_${mobile}`, "0");

    alert("Wallet account created successfully. OTP is temporarily bypassed.");
    window.location.href = "/foodex-pay/dashboard";
  }

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-white/5 p-8">
        <div className="mb-6 flex flex-col items-center">
          <Image
            src="/icon-192.png"
            alt="Foodex Pay Wallet"
            width={90}
            height={90}
            priority
            className="rounded-3xl bg-white p-2 shadow-lg"
          />

          <h1 className="mt-4 text-3xl font-bold">FOODEX PAY</h1>
          <p className="mt-2 text-white/50">
            Temporary signup mode — OTP bypass enabled
          </p>
        </div>

        <label className="mb-2 block text-sm text-white/60">Full Name</label>
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="mb-5 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
        />

        <label className="mb-2 block text-sm text-white/60">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-5 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
        />

        <label className="mb-2 block text-sm text-white/60">Phone Number</label>
        <input
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          className="mb-5 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
        />

        <label className="mb-2 block text-sm text-white/60">Birthday</label>
        <input
          type="date"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
          className="mb-5 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
        />

        <label className="mb-2 block text-sm text-white/60">Birth Place</label>
        <input
          value={birthPlace}
          onChange={(e) => setBirthPlace(e.target.value)}
          className="mb-5 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
        />

        <label className="mb-2 block text-sm text-white/60">6-Digit PIN</label>
        <input
          type="password"
          inputMode="numeric"
          maxLength={6}
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
          className="mb-6 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
        />

        <button
          type="button"
          disabled={loading}
          onClick={handleCreateWallet}
          className="w-full rounded-xl bg-[#245BFF] py-3 font-semibold text-white transition hover:bg-[#1E3A8A] disabled:opacity-60"
        >
          {loading ? "Processing..." : "Create Wallet Account"}
        </button>

        <button
          type="button"
          onClick={() => {
            window.location.href = "/foodex-pay/login";
          }}
          className="mt-5 w-full text-sm text-[#60A5FA] transition hover:text-[#93C5FD]"
        >
          Already have an account? Login
        </button>
      </div>
    </main>
  );
}
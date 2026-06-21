"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function MannyPayLoginPage() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");

  function handleLogin() {
    if (!phone || !pin) {
      alert("Enter phone number and PIN");
      return;
    }

    if (pin.length !== 6) {
      alert("PIN must be 6 digits");
      return;
    }

    localStorage.setItem("manny_pay_logged_in", "yes");
    localStorage.setItem("manny_pay_phone", phone);

    localStorage.setItem(
      "manny_pay_full_name",
      localStorage.getItem("manny_pay_full_name") || "Manny Pay User"
    );

    router.push("/manny-pay/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 py-10 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl">
        <div className="mb-8 flex flex-col items-center">
          <Image
            src="/icon-192.jpg"
            alt="Manny Pay"
            width={320}
            height={120}
            priority
            className="h-auto w-full max-w-[320px] rounded-2xl object-contain"
          />
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-sm text-white/60">Phone Number</label>

            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+639XXXXXXXXX"
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none placeholder:text-white/40"
            />
          </div>

          <div>
            <label className="text-sm text-white/60">6-Digit PIN</label>

            <input
              type="password"
              inputMode="numeric"
              maxLength={6}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
              placeholder="******"
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none placeholder:text-white/40"
            />
          </div>

          <button
            type="button"
            onClick={handleLogin}
            className="w-full rounded-xl bg-[#245BFF] py-3 font-semibold text-white transition hover:bg-[#1E3A8A]"
          >
            Continue
          </button>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => alert("Face ID will activate in production.")}
              className="rounded-2xl border border-white/10 bg-black/30 py-3 text-white"
            >
              Face ID
            </button>

            <button
              type="button"
              onClick={() => alert("Touch ID will activate in production.")}
              className="rounded-2xl border border-white/10 bg-black/30 py-3 text-white"
            >
              Touch ID
            </button>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white/50">
            Biometric login and OTP verification will activate during production
            integration.
          </div>

          <button
            type="button"
            onClick={() => router.push("/manny-pay/signup")}
            className="mt-5 w-full text-sm text-blue-400 transition hover:text-blue-300"
          >
            Create Wallet Account
          </button>
        </div>
      </div>
    </main>
  );
}
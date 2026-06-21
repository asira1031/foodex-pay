"use client";

import { useState } from "react";
import Image from "next/image";

type Step = "form" | "email" | "phone";

export default function FoodexPaySignupPage() {
  const [step, setStep] = useState<Step>("form");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [birthday, setBirthday] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [pin, setPin] = useState("");

  const [emailOtp, setEmailOtp] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleSendEmailOtp() {
    if (!fullName || !email || !mobile || !birthday || !birthPlace || !pin) {
      alert("Please complete all fields.");
      return;
    }

    if (pin.length !== 6) {
      alert("PIN must be 6 digits.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/foodex-pay/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone: mobile,
          password: pin,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.message || "Failed to send email OTP.");
        return;
      }

      alert("Email OTP sent.");
      setStep("email");
    } catch (error) {
      console.error("SEND EMAIL OTP ERROR:", error);
      alert("Send email OTP error.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyEmailOtp() {
    if (!emailOtp) {
      alert("Please enter email OTP.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/foodex-pay/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: emailOtp }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.message || "Email OTP verification failed.");
        return;
      }

    localStorage.setItem("foodex_pay_wallet_logged_in", "yes");
localStorage.setItem("foodex_pay_wallet_full_name", fullName);
localStorage.setItem("foodex_pay_wallet_email", email);
localStorage.setItem("foodex_pay_wallet_phone", mobile);
localStorage.setItem(`foodex_pay_wallet_balance_${mobile}`, "0");

alert("Email verified. Wallet account created successfully.");
window.location.href = "/foodex-pay/dashboard";
    } catch (error) {
      console.error("VERIFY EMAIL OTP ERROR:", error);
      alert("Verify email OTP error.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyPhoneOtp() {
    if (!phoneOtp) {
      alert("Please enter phone OTP.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/foodex-pay/verify-phone-otp", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email,
    phone: mobile,
    otp: phoneOtp,
  }),
});
      const data = await res.json();

      if (!res.ok) {
        alert(data?.message || "Phone OTP verification failed.");
        return;
      }

      localStorage.setItem("foodex_pay_wallet_logged_in", "yes");
      localStorage.setItem("foodex_pay_wallet_full_name", fullName);
      localStorage.setItem("foodex_pay_wallet_email", email);
      localStorage.setItem("foodex_pay_wallet_phone", mobile);
      localStorage.setItem(`foodex_pay_wallet_balance_${mobile}`, "0");

      alert("Email and phone verified. Wallet account created successfully.");
      window.location.href = "/foodex-pay/dashboard";
    } catch (error) {
      console.error("VERIFY PHONE OTP ERROR:", error);
      alert("Verify phone OTP error.");
    } finally {
      setLoading(false);
    }
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
            Email + phone verification signup
          </p>
        </div>

        <label className="mb-2 block text-sm text-white/60">Full Name</label>
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          disabled={step !== "form"}
          className="mb-5 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none disabled:opacity-60"
        />

        <label className="mb-2 block text-sm text-white/60">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={step !== "form"}
          className="mb-5 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none disabled:opacity-60"
        />

        <label className="mb-2 block text-sm text-white/60">Phone Number</label>
        <input
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          disabled={step !== "form"}
          className="mb-5 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none disabled:opacity-60"
        />

        <label className="mb-2 block text-sm text-white/60">Birthday</label>
        <input
          type="date"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
          disabled={step !== "form"}
          className="mb-5 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none disabled:opacity-60"
        />

        <label className="mb-2 block text-sm text-white/60">Birth Place</label>
        <input
          value={birthPlace}
          onChange={(e) => setBirthPlace(e.target.value)}
          disabled={step !== "form"}
          className="mb-5 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none disabled:opacity-60"
        />

        <label className="mb-2 block text-sm text-white/60">6-Digit PIN</label>
        <input
          type="password"
          inputMode="numeric"
          maxLength={6}
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
          disabled={step !== "form"}
          className="mb-6 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none disabled:opacity-60"
        />

        {step === "email" && (
          <>
            <label className="mb-2 block text-sm text-white/60">
              Email OTP Code
            </label>
            <input
              inputMode="numeric"
              maxLength={6}
              value={emailOtp}
              onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, ""))}
              className="mb-6 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
            />
          </>
        )}

        {step === "phone" && (
          <>
            <label className="mb-2 block text-sm text-white/60">
              Phone OTP Code
            </label>
            <input
              inputMode="numeric"
              maxLength={6}
              value={phoneOtp}
              onChange={(e) => setPhoneOtp(e.target.value.replace(/\D/g, ""))}
              className="mb-6 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
            />
          </>
        )}

        <button
          type="button"
          disabled={loading}
          onClick={() => {
            if (step === "form") handleSendEmailOtp();
            if (step === "email") handleVerifyEmailOtp();
            if (step === "phone") handleVerifyPhoneOtp();
          }}
          className="w-full rounded-xl bg-[#245BFF] py-3 font-semibold text-white transition hover:bg-[#1E3A8A] disabled:opacity-60"
        >
          {loading
            ? "Processing..."
            : step === "form"
            ? "Send Email OTP"
            : step === "email"
            ? "Verify Email OTP"
            : "Verify Phone OTP"}
        </button>

        <button
          type="button"
          onClick={() => {
            window.location.href = "/FOODEX-pay/login";
          }}
          className="mt-5 w-full text-sm text-[#60A5FA] transition hover:text-[#93C5FD]"
        >
          Already have an account? Login
        </button>
      </div>
    </main>
  );
}
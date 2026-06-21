"use client";

import Link from "next/link";

export default function WalletSettingsPage() {
  const items = [
    {
      title: "Profile",
      href: "/foodex-payt/settings/profile",
    },
    {
      title: "KYC Verification",
      href: "/foodex-pay/settings/kyc",
    },
    {
      title: "Biometric Login Ready",
      href: "/foodex-pay/settings/biometric",
    },
    {
      title: "Security PIN / OTP",
      href: "/foodex-pay/settings/security",
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold">
          Settings
        </h1>

        <p className="text-white/40 mt-2">
          FOODEX Pay account settings
        </p>

        <div className="mt-8 space-y-4">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-2xl bg-white/5 border border-white/10 p-5 hover:bg-white/10 transition"
            >
              {item.title}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
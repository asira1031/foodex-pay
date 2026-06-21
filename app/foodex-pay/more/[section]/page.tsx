"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function MoreSectionPage() {
  const router = useRouter();
  const params = useParams();

  const [fullName, setFullName] = useState("Foodex User");
  const [phone, setPhone] = useState("09XXXXXXXXX");

  const rawSection = String(params.section || "");
  const section = rawSection.replaceAll("-", " ");

  useEffect(() => {
    setFullName(localStorage.getItem("foodex_pay_full_name") || "Foodex User");
    setPhone(localStorage.getItem("foodex_pay_phone") || "09XXXXXXXXX");
  }, []);

  const walletId = "AW-CLIENT-0001";

  function titleCase(text: string) {
    return text
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  function renderContent() {
    if (rawSection === "profile") {
      return (
        <div className="space-y-4">
          <Info label="Full Name" value={fullName} />
          <Info label="Phone Number" value={phone} />
          <Info label="Wallet ID" value={walletId} />
          <Info label="Account Status" value="Verified Demo Account" />
        </div>
      );
    }

    if (rawSection === "security") {
      return (
        <div className="space-y-4">
          <Info label="6-Digit PIN" value="Enabled" />
          <Info label="Biometric Login" value="Ready for Production" />
          <Info label="Device Lock" value="Active" />
          <Info label="Security Level" value="Standard" />
        </div>
      );
    }

    if (rawSection === "notifications") {
      return (
        <div className="space-y-4">
          <ToggleInfo label="Cash In Alerts" value="Active" />
          <ToggleInfo label="Transfer Alerts" value="Active" />
          <ToggleInfo label="Promo Alerts" value="Active" />
          <ToggleInfo label="Email Notifications" value="Active" />
        </div>
      );
    }

    if (rawSection === "transaction-limits") {
      return (
        <div className="space-y-4">
          <Info label="Daily Transfer Limit" value="₱50,000" />
          <Info label="Monthly Limit" value="₱500,000" />
          <Info label="Cash In Limit" value="₱100,000 / day" />
          <Info label="Crypto Demo Limit" value="₱20,000 / day" />
        </div>
      );
    }

    if (rawSection === "help-center") {
      return (
        <div className="space-y-4">
          <Info label="Support Email" value="support@foodex-pay.com" />
          <Info label="Help Topic" value="Cash In, Send Money, Bills, Crypto" />
          <Info label="Response Time" value="24-48 hours" />
          <Info label="Emergency Support" value="Active Soon" />
        </div>
      );
    }

    if (rawSection === "about-foodex-pay") {
      return (
        <div className="space-y-4">
          <Info label="App Name" value="Foodex Pay" />
          <Info label="Version" value="1.0.0 " />
          <Info label="Environment" value="Vercel / Mobile PWA" />
          <Info label="Status" value="Prototype Active" />
        </div>
      );
    }

    return (
      <div className="rounded-3xl bg-gray-100 p-5">
        <p className="text-gray-500">This section is ready.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f7f7] px-6 py-8 text-black">
      <div className="mx-auto max-w-sm">
        <button onClick={() => router.back()} className="mb-8 text-3xl">
          ←
        </button>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold">{titleCase(section)}</h1>

          <p className="mt-3 text-gray-500">
            Manage your {titleCase(section)} settings.
          </p>

          <div className="mt-8">{renderContent()}</div>

          <button
            onClick={() => router.push("/foodex-pay/dashboard")}
            className="mt-8 w-full rounded-2xl bg-gradient-to-r from-[#0B1F6D] to-[#1E3A8A] py-4 font-bold text-white shadow-lg transition hover:from-[#1E3A8A] hover:to-[#2563EB]"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-gray-100 p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-2 font-bold">{value}</p>
    </div>
  );
}

function ToggleInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-3xl bg-gray-100 p-5">
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="mt-2 font-bold text-[#1E3A8A]">{value}</p>
      </div>

      <div className="flex h-7 w-14 items-center rounded-full bg-[#1E3A8A] p-1">
        <div className="ml-auto h-5 w-5 rounded-full bg-white" />
      </div>
    </div>
  );
}
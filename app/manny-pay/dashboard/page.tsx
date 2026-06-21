"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";
import Image from "next/image";
type Tab = "wallet" | "savings" | "credit" | "loans" | "cards";
type KycStatus = "NOT_SUBMITTED" | "PENDING" | "APPROVED" | "REJECTED";

type WalletTransaction = {
  id: string;
  type: string;
  amount: number;
  method: string;
  status: string;
  createdAt: string;
};

export default function MannyPayDashboard() {
  const router = useRouter();

  const [tab, setTab] = useState<Tab>("wallet");
  const [showQr, setShowQr] = useState(false);
  const [fullName, setFullName] = useState("Manny User");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [balance, setBalance] = useState(0);
  const [kycStatus, setKycStatus] = useState<KycStatus>("NOT_SUBMITTED");
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);

  const savingsAccount = "MANNY-SAV-0000000001";

  useEffect(() => {
    const loggedIn =
      localStorage.getItem("manny_pay_logged_in") ||
      localStorage.getItem("manny_pay_wallet_logged_in");

    if (loggedIn !== "yes") {
      router.push("/manny-pay/login");
      return;
    }

    const userName =
      localStorage.getItem("manny_pay_full_name") ||
      localStorage.getItem("manny_pay_wallet_full_name") ||
      "Manny User";

    const userPhone =
      localStorage.getItem("manny_pay_phone") ||
      localStorage.getItem("manny_pay_wallet_phone") ||
      "";

    const userEmail =
      localStorage.getItem("manny_pay_email") ||
      localStorage.getItem("manny_pay_wallet_email") ||
      "";

    setFullName(userName);
    setPhone(userPhone);
    setEmail(userEmail);

    const savedBalance =
      localStorage.getItem(`manny_pay_balance_${userPhone}`) ||
      localStorage.getItem(`manny_pay_wallet_balance_${userPhone}`) ||
      "0";

    setBalance(Number(savedBalance));

    const stored = localStorage.getItem("manny_pay_transactions");
    setTransactions(stored ? JSON.parse(stored) : []);

    loadKycStatus(userEmail);
  }, [router]);

  async function loadKycStatus(userEmail: string) {
    try {
      if (!userEmail) {
        setKycStatus("NOT_SUBMITTED");
        return;
      }

      const res = await fetch("/api/manny-pay/admin/kyc", {
        method: "GET",
        cache: "no-store",
      });

      const data = await res.json();

      if (!data.ok) {
        setKycStatus("NOT_SUBMITTED");
        return;
      }

      const records =
        typeof data.records === "string"
          ? JSON.parse(data.records)
          : data.records || [];

      const record = records.find(
        (item: any) =>
          String(item.client_email).toLowerCase().trim() ===
          String(userEmail).toLowerCase().trim()
      );

      if (!record) {
        setKycStatus("NOT_SUBMITTED");
        return;
      }

      setKycStatus(record.status || "PENDING");
    } catch (error) {
      console.error("KYC STATUS ERROR:", error);
      setKycStatus("NOT_SUBMITTED");
    }
  }
function requireKyc(route: string) {
  // TEMPORARY KYC BYPASS

  // if (kycStatus !== "APPROVED") {
  //   alert("KYC verification required before using this feature.");
  //   router.push("/manny-pay/kyc");
  //   return;
  // }

    router.push(route);
  }

  function handleLogout() {
    localStorage.removeItem("manny_pay_logged_in");
    localStorage.removeItem("manny_pay_wallet_logged_in");
    router.push("/manny-pay/login");
  }

  const kycBadge =
    kycStatus === "APPROVED"
      ? "🟢 KYC VERIFIED"
      : kycStatus === "PENDING"
      ? "🟡 KYC UNDER REVIEW"
      : kycStatus === "REJECTED"
      ? "🔴 KYC REJECTED"
      : "⚪ KYC NOT SUBMITTED";

  return (
   
   <main className="min-h-screen bg-[#f7f7f7] px-4 py-6 text-black">
      <div className="mx-auto max-w-sm pb-32">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-lg font-black text-blue-900">
              {fullName.charAt(0).toUpperCase()}
            </div>

            <div>
              <p className="text-sm text-gray-500">Welcome back</p>
              <h2 className="text-lg font-bold">{fullName}</h2>
              {phone && <p className="text-xs text-gray-400">{phone}</p>}
              {email && <p className="text-xs text-gray-400">{email}</p>}
            </div>
          </div>
<div className="mb-6 overflow-hidden rounded-3xl shadow-xl">
  <Image
    src="/manny-pay-home.png"
    alt="Manny Pay Home"
    width={1200}
    height={700}
    priority
    className="h-auto w-full object-cover"
  />
</div>
          <button
            onClick={handleLogout}
            className="rounded-full bg-red-500 px-4 py-2 text-xs font-bold text-white"
          >
            Logout
          </button>
        </div>

        <div className="mb-5 rounded-3xl bg-white p-4 shadow-sm">
          <p className="font-bold">{kycBadge}</p>

          {kycStatus !== "APPROVED" && (
            <button
              onClick={() => router.push("/manny-pay/kyc")}
              className="mt-3 w-full rounded-2xl bg-black py-3 font-bold text-white"
            >
              Complete KYC
            </button>
          )}
        </div>

        <div className="mb-6 flex gap-3 overflow-x-auto">
          {["wallet", "savings", "credit", "loans", "cards"].map((item) => (
            <button
              key={item}
              onClick={() => setTab(item as Tab)}
              className={`whitespace-nowrap rounded-full px-5 py-2 text-sm capitalize ${
                tab === item ? "bg-black text-white" : "text-gray-500"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {tab === "wallet" && (
          <>
            <div className="rounded-3xl bg-white p-5 shadow-sm">
              <h1 className="text-5xl font-bold">
                ₱
                {balance.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </h1>

              <p className="mt-1 text-gray-500">Wallet balance</p>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  onClick={() => requireKyc("/manny-pay/cash-in")}
                  className="rounded-2xl bg-blue-100 py-4 font-bold text-blue-900"
                >
                  ↙ Cash in
                </button>

                <button
                  onClick={() => requireKyc("/manny-pay/send-money")}
                  className="rounded-2xl bg-blue-100 py-4 font-bold text-blue-900"
                >
                  ↗ Send
                </button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-4 gap-4 text-center text-sm">
              {[
                {
                  label: "Bank transfer",
                  icon: "🏦",
                  route: "/manny-pay/bank-transfer",
                  locked: true,
                },
                {
                  label: "Raffle Promo",
                  icon: "🎟️",
                  route: "/manny-pay/raffle-promo",
                  locked: false,
                },
                {
                  label: "Crypto",
                  icon: "◆",
                  route: "/manny-pay/crypto",
                  locked: true,
                },
                {
                  label: "Refer & Earn",
                  icon: "🧍‍♀️💸",
                  route: "/manny-pay/refer-earn",
                  locked: false,
                },
                {
                  label: "Load",
                  icon: "📱",
                  route: "/manny-pay/load",
                  locked: true,
                },
                {
                  label: "Bills",
                  icon: "🧾",
                  route: "/manny-pay/bills",
                  locked: true,
                },
                {
                  label: "Shop",
                  icon: "🛍️",
                  route: "/manny-pay/shop",
                  locked: false,
                },
                {
                  label: "More",
                  icon: "M",
                  route: "/manny-pay/more",
                  locked: false,
                },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() =>
                    item.locked
                      ? requireKyc(item.route)
                      : router.push(item.route)
                  }
                  className="text-center"
                >
                  <div className="mb-2 flex h-20 items-center justify-center rounded-3xl bg-white text-3xl font-black shadow-sm">
                    {item.icon}
                  </div>

                  <p className="leading-tight text-gray-500">{item.label}</p>
                </button>
              ))}
            </div>

            <div className="mt-8 rounded-3xl bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-3xl font-bold">Transactions</h2>

                <button
                  onClick={() => router.push("/manny-pay/history")}
                  className="font-bold text-blue-700"
                >
                  See all
                </button>
              </div>

              <div className="space-y-3">
                {transactions.length === 0 ? (
                  <div className="rounded-2xl bg-gray-100 p-5 text-center text-gray-500">
                    No transactions yet
                  </div>
                ) : (
                  transactions.slice(0, 3).map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between rounded-2xl bg-gray-100 p-4"
                    >
                      <div>
                        <p className="font-bold">{tx.type}</p>
                        <p className="text-sm text-gray-500">{tx.method}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(tx.createdAt).toLocaleString()}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-bold">
                          ₱{Number(tx.amount).toLocaleString()}
                        </p>
                        <p className="text-xs text-blue-700">{tx.status}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}

        {tab === "savings" && (
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <h1 className="text-5xl font-bold">₱0.00</h1>
            <p className="mt-1 text-gray-500">Total savings</p>
            <p className="mt-5 text-sm text-gray-500">Savings Account Number</p>
            <p className="font-bold">{savingsAccount}</p>
          </div>
        )}

        {tab === "credit" && (
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <h1 className="text-5xl font-bold">₱0.00</h1>
            <p className="mt-1 text-gray-500">Available credit</p>
          </div>
        )}

        {tab === "loans" && (
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <h1 className="text-3xl font-bold">Manny Loans</h1>
            <p className="mt-3 text-gray-500">
              Check your loan eligibility and status.
            </p>
          </div>
        )}

        {tab === "cards" && (
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <h1 className="text-3xl font-bold">Manny Card</h1>
            <p className="mt-3 text-gray-500">
              Your virtual card will appear here.
            </p>
          </div>
        )}

        {showQr && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6">
            <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center">
              <h2 className="mb-4 text-2xl font-bold">QR</h2>

              <div className="mx-auto mb-4 flex h-56 w-56 items-center justify-center rounded-2xl border bg-white p-4">
                <QRCodeCanvas
                  value={`manny-pay:${phone || "MP-CLIENT-0001"}`}
                  size={190}
                  level="H"
                  includeMargin
                />
              </div>

              <p className="text-sm text-gray-500">
                Use this QR to receive money.
              </p>

              <button
                onClick={() => setShowQr(false)}
                className="mt-6 w-full rounded-2xl bg-black py-3 font-bold text-white"
              >
                Close
              </button>
            </div>
          </div>
        )}

        <div className="fixed bottom-6 left-1/2 flex -translate-x-1/2 gap-10 rounded-3xl bg-black px-10 py-5 text-white shadow-2xl">
          <button onClick={() => setShowQr(true)} className="text-center">
            <div className="text-2xl">▦</div>
            <p className="mt-1 text-xs">QR</p>
          </button>

          <button
            onClick={() => router.push("/manny-pay/qr-scan")}
            className="text-center"
          >
            <div className="text-2xl">📷</div>
            <p className="mt-1 text-xs">Scan</p>
          </button>
        </div>
      </div>
    </main>
  );
}
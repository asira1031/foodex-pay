"use client";

import { useRouter } from "next/navigation";

const menuItems = [
  {
    title: "Profile",
    description: "Manage your personal information",
    icon: "👤",
    route: "/manny-pay/more/profile",
  },
  {
    title: "Security",
    description: "PIN, biometrics, and device settings",
    icon: "🔒",
    route: "/manny-pay/more/security",
  },
  {
    title: "Notifications",
    description: "Wallet alerts and updates",
    icon: "🔔",
    route: "/manny-pay/more/notifications",
  },
  {
    title: "Transaction Limits",
    description: "View your account limits",
    icon: "📈",
    route: "/manny-pay/more/transaction-limits",
  },
  {
    title: "Help Center",
    description: "Support and FAQs",
    icon: "❓",
    route: "/manny-pay/more/help-center",
  },
  {
    title: "About Manny Pay",
    description: "Version and app information",
    icon: "ℹ️",
    route: "/manny-pay/more/about-manny-pay",
  },
];

export default function MorePage() {
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem("manny_pay_logged_in");

    alert("Logged out successfully.");

    router.push("/manny-pay/login");
  }

  return (
    <main className="min-h-screen bg-[#f7f7f7] px-6 py-8 text-black">
      <div className="mx-auto max-w-sm">
        <button
          onClick={() => router.back()}
          className="mb-8 text-3xl"
        >
          ←
        </button>

        <div className="rounded-3xl bg-black p-6 text-white shadow-sm">
          <p className="text-sm text-white/50">
            Manny Pay
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            More Services
          </h1>

          <p className="mt-2 text-white/50">
            Manage your wallet settings and account.
          </p>
        </div>

        <div className="mt-6 space-y-4">
          {menuItems.map((item) => (
            <button
              key={item.title}
              onClick={() => router.push(item.route)}
              className="w-full rounded-3xl bg-white p-5 text-left shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl">
                  {item.icon}
                </div>

                <div className="flex-1">
                  <h2 className="font-bold">
                    {item.title}
                  </h2>

                  <p className="text-sm text-gray-500">
                    {item.description}
                  </p>
                </div>

                <span className="text-2xl">
                  ›
                </span>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={handleLogout}
          className="mt-8 w-full rounded-2xl bg-red-500 py-4 font-bold text-white"
        >
          Logout
        </button>
      </div>
    </main>
  );
}
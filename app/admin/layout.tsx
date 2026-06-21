"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const loggedIn =
      localStorage.getItem("foodex_pay_logged_in") ||
      localStorage.getItem("foodex_pay_wallet_logged_in");

    if (loggedIn !== "yes") {
      router.push("/foodex-pay/login");
      return;
    }

    setChecking(false);
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("foodex_pay_logged_in");
    localStorage.removeItem("foodex_pay_wallet_logged_in");
    localStorage.removeItem("foodex_pay_phone");
    localStorage.removeItem("foodex_pay_wallet_phone");
    localStorage.removeItem("foodex_pay_full_name");
    localStorage.removeItem("foodex_pay_wallet_full_name");

    router.push("/foodex-pay/login");
  }

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        Checking admin access...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <div>
          <h1 className="text-xl font-bold">Foodex Pay Admin</h1>
          <p className="text-sm text-white/50">Control Center</p>
        </div>

        <button
          onClick={handleLogout}
          className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white"
        >
          Logout
        </button>
      </header>

      {children}
    </main>
  );
}
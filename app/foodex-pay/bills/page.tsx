"use client";

import { useRouter } from "next/navigation";

const billers = [
  { name: "Meralco", icon: "💡" },
  { name: "Maynilad", icon: "🚰" },
  { name: "PLDT", icon: "🌐" },
  { name: "Globe", icon: "📱" },
  { name: "Smart", icon: "📶" },
  { name: "Converge", icon: "🛰️" },
  { name: "Sky Cable", icon: "📺" },
  { name: "PrimeWater", icon: "💧" },
  { name: "Home Credit", icon: "💳" },
  { name: "SSS", icon: "🏛️" },
  { name: "Pag-IBIG", icon: "🏠" },
];

export default function BillsPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#f5f5f5] px-5 py-6 text-black">
      <div className="mx-auto max-w-sm">
        <button onClick={() => router.back()} className="mb-6 text-3xl">
          ←
        </button>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold">Bills Payment</h1>

          <p className="mt-3 text-gray-500">
            Pay your utility and government bills.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4">
            {billers.map((biller) => (
              <button
                key={biller.name}
                onClick={() =>
                  router.push(
                    `foodex-pay/bills/${biller.name
                      .toLowerCase()
                      .replaceAll(" ", "-")}`
                  )
                }
                className="rounded-3xl bg-gray-100 p-5 text-left"
              >
                <div className="text-4xl">{biller.icon}</div>
                <p className="mt-4 font-semibold">{biller.name}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
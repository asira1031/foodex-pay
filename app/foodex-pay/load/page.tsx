"use client";

import { useRouter } from "next/navigation";

export default function LoadPage() {
  const router = useRouter();

  const networks = [
    {
      name: "GCash",
      color: "bg-blue-500",
      route: "/manny-pay/load/gcash",
    },
    {
      name: "Smart",
      color: "bg-green-500",
      route: "/manny-pay/load/smart",
    },
    {
      name: "TNT",
      color: "bg-yellow-400",
      route: "/manny-pay/load/tnt",
    },
    {
      name: "Globe",
      color: "bg-blue-700",
      route: "/manny-pay/load/globe",
    },
    {
      name: "TM",
      color: "bg-cyan-500",
      route: "/manny-pay/load/tm",
    },
    {
      name: "DITO",
      color: "bg-red-500",
      route: "/manny-pay/load/dito",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f5f5f5] px-5 py-6 text-black">
      <button
        onClick={() => router.back()}
        className="mb-6 text-3xl"
      >
        ←
      </button>

      <div className="rounded-[32px] bg-white p-6 shadow-md">
        <h1 className="text-4xl font-bold">Load</h1>

        <p className="mt-3 text-gray-500">
          Buy prepaid mobile load using Manny Pay.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-4">
          {networks.map((network) => (
            <button
              key={network.name}
              onClick={() => router.push(network.route)}
              className="rounded-3xl border border-gray-100 bg-gray-50 p-5 shadow-sm transition hover:scale-[1.02]"
            >
              <div
                className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${network.color} text-lg font-bold text-white`}
              >
                {network.name.charAt(0)}
              </div>

              <p className="text-lg font-semibold">
                {network.name}
              </p>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
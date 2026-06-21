"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const rates: Record<string, number> = {
  USDT: 58,
  USDC: 58,
  BTC: 6000000,
  ETH: 220000,
  BNB: 35000,
  XRP: 35,
};

export default function CryptoPage() {
  const router = useRouter();

  const [cryptoBalances, setCryptoBalances] = useState<Record<string, number>>(
    {}
  );

  useEffect(() => {
    const stored = localStorage.getItem("foodex_pay_crypto_balances");
    setCryptoBalances(stored ? JSON.parse(stored) : {});
  }, []);

  const services = [
    {
      title: "Buy Crypto",
      desc: "Convert PHP wallet balance to crypto.",
      icon: "💵",
    },
    {
      title: "Sell Crypto",
      desc: "Convert crypto back to PHP wallet.",
      icon: "🔁",
    },
    {
      title: "Send Crypto",
      desc: "Transfer crypto to another wallet.",
      icon: "🚀",
    },
    {
      title: "Receive Crypto",
      desc: "Show your wallet address.",
      icon: "📥",
    },
  ];

  const coins = [
    { symbol: "USDT", name: "Tether USD", icon: "💲", decimals: 2 },
    { symbol: "BTC", name: "Bitcoin", icon: "₿", decimals: 6 },
    { symbol: "ETH", name: "Ethereum", icon: "⟠", decimals: 4 },
    { symbol: "BNB", name: "Binance Coin", icon: "🟡", decimals: 4 },
    { symbol: "XRP", name: "Ripple", icon: "💠", decimals: 4 },
    { symbol: "USDC", name: "USD Coin", icon: "🔵", decimals: 2 },
  ];

  const totalValue = coins.reduce((sum, coin) => {
    const balance = Number(cryptoBalances[coin.symbol] || 0);
    return sum + balance * rates[coin.symbol];
  }, 0);

  return (
    <main className="min-h-screen bg-[#f7f7f7] px-6 py-8 text-black">
      <div className="mx-auto max-w-sm">
        <button onClick={() => router.back()} className="mb-8 text-3xl">
          ←
        </button>

        <div className="rounded-3xl bg-black p-6 text-white shadow-sm">
          <p className="text-sm text-white/50">foodex Pay Crypto Wallet</p>

          <h1 className="mt-3 text-4xl font-bold">
            ₱{totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </h1>

          <p className="mt-2 text-white/50">Total Crypto Portfolio Value</p>
        </div>

        <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold">Crypto Services</h2>

          <div className="mt-5 space-y-4">
            {services.map((item) => (
              <button
                key={item.title}
                onClick={() => {
                  const routes: Record<string, string> = {
                    "Buy Crypto": "/foodex-pay/crypto/buy",
                    "Sell Crypto": "/foodex-pay/crypto/sell",
                    "Send Crypto": "/foodexy-pay/crypto/send",
                    "Receive Crypto": "/foodex-pay/crypto/receive",
                  };

                  router.push(routes[item.title]);
                }}
                className="w-full rounded-3xl bg-gray-100 p-5 text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{item.icon}</div>

                  <div>
                    <h3 className="font-bold">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">My Assets</h2>

            <button className="text-sm font-semibold text-emerald-600">
              View All
            </button>
          </div>

          <div className="mt-5 space-y-4">
            {coins.map((coin) => {
              const balance = Number(cryptoBalances[coin.symbol] || 0);
              const value = balance * rates[coin.symbol];

              return (
                <div
                  key={coin.symbol}
                  className="flex items-center justify-between rounded-3xl bg-gray-100 p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{coin.icon}</div>

                    <div>
                      <h3 className="font-bold">{coin.symbol}</h3>
                      <p className="text-sm text-gray-500">{coin.name}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-bold">{balance.toFixed(coin.decimals)}</p>
                    <p className="text-sm text-gray-500">
                      ₱{value.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold">Wallet Address</h2>

          <p className="mt-3 break-all rounded-2xl bg-gray-100 p-4 text-sm text-gray-600">
            0xfoodex000000000000000000000000000000000000
          </p>

          <button
            onClick={() =>
              navigator.clipboard.writeText(
                "0xfoodex000000000000000000000000000000000000"
              )
            }
            className="mt-4 w-full rounded-2xl bg-emerald-600 py-3 font-bold text-white"
          >
            Copy Address
          </button>
        </div>
      </div>
    </main>
  );
}
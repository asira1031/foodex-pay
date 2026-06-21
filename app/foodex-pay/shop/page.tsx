"use client";

import { useRouter } from "next/navigation";

type Product = {
  name: string;
  price: number;
  merchant: string;
  icon: string;
};

const products: Product[] = [
  { name: "Grocery Voucher", price: 100, merchant: "Manny Market", icon: "🛒" },
  { name: "Food Voucher", price: 150, merchant: "Manny Food Hub", icon: "🍔" },
  { name: "Coffee Voucher", price: 120, merchant: "Manny Cafe", icon: "☕" },
  { name: "Movie Ticket", price: 250, merchant: "Manny Cinema", icon: "🎬" },
  { name: "Travel Coupon", price: 500, merchant: "Manny Travel", icon: "✈️" },
  { name: "Gift Card", price: 300, merchant: "Manny Rewards", icon: "🎁" },
];

export default function ShopPage() {
  const router = useRouter();

  function buyProduct(product: Product) {
    const currentBalance = Number(
      localStorage.getItem("manny_pay_wallet_balance") || "0"
    );

    if (product.price > currentBalance) {
      alert("Insufficient wallet balance.");
      return;
    }

    const reference = `AW-SHOP-${Date.now()}`;
    const updatedBalance = currentBalance - product.price;

    localStorage.setItem("manny_pay_wallet_balance", updatedBalance.toString());

    const transaction = {
      id: reference,
      type: "Shop Purchase",
      amount: product.price,
      method: product.merchant,
      status: "Completed",
      recipient: product.name,
      createdAt: new Date().toISOString(),
    };

    const existing = localStorage.getItem("manny_pay_wallet_transactions");
    const transactions = existing ? JSON.parse(existing) : [];

    localStorage.setItem(
      "manny_pay_wallet_transactions",
      JSON.stringify([transaction, ...transactions])
    );

    localStorage.setItem("manny_pay_wallet_latest_receipt", JSON.stringify(transaction));

    router.push("/manny-pay/receipt");
  }

  return (
    <main className="min-h-screen bg-[#f7f7f7] px-6 py-8 text-black">
      <div className="mx-auto max-w-sm">
        <button onClick={() => router.back()} className="mb-8 text-3xl">
          ←
        </button>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold">Shop</h1>

          <p className="mt-3 text-gray-500">
            Discover shopping deals and merchants with Manny Pay Wallet.
          </p>

          <div className="mt-8 space-y-4">
            {products.map((product) => (
              <div
                key={product.name}
                className="rounded-3xl bg-gray-100 p-5"
              >
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{product.icon}</div>

                  <div className="flex-1">
                    <h2 className="font-bold">{product.name}</h2>
                    <p className="text-sm text-gray-500">{product.merchant}</p>
                  </div>

                  <p className="font-bold">₱{product.price}</p>
                </div>

                <button
                  onClick={() => buyProduct(product)}
                  className="rounded-2xl bg-gradient-to-r from-[#0B1F6D] to-[#1E3A8A] py-4 font-bold text-white shadow-lg transition hover:from-[#1E3A8A] hover:to-[#2563EB]"
                >
                  Buy Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
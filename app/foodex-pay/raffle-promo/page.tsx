"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RafflePromoPage() {
  const router = useRouter();

  const [tickets, setTickets] = useState(0);

  useEffect(() => {
    setTickets(Number(localStorage.getItem("foodex_pay_raffle_tickets") || "0"));
  }, []);

  function buyTicket() {
    const price = 20;
    const balance = Number(localStorage.getItem("foodex_pay_wallet_balance") || "0");

    if (balance < price) {
      alert("Insufficient wallet balance.");
      return;
    }

    const updatedBalance = balance - price;
    const updatedTickets = tickets + 1;
    const reference = `AW-RAFFLE-${Date.now()}`;

    localStorage.setItem("foodex_pay_wallet_balance", updatedBalance.toString());
    localStorage.setItem("foodex_pay_raffle_tickets", updatedTickets.toString());
    setTickets(updatedTickets);

    const transaction = {
      id: reference,
      type: "Raffle Ticket",
      amount: price,
      method: "Foodex Pay Raffle Promo",
      status: "Completed",
      recipient: `Ticket #${updatedTickets}`,
      createdAt: new Date().toISOString(),
    };

    const existing = localStorage.getItem("foodex_pay_wallet_transactions");
    const transactions = existing ? JSON.parse(existing) : [];

    localStorage.setItem(
      "foodex_pay_wallet_transactions",
      JSON.stringify([transaction, ...transactions])
    );

    localStorage.setItem("foodex_pay_wallet_latest_receipt", JSON.stringify(transaction));

    router.push("/foodex-pay/receipt");
  }

  function simulateWin() {
    if (tickets <= 0) {
      alert("You need at least 1 raffle ticket.");
      return;
    }

    const prize = 100;
    const balance = Number(localStorage.getItem("foodex_pay_wallet_balance") || "0");
    const updatedBalance = balance + prize;
    const reference = `AW-RAFFLE-WIN-${Date.now()}`;

    localStorage.setItem("foodex_pay_wallet_balance", updatedBalance.toString());

    const transaction = {
      id: reference,
      type: "Raffle Prize",
      amount: prize,
      method: "Foodex Pay Raffle Promo",
      status: "Completed",
      recipient: "Promo Reward",
      createdAt: new Date().toISOString(),
    };

    const existing = localStorage.getItem("foodex_pay_wallet_transactions");
    const transactions = existing ? JSON.parse(existing) : [];

    localStorage.setItem(
      "foodex_pay_wallet_transactions",
      JSON.stringify([transaction, ...transactions])
    );

    alert("Congratulations! You won ₱100.");
  }

  return (
    <main className="min-h-screen bg-[#f7f7f7] px-6 py-8 text-black">
      <div className="mx-auto max-w-sm">
        <button onClick={() => router.back()} className="mb-8 text-3xl">
          ←
        </button>

        <div className="rounded-3xl bg-gradient-to-r from-[#0B1F6D] to-[#1E3A8A] p-6 text-white shadow-xl">
          <p className="text-sm text-white/50">Foodex Pay Raffle Promo</p>
          <h1 className="mt-3 text-4xl font-bold">Raffle Rewards</h1>
          <p className="mt-2 text-white/50">Buy tickets and win wallet prizes.</p>
        </div>

        <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold">Your Tickets</h2>
          <p className="mt-3 text-5xl font-bold text-[#1E3A8A]-600">{tickets}</p>
          <p className="mt-2 text-gray-500">Each ticket costs ₱20.</p>

          <button
            onClick={buyTicket}
            className="mt-6 w-full rounded-2xl bg-[#1E3A8A]-600 py-4 font-bold text-white"
          >
            Buy Raffle Ticket
          </button>

          <button
            onClick={simulateWin}
            className="mt-4 w-full rounded-2xl bg-black py-4 font-bold text-white"
          >
            Simulate Win ₱100
          </button>
        </div>
      </div>
    </main>
  );
}
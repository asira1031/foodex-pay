"use client";

import { useEffect, useState } from "react";

type KYCRecord = {
  id: string;
  client_email: string;
  full_name: string;
  phone: string;
  address: string;
  id_front_url: string;
  selfie_url: string;
  status: string;
  created_at: string;
};

export default function AdminKYCPage() {
  const [records, setRecords] = useState<KYCRecord[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadKYC() {
    setLoading(true);

    const res = await fetch("/api/manny-pay/admin/kyc", {
      method: "GET",
      cache: "no-store",
    });

    const data = await res.json();

    if (!data.ok) {
      alert(data.message || "Failed to load KYC records.");
      setLoading(false);
      return;
    }

    setRecords(data.records || []);
    setLoading(false);
  }

  async function updateStatus(id: string, status: "APPROVED" | "REJECTED") {
    const res = await fetch("/api/manny-pay/admin/kyc", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, status }),
    });

    const data = await res.json();

    if (!data.ok) {
      alert(data.message || "Failed to update KYC status.");
      return;
    }

    alert(`KYC ${status}`);
    loadKYC();
  }

  useEffect(() => {
    loadKYC();
  }, []);

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-black">Manny Pay KYC Review</h1>
        <p className="mt-2 text-white/50">Review submitted IDs and selfies.</p>

        {loading ? (
          <p className="mt-10 text-white/50">Loading KYC submissions...</p>
        ) : (
          <div className="mt-8 grid gap-6">
            {records.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold">{item.full_name}</h2>
                    <p className="text-white/50">{item.client_email}</p>
                    <p className="text-white/50">{item.phone}</p>
                    <p className="mt-2 text-sm text-white/60">
                      {item.address}
                    </p>
                    <p className="mt-2 text-xs text-white/30">
                      Submitted: {new Date(item.created_at).toLocaleString()}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-4 py-2 text-sm font-bold ${
                      item.status === "APPROVED"
                        ? "bg-green-600"
                        : item.status === "REJECTED"
                        ? "bg-red-600"
                        : "bg-yellow-500 text-black"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <a
                    href={item.id_front_url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl bg-white p-3 text-black"
                  >
                    <p className="mb-2 font-bold">Valid ID</p>
                    <img
                      src={item.id_front_url}
                      alt="Valid ID"
                      className="h-64 w-full rounded-xl object-cover"
                    />
                  </a>

                  <a
                    href={item.selfie_url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl bg-white p-3 text-black"
                  >
                    <p className="mb-2 font-bold">Selfie</p>
                    <img
                      src={item.selfie_url}
                      alt="Selfie"
                      className="h-64 w-full rounded-xl object-cover"
                    />
                  </a>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => updateStatus(item.id, "APPROVED")}
                    className="rounded-xl bg-green-600 px-5 py-3 font-bold text-white"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => updateStatus(item.id, "REJECTED")}
                    className="rounded-xl bg-red-600 px-5 py-3 font-bold text-white"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}

            {records.length === 0 && (
              <p className="text-white/50">No KYC submissions yet.</p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
"use client";

import { useRouter } from "next/navigation";

export default function ScanPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-black px-6 py-8 text-white">
      <div className="mx-auto max-w-sm">
        <button onClick={() => router.back()} className="mb-8 text-3xl">
          ←
        </button>

        <h1 className="mb-2 text-3xl font-bold">Scan QR</h1>
        <p className="mb-8 text-white/50">Scan another Manny Pay QR code.</p>

        <div className="flex h-80 items-center justify-center rounded-3xl border border-white/20 bg-white/5">
          <div className="h-56 w-56 rounded-3xl border-4 border-emerald-500" />
        </div>

        <p className="mt-6 text-center text-white/50">Camera scanner coming soon</p>
      </div>
    </main>
  );
}
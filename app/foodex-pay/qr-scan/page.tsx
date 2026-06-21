"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Html5Qrcode } from "html5-qrcode";

export default function QrScanPage() {
  const router = useRouter();
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isRunningRef = useRef(false);

  const [scanResult, setScanResult] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function stopScanner() {
    try {
      if (scannerRef.current && isRunningRef.current) {
        await scannerRef.current.stop();
        isRunningRef.current = false;
      }
    } catch (error) {
      console.log("Scanner already stopped.");
    }
  }

  useEffect(() => {
    const scanner = new Html5Qrcode("qr-reader");
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        async (decodedText) => {
          setScanResult(decodedText);
          await stopScanner();
        },
        () => {}
      )
      .then(() => {
        isRunningRef.current = true;
      })
      .catch((error) => {
        setErrorMessage("Please allow camera permission to scan QR.");
        console.error(error);
      });

    return () => {
      stopScanner();
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#f7f7f7] p-5 text-black">
      <div className="mx-auto max-w-sm">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={async () => {
              await stopScanner();
              router.back();
            }}
            className="rounded-xl bg-black px-4 py-2 text-white"
          >
            ← Back
          </button>

          <h1 className="text-2xl font-bold">Scan QR</h1>

          <div />
        </div>

        <div className="overflow-hidden rounded-3xl bg-white p-4 shadow-sm">
          <div id="qr-reader" className="w-full" />
        </div>

        {errorMessage && (
          <div className="mt-4 rounded-2xl bg-red-100 p-4 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="mt-6 rounded-3xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Scanned Result</p>
          <p className="mt-2 break-all font-bold">
            {scanResult || "Camera scanner active..."}
          </p>
        </div>
      </div>
    </main>
  );
}
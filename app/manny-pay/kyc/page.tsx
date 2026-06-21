"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function KYCPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [address, setAddress] = useState("");

  const [idFile, setIdFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    try {
      if (
        !fullName ||
        !birthDate ||
        !address ||
        !idFile ||
        !selfieFile
      ) {
        alert("Complete all KYC requirements.");
        return;
      }

      setLoading(true);

      const clientEmail =
  localStorage.getItem("manny_pay_wallet_email") || "guest";

const phone =
  localStorage.getItem("manny_pay_wallet_phone") || "";

      const formData = new FormData();

      formData.append("clientEmail", clientEmail);
      formData.append("phone", phone);
      formData.append("fullName", fullName);
      formData.append("birthDate", birthDate);
      formData.append("address", address);
      formData.append("idFile", idFile);
      formData.append("selfieFile", selfieFile);

      const res = await fetch(
        "/api/manny-pay/kyc",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (!data.ok) {
        throw new Error(data.message);
      }

      localStorage.setItem(
        "manny_pay_kyc_status",
        "PENDING"
      );

      alert(
        "KYC submitted successfully. Status: PENDING"
      );

      router.push("/manny-pay/dashboard");
    } catch (error: any) {
      alert(error.message || "KYC submission failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f7f7] px-6 py-8 text-black">
      <div className="mx-auto max-w-md">
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
            KYC Verification
          </h1>

          <p className="mt-2 text-white/50">
            Verify your identity for full wallet access.
          </p>
        </div>

        <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm">
          <div className="space-y-5">

            <div>
              <label className="text-sm text-gray-500">
                Full Name
              </label>

              <input
                value={fullName}
                onChange={(e) =>
                  setFullName(e.target.value)
                }
                placeholder="Juan Dela Cruz"
                className="mt-2 w-full rounded-2xl bg-gray-100 px-4 py-4 outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">
                Birth Date
              </label>

              <input
                type="date"
                value={birthDate}
                onChange={(e) =>
                  setBirthDate(e.target.value)
                }
                className="mt-2 w-full rounded-2xl bg-gray-100 px-4 py-4 outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">
                Address
              </label>

              <textarea
                value={address}
                onChange={(e) =>
                  setAddress(e.target.value)
                }
                placeholder="Full Address"
                className="mt-2 w-full rounded-2xl bg-gray-100 px-4 py-4 outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">
                Upload Valid ID
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setIdFile(
                    e.target.files?.[0] || null
                  )
                }
                className="mt-2 w-full"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">
                Upload Selfie
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setSelfieFile(
                    e.target.files?.[0] || null
                  )
                }
                className="mt-2 w-full"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full rounded-2xl bg-emerald-600 py-4 font-bold text-white"
            >
              {loading
                ? "Uploading..."
                : "Submit Verification"}
            </button>

          </div>
        </div>

        <div className="mt-6 rounded-3xl bg-yellow-50 p-5 text-sm text-yellow-800">
          Submitted KYC documents will be stored and reviewed by Manny Pay administrators.
        </div>
      </div>
    </main>
  );
}
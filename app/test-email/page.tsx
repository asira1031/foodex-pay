"use client";

export default function TestEmailPage() {
  async function sendTest() {
    const res = await fetch("/api/notifications/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: "asira1031@gmail.com",
        subject: "Foodex Pay Wallet Test",
        message:
          "Your email notification system is working.",
      }),
    });

    const data = await res.json();

    console.log(data);

    if (data.ok) {
      alert("Email sent!");
    } else {
      alert("Email failed.");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black text-white">
      <button
        onClick={sendTest}
        className="rounded-2xl bg-[#1E3A8A] px-8 py-4 font-bold"
      >
        Send Test Email
      </button>
    </main>
  );
}
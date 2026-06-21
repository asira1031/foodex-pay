import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FOODEX PAY",
  description:
    "Digital wallet for cash-in, send money, QR payments, bills, savings, and merchant services.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}

        <div
          style={{
            position: "fixed",
            bottom: 10,
            width: "100%",
            textAlign: "center",
            fontSize: 12,
            color: "#888",
            letterSpacing: "0.5px",
            zIndex: 9999,
            pointerEvents: "none",
          }}
        >
          Powered by Technological digital innovation Inc.
        </div>
      </body>
    </html>
  );
}
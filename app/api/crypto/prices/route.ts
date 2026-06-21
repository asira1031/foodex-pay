import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=tether,usd-coin,bitcoin,ethereum,binancecoin,ripple&vs_currencies=php"
    );

    const data = await res.json();

    const prices = {
      USDT: data.tether.php,
      USDC: data["usd-coin"].php,
      BTC: data.bitcoin.php,
      ETH: data.ethereum.php,
      BNB: data.binancecoin.php,
      XRP: data.ripple.php,
    };

    return NextResponse.json({
      ok: true,
      prices,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        error: err.message,
      },
      { status: 500 }
    );
  }
}
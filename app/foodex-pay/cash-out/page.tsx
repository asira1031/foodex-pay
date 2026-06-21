import { redirect } from "next/navigation";

export default function CashOutRedirect() {
  redirect("/foodex-pay/send-money");
}
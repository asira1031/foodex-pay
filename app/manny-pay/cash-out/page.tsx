import { redirect } from "next/navigation";

export default function CashOutRedirect() {
  redirect("/manny-pay/send-money");
}
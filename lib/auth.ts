export function isLoggedIn() {
  if (typeof window === "undefined") return false;

  return localStorage.getItem("foodex_pay_wallet_logged_in") === "yes";
}

export function logoutUser() {
  localStorage.removeItem("foodex_pay_wallet_logged_in");
}

export function getWalletUser() {
  return {
    phone: localStorage.getItem("foodex_pay_wallet_phone") || "",
    fullName:
      localStorage.getItem("foodex_pay_wallet_full_name") ||
      "Foodex Pay User",
  };
}
export function isLoggedIn() {
  if (typeof window === "undefined") return false;

  return localStorage.getItem("manny_pay_wallet_logged_in") === "yes";
}

export function logoutUser() {
  localStorage.removeItem("manny_pay_wallet_logged_in");
}

export function getWalletUser() {
  return {
    phone: localStorage.getItem("manny_pay_wallet_phone") || "",
    fullName:
      localStorage.getItem("manny_pay_wallet_full_name") ||
      "Manny Pay User",
  };
}
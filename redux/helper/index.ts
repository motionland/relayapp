export { default as api } from "./axios";
export * from "./hooks";

export function detectCountryCode(phone: string): "US" | "CA" | "MX" {
  if (phone.startsWith("+1")) {
    return "US"
  }
  if (phone.startsWith("+52")) return "MX"
  return "US"
}

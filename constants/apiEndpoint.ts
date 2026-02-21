export const APIEndpoints = {
  baseURL: "https://cafe-billing-api.vercel.app/api",
  auth: {
    sendOtp: "/auth/initiate",
    verifyOtp: "/auth/verify",
    refreshToken: "/auth/refresh",
  },
  business: {
    list: "/tenants",
  }
}
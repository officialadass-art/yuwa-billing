export const APIEndpoints = {
  baseURL: "https://cafe-billing-api.vercel.app/api", // Production
  // baseURL: "http://localhost:3000/api", // Development
  auth: {
    sendOtp: "/auth/initiate",
    verifyOtp: "/auth/verify",
    refreshToken: "/auth/refresh",
  },
  business: {
    list: "/tenants",
    create: "/tenants/create"
  }
}
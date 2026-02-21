export const APIEndpoints = {
  baseURL: "http://localhost:3000/api",
  auth: {
    sendOtp: "/auth/initiate",
    verifyOtp: "/auth/verify",
    refreshToken: "/auth/refresh",
  },
  business: {
    list: "/tenants",
  }
}
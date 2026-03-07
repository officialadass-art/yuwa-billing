export const APIEndpoints = {
  // baseURL: "https://cafe-billing-api.vercel.app/api", // Production
  baseURL: "http://localhost:3000/api", // Development
  auth: {
    sendOtp: "/auth/initiate",
    verifyOtp: "/auth/verify",
    refreshToken: "/auth/refresh",
  },
  business: {
    list: "/tenants",
    create: "/tenants/create"
  },
  dashboard: {
    summary: "/tenants/:tenantId/dashboard/summary",
  },
  products: {
    list: "/tenants/:tenantId/products",
    update: "/tenants/:tenantId/products/:productId",
    create: "/tenants/:tenantId/products",
    delete: "/tenants/:tenantId/products/:productId",
  },
  invoices: {
    create: "/tenants/:tenantId/invoices",
    list: "/tenants/:tenantId/invoices",
    details: "/tenants/:tenantId/invoices/:invoiceId",
  }
}
export const API_CONFIG = {
  baseUrl: '/v1/api',
  auth: {
    requestOtp: '/v1/api/auth/otp/request',
    verifyOtp: '/v1/api/auth/otp/verify',
    me: '/v1/api/auth/me',
  },
  catalog: {
    list: '/v1/api/catalog',
    search: '/v1/api/catalog/search',
    detail: (id: string) => `/v1/api/catalog/${id}`,
    spec: (id: string) => `/v1/api/catalog/${id}/spec`,
  },
  sandbox: {
    execute: '/v1/api/sandbox/execute',
    history: '/v1/api/sandbox/history',
  },
  ai: {
    assistant: '/v1/api/ai/assistant',
  },
  lifecycle: {
    list: '/v1/api/apis',
    create: '/v1/api/apis',
    changeStatus: (id: string) => `/v1/api/apis/${id}/status`,
    audit: (id: string) => `/v1/api/apis/${id}/audit`,
  },
  analytics: {
    dashboard: '/v1/api/analytics/dashboard',
    events: '/v1/api/analytics/events',
  },
  observability: {
    dashboard: '/v1/api/observability/dashboard',
  },
};

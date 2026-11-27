export const ApiRoutes = {
  auth: {
    login: '/auth/login',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
  },
  sessions: {
    recognize: '/sessions/recognize',
    recogniseByPlate: '/sessions/recognise-by-plate',
    create: '/sessions/',
    get: (id: string) => `/sessions/${id}`,
    close: (id: string) => `/sessions/${id}/close`,
    list: (query: string) => `/sessions/?${query}`,
    getPhoto: (id: string, type: 'entry' | 'exit') => `/sessions/${id}/photo/${type}`,
    listVehicles: '/sessions/vehicles',
    attendantAnalytics: (query: string) => `/sessions/analytics/attendant/?${query}`,
  },
} as const;

export type HealthStatus = {
  status: 'ok';
  timestamp: string;
  uptime: number;
};

export class HealthService {
  check(): HealthStatus {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}

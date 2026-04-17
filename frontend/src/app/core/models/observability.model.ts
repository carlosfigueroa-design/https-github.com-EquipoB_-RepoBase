export interface ApmService {
  name: string;
  status: 'ok' | 'warn' | 'alert';
  avgResponseMs: number;
  errorCount: number;
  requestCount: number;
  uptime: number;
}

export interface ApmError {
  code: string;
  message: string;
  count: number;
  service: string;
  lastOccurrence: string;
}

export interface ErrorAnalysis {
  errorCode: string;
  rootCause: string;
  solution: string;
  severity: 'low' | 'medium' | 'high';
  affectedUsers: number;
}

export interface RumFlow {
  name: string;
  status: 'ok' | 'warn' | 'alert';
  availabilityMinutes: number;
  unavailabilityMinutes: number;
  availabilityPct: number;
  totalTests: number;
  passed: number;
  failed: number;
  avgExecutionMs: number;
  avgStepMs: number;
  passRate: number;
  failRate: number;
}

export interface CnmZone {
  name: string;
  status: 'ok' | 'warn' | 'alert';
  containers: number;
  healthyContainers: number;
  latencyMs: number;
}

export interface CnmConnection {
  from: string;
  to: string;
  status: 'ok' | 'warn' | 'alert';
  latencyMs: number;
  packetLoss: number;
}

export interface ObservabilityDashboard {
  apm: {
    services: ApmService[];
    topErrors: ApmError[];
    errorAnalysis: ErrorAnalysis[];
    responseTrend: Record<string, unknown>[];
  };
  rum: {
    flows: RumFlow[];
  };
  cnm: {
    zones: CnmZone[];
    connections: CnmConnection[];
    totalContainers: number;
    healthyContainers: number;
    overallStatus: 'ok' | 'warn' | 'alert';
  };
  npm: {
    availability: {
      uptimeMinutes: number;
      downtimeMinutes: number;
      uptimePct: number;
      totalIncidents: number;
      activeIncidents: number;
    };
    latency: {
      current: number;
      avg24h: number;
      p95: number;
      p99: number;
      trend: { time: string; value: number }[];
    };
    packetLoss: {
      current: number;
      avg24h: number;
      max24h: number;
    };
    serviceThroughput: {
      service: string;
      inboundMbps: number;
      outboundMbps: number;
      status: 'ok' | 'warn' | 'alert';
    }[];
  };
}

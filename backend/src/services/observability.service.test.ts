import { ObservabilityService } from './observability.service';
import { JsonStoreService } from './json-store.service';

jest.mock('./json-store.service');

const mockData = {
  apm: { services: [{ name: 'test', status: 'ok', avgResponseMs: 50, errorCount: 0, requestCount: 100, uptime: 99.9 }], topErrors: [], errorAnalysis: [], responseTrend: [] },
  rum: { flows: [{ name: 'Login', status: 'ok', availabilityMinutes: 1440, unavailabilityMinutes: 0, availabilityPct: 100, totalTests: 10, passed: 10, failed: 0, avgExecutionMs: 1000, avgStepMs: 200, passRate: 100, failRate: 0 }] },
  cnm: { zones: [], connections: [], totalContainers: 10, healthyContainers: 10, overallStatus: 'ok' },
  npm: { availability: { uptimeMinutes: 1440, downtimeMinutes: 0, uptimePct: 100, totalIncidents: 0, activeIncidents: 0 }, latency: { current: 10, avg24h: 12, p95: 30, p99: 50, trend: [] }, packetLoss: { current: 0, avg24h: 0, max24h: 0 }, serviceThroughput: [] },
};

describe('ObservabilityService', () => {
  let service: ObservabilityService;
  let store: jest.Mocked<JsonStoreService>;

  beforeEach(() => {
    store = new JsonStoreService() as jest.Mocked<JsonStoreService>;
    store.read = jest.fn().mockResolvedValue(mockData);
    service = new ObservabilityService(store);
  });

  it('should return full observability dashboard', async () => {
    const result = await service.getDashboard();
    expect(result).toHaveProperty('apm');
    expect(result).toHaveProperty('rum');
    expect(result).toHaveProperty('cnm');
    expect(result).toHaveProperty('npm');
    expect(result.apm.services).toHaveLength(1);
    expect(result.rum.flows).toHaveLength(1);
  });

  it('should read from observability.json', async () => {
    await service.getDashboard();
    expect(store.read).toHaveBeenCalledWith('observability.json');
  });
});

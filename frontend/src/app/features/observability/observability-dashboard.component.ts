import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ObservabilityService } from '../../core/services/observability.service';
import { ObservabilityDashboard } from '../../core/models/observability.model';

@Component({
  selector: 'app-observability-dashboard',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['../../shared/styles/admin-layout.scss'],
  template: `
    <div class="admin-container">
      <header class="admin-header">
        <div class="header-content">
          <div class="header-left">
            <h1><i class="fa-solid fa-satellite-dish"></i> Observabilidad</h1>
            <p>Monitoreo en tiempo real del portal Vínculo Bolívar</p>
          </div>
          <div class="header-stats" *ngIf="data">
            <div class="stat-pill" [class]="'pill-' + overallHealth">
              <i class="fa-solid fa-circle"></i> {{ overallHealth | uppercase }}
            </div>
          </div>
        </div>
      </header>

      <main class="admin-content">
        <div *ngIf="loading" class="loading-state">
          <span class="sb-ui-spinner" style="width:32px;height:32px"></span>
          <p>Cargando métricas de observabilidad...</p>
        </div>

        <div *ngIf="error" class="error-state">
          <i class="fa-solid fa-exclamation-triangle"></i>
          <p>{{ error }}</p>
          <button class="sb-ui-button" (click)="load()">Reintentar</button>
        </div>

        <div *ngIf="data && !loading" class="obs-grid">

          <!-- TAB NAV -->
          <div class="tab-nav">
            <button *ngFor="let tab of tabs" class="tab-btn" [class.active]="activeTab === tab.id" (click)="activeTab = tab.id">
              <i [class]="tab.icon"></i> {{ tab.label }}
              <span *ngIf="tab.badge" class="tab-badge" [class]="'badge-' + tab.badgeColor">{{ tab.badge }}</span>
            </button>
          </div>

          <!-- APM -->
          <section *ngIf="activeTab === 'apm'" class="tab-content">
            <h2 class="section-title"><i class="fa-solid fa-gauge-high"></i> Application Performance Monitoring</h2>

            <div class="services-grid">
              <div *ngFor="let s of data.apm.services" class="service-card" [class]="'border-' + s.status">
                <div class="svc-header">
                  <span class="status-dot" [class]="'dot-' + s.status"></span>
                  <span class="svc-name">{{ s.name }}</span>
                  <span class="svc-status-tag" [class]="'tag-' + s.status">{{ s.status | uppercase }}</span>
                </div>
                <div class="svc-metrics">
                  <div class="svc-metric"><span class="sm-val">{{ s.avgResponseMs }}ms</span><span class="sm-lbl">Resp. promedio</span></div>
                  <div class="svc-metric"><span class="sm-val err-val">{{ s.errorCount }}</span><span class="sm-lbl">Errores</span></div>
                  <div class="svc-metric"><span class="sm-val">{{ s.requestCount | number }}</span><span class="sm-lbl">Requests</span></div>
                  <div class="svc-metric"><span class="sm-val">{{ s.uptime }}%</span><span class="sm-lbl">Uptime</span></div>
                </div>
              </div>
            </div>

            <div class="two-col">
              <div class="obs-card">
                <h3>Top Errores</h3>
                <div class="error-list">
                  <div *ngFor="let e of data.apm.topErrors" class="error-row">
                    <div class="err-left">
                      <span class="err-code">{{ e.code }}</span>
                      <span class="err-msg">{{ e.message }}</span>
                      <span class="err-svc">{{ e.service }}</span>
                    </div>
                    <span class="err-count">{{ e.count }}</span>
                  </div>
                </div>
              </div>

              <div class="obs-card">
                <h3>Análisis Causa / Solución</h3>
                <div class="analysis-list">
                  <div *ngFor="let a of data.apm.errorAnalysis" class="analysis-item">
                    <div class="analysis-header">
                      <span class="analysis-code">{{ a.errorCode }}</span>
                      <span class="severity-tag" [class]="'sev-' + a.severity">{{ a.severity | uppercase }}</span>
                      <span class="affected">{{ a.affectedUsers }} usuarios afectados</span>
                    </div>
                    <div class="analysis-body">
                      <p><strong>Causa raíz:</strong> {{ a.rootCause }}</p>
                      <p><strong>Solución:</strong> {{ a.solution }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- RUM -->
          <section *ngIf="activeTab === 'rum'" class="tab-content">
            <h2 class="section-title"><i class="fa-solid fa-user-check"></i> Real User Monitoring & Synthetic</h2>

            <div class="flows-grid">
              <div *ngFor="let f of data.rum.flows" class="flow-card" [class]="'border-' + f.status">
                <div class="flow-header">
                  <span class="status-dot" [class]="'dot-' + f.status"></span>
                  <span class="flow-name">{{ f.name }}</span>
                  <span class="svc-status-tag" [class]="'tag-' + f.status">{{ f.status | uppercase }}</span>
                </div>

                <div class="flow-avail">
                  <div class="avail-bar">
                    <div class="avail-fill" [style.width.%]="f.availabilityPct"></div>
                  </div>
                  <div class="avail-labels">
                    <span class="avail-up"><i class="fa-solid fa-check"></i> {{ f.availabilityMinutes }}min ({{ f.availabilityPct }}%)</span>
                    <span class="avail-down"><i class="fa-solid fa-xmark"></i> {{ f.unavailabilityMinutes }}min</span>
                  </div>
                </div>

                <div class="flow-stats">
                  <div class="fs"><span class="fs-val">{{ f.totalTests }}</span><span class="fs-lbl">Tests</span></div>
                  <div class="fs ok"><span class="fs-val">{{ f.passed }}</span><span class="fs-lbl">Exitosos</span></div>
                  <div class="fs fail"><span class="fs-val">{{ f.failed }}</span><span class="fs-lbl">Fallidos</span></div>
                  <div class="fs"><span class="fs-val">{{ f.avgExecutionMs | number }}ms</span><span class="fs-lbl">Tiempo total</span></div>
                  <div class="fs"><span class="fs-val">{{ f.avgStepMs }}ms</span><span class="fs-lbl">Prom/paso</span></div>
                </div>

                <div class="flow-rates">
                  <div class="rate-bar">
                    <div class="rate-pass" [style.width.%]="f.passRate">{{ f.passRate }}%</div>
                    <div class="rate-fail" [style.width.%]="f.failRate" *ngIf="f.failRate > 3">{{ f.failRate }}%</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- CNM -->
          <section *ngIf="activeTab === 'cnm'" class="tab-content">
            <h2 class="section-title"><i class="fa-solid fa-cloud"></i> Cloud Network Monitoring</h2>

            <div class="cnm-summary">
              <div class="metric-card">
                <div class="metric-icon cnm-icon"><i class="fa-solid fa-server"></i></div>
                <div class="metric-info">
                  <span class="metric-value">{{ data.cnm.healthyContainers }}/{{ data.cnm.totalContainers }}</span>
                  <span class="metric-label">Contenedores saludables</span>
                </div>
              </div>
              <div class="metric-card">
                <div class="metric-icon" [class]="'dot-bg-' + data.cnm.overallStatus"><i class="fa-solid fa-wifi"></i></div>
                <div class="metric-info">
                  <span class="metric-value">{{ data.cnm.overallStatus | uppercase }}</span>
                  <span class="metric-label">Estado general de red</span>
                </div>
              </div>
            </div>

            <div class="two-col">
              <div class="obs-card">
                <h3>Zonas de Disponibilidad</h3>
                <div class="zone-list">
                  <div *ngFor="let z of data.cnm.zones" class="zone-row">
                    <span class="status-dot" [class]="'dot-' + z.status"></span>
                    <span class="zone-name">{{ z.name }}</span>
                    <span class="zone-detail">{{ z.healthyContainers }}/{{ z.containers }} containers</span>
                    <span class="zone-latency">{{ z.latencyMs }}ms</span>
                  </div>
                </div>
              </div>

              <div class="obs-card">
                <h3>Conexiones entre Servicios</h3>
                <div class="conn-list">
                  <div *ngFor="let c of data.cnm.connections" class="conn-row">
                    <span class="status-dot" [class]="'dot-' + c.status"></span>
                    <span class="conn-path">{{ c.from }} → {{ c.to }}</span>
                    <span class="conn-latency">{{ c.latencyMs }}ms</span>
                    <span class="conn-loss" [class.loss-warn]="c.packetLoss > 0.5">{{ c.packetLoss }}% loss</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- NPM -->
          <section *ngIf="activeTab === 'npm'" class="tab-content">
            <h2 class="section-title"><i class="fa-solid fa-network-wired"></i> Network Performance Monitoring</h2>

            <div class="cards-row">
              <div class="metric-card">
                <div class="metric-icon npm-up"><i class="fa-solid fa-arrow-up"></i></div>
                <div class="metric-info">
                  <span class="metric-value">{{ data.npm.availability.uptimePct }}%</span>
                  <span class="metric-label">Disponibilidad ({{ data.npm.availability.uptimeMinutes }}min up)</span>
                </div>
              </div>
              <div class="metric-card">
                <div class="metric-icon npm-down"><i class="fa-solid fa-arrow-down"></i></div>
                <div class="metric-info">
                  <span class="metric-value">{{ data.npm.availability.downtimeMinutes }}min</span>
                  <span class="metric-label">Indisponibilidad</span>
                </div>
              </div>
              <div class="metric-card">
                <div class="metric-icon npm-inc"><i class="fa-solid fa-triangle-exclamation"></i></div>
                <div class="metric-info">
                  <span class="metric-value">{{ data.npm.availability.totalIncidents }} ({{ data.npm.availability.activeIncidents }} activo)</span>
                  <span class="metric-label">Incidentes</span>
                </div>
              </div>
            </div>

            <div class="two-col">
              <div class="obs-card">
                <h3>Latencia de Red</h3>
                <div class="npm-metrics">
                  <div class="npm-row"><span>Actual</span><strong>{{ data.npm.latency.current }}ms</strong></div>
                  <div class="npm-row"><span>Promedio 24h</span><strong>{{ data.npm.latency.avg24h }}ms</strong></div>
                  <div class="npm-row"><span>P95</span><strong>{{ data.npm.latency.p95 }}ms</strong></div>
                  <div class="npm-row"><span>P99</span><strong>{{ data.npm.latency.p99 }}ms</strong></div>
                </div>
                <div class="bar-chart small-chart">
                  <div class="bar-item" *ngFor="let t of data.npm.latency.trend">
                    <div class="bar-fill npm-bar" [style.height.%]="getBarPct(t.value, maxLatency)">
                      <span class="bar-value">{{ t.value }}</span>
                    </div>
                    <span class="bar-label">{{ t.time }}</span>
                  </div>
                </div>
              </div>

              <div class="obs-card">
                <h3>Pérdida de Paquetes & Rendimiento</h3>
                <div class="npm-metrics">
                  <div class="npm-row"><span>Pérdida actual</span><strong>{{ data.npm.packetLoss.current }}%</strong></div>
                  <div class="npm-row"><span>Promedio 24h</span><strong>{{ data.npm.packetLoss.avg24h }}%</strong></div>
                  <div class="npm-row"><span>Máximo 24h</span><strong class="loss-warn">{{ data.npm.packetLoss.max24h }}%</strong></div>
                </div>
                <h4 style="margin:16px 0 8px;font-size:0.85rem">Rendimiento por Servicio</h4>
                <div class="throughput-list">
                  <div *ngFor="let s of data.npm.serviceThroughput" class="tp-row">
                    <span class="status-dot" [class]="'dot-' + s.status"></span>
                    <span class="tp-name">{{ s.service }}</span>
                    <span class="tp-in">↓ {{ s.inboundMbps }} Mbps</span>
                    <span class="tp-out">↑ {{ s.outboundMbps }} Mbps</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  `,
  styles: [`
    .obs-grid { display: flex; flex-direction: column; gap: 24px; }

    .tab-nav { display: flex; gap: 4px; background: var(--sb-ui-color-grayscale-white, #fff); border-radius: 12px; padding: 4px; box-shadow: var(--sb-ui-shadow-m, 0 2px 8px rgba(0,0,0,0.06)); border: 1px solid var(--sb-ui-color-grayscale-L200, #E1E1E1); }
    .tab-btn { flex: 1; padding: 10px 16px; border: none; background: transparent; border-radius: 8px; font-size: 0.825rem; font-weight: 600; color: var(--sb-ui-color-grayscale-D200, #5B5B5B); cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.2s ease; }
    .tab-btn:hover { background: var(--sb-ui-color-grayscale-L400, #FAFAFA); }
    .tab-btn.active { background: var(--sb-ui-color-primary-base, #009056); color: #fff; }
    .tab-badge { font-size: 0.65rem; padding: 2px 6px; border-radius: 10px; font-weight: 700; }
    .badge-red { background: #FCE4EC; color: #C62828; }
    .badge-yellow { background: #FFF8E1; color: #F57F17; }

    .tab-content { animation: fadeIn 0.3s ease; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

    .section-title { font-size: 1.05rem; font-weight: 700; color: var(--sb-ui-color-grayscale-D400, #282828); display: flex; align-items: center; gap: 8px; margin: 0 0 16px; padding-bottom: 8px; border-bottom: 2px solid var(--sb-ui-color-primary-L300, #E5F4EE); }
    .section-title i { color: var(--sb-ui-color-primary-base, #009056); }

    .services-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 12px; margin-bottom: 20px; }
    .service-card { background: var(--sb-ui-color-grayscale-white, #fff); border-radius: 10px; padding: 16px; box-shadow: var(--sb-ui-shadow-m); border-left: 4px solid transparent; }
    .border-ok { border-left-color: var(--sb-ui-color-feedback-success-base, #28a745); }
    .border-warn { border-left-color: var(--sb-ui-color-feedback-warning-base, #ffc100); }
    .border-alert { border-left-color: var(--sb-ui-color-feedback-error-base, #dc3545); }

    .svc-header { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
    .status-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
    .dot-ok { background: var(--sb-ui-color-feedback-success-base, #28a745); }
    .dot-warn { background: var(--sb-ui-color-feedback-warning-base, #ffc100); }
    .dot-alert { background: var(--sb-ui-color-feedback-error-base, #dc3545); animation: pulse 1.5s infinite; }
    @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }

    .svc-name { font-weight: 600; font-size: 0.875rem; color: var(--sb-ui-color-grayscale-D400, #282828); flex: 1; }
    .svc-status-tag { font-size: 0.65rem; padding: 2px 8px; border-radius: 4px; font-weight: 700; }
    .tag-ok { background: #E8F5E9; color: #2E7D32; }
    .tag-warn { background: #FFF8E1; color: #F57F17; }
    .tag-alert { background: #FCE4EC; color: #C62828; }

    .svc-metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
    .svc-metric { display: flex; flex-direction: column; align-items: center; }
    .sm-val { font-size: 0.95rem; font-weight: 700; color: var(--sb-ui-color-grayscale-D400, #282828); }
    .sm-lbl { font-size: 0.65rem; color: var(--sb-ui-color-grayscale-D200, #5B5B5B); }
    .err-val { color: var(--sb-ui-color-feedback-error-base, #dc3545); }

    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .obs-card { background: var(--sb-ui-color-grayscale-white, #fff); border-radius: 12px; padding: 20px; box-shadow: var(--sb-ui-shadow-m); border: 1px solid var(--sb-ui-color-grayscale-L200, #E1E1E1); }
    .obs-card h3 { margin: 0 0 12px; font-size: 0.9rem; font-weight: 600; color: var(--sb-ui-color-grayscale-D400, #282828); }

    .error-list { display: flex; flex-direction: column; gap: 10px; }
    .error-row { display: flex; align-items: center; gap: 12px; padding: 8px; border-radius: 6px; background: var(--sb-ui-color-grayscale-L400, #FAFAFA); }
    .err-left { flex: 1; display: flex; flex-direction: column; gap: 2px; }
    .err-code { font-size: 0.8rem; font-weight: 700; color: var(--sb-ui-color-feedback-error-base, #dc3545); }
    .err-msg { font-size: 0.75rem; color: var(--sb-ui-color-grayscale-D200, #5B5B5B); }
    .err-svc { font-size: 0.7rem; color: var(--sb-ui-color-grayscale-D200, #5B5B5B); font-style: italic; }
    .err-count { font-size: 1.1rem; font-weight: 700; color: var(--sb-ui-color-feedback-error-base, #dc3545); min-width: 40px; text-align: right; }

    .analysis-list { display: flex; flex-direction: column; gap: 16px; }
    .analysis-item { padding: 12px; border-radius: 8px; background: var(--sb-ui-color-grayscale-L400, #FAFAFA); border-left: 3px solid var(--sb-ui-color-grayscale-L200, #E1E1E1); }
    .analysis-header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; flex-wrap: wrap; }
    .analysis-code { font-weight: 700; font-size: 0.8rem; color: var(--sb-ui-color-grayscale-D400, #282828); }
    .severity-tag { font-size: 0.6rem; padding: 2px 6px; border-radius: 4px; font-weight: 700; }
    .sev-high { background: #FCE4EC; color: #C62828; }
    .sev-medium { background: #FFF8E1; color: #F57F17; }
    .sev-low { background: #E8F5E9; color: #2E7D32; }
    .affected { font-size: 0.7rem; color: var(--sb-ui-color-grayscale-D200, #5B5B5B); margin-left: auto; }
    .analysis-body p { margin: 4px 0; font-size: 0.78rem; line-height: 1.5; color: var(--sb-ui-color-grayscale-D200, #5B5B5B); }

    .flows-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 16px; }
    .flow-card { background: var(--sb-ui-color-grayscale-white, #fff); border-radius: 10px; padding: 16px; box-shadow: var(--sb-ui-shadow-m); border-left: 4px solid transparent; }
    .flow-header { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
    .flow-name { font-weight: 600; font-size: 0.875rem; flex: 1; color: var(--sb-ui-color-grayscale-D400, #282828); }

    .flow-avail { margin-bottom: 12px; }
    .avail-bar { height: 8px; background: var(--sb-ui-color-feedback-error-base, #dc3545); border-radius: 4px; overflow: hidden; }
    .avail-fill { height: 100%; background: var(--sb-ui-color-feedback-success-base, #28a745); border-radius: 4px; transition: width 0.5s ease; }
    .avail-labels { display: flex; justify-content: space-between; margin-top: 4px; font-size: 0.7rem; }
    .avail-up { color: var(--sb-ui-color-feedback-success-base, #28a745); }
    .avail-down { color: var(--sb-ui-color-feedback-error-base, #dc3545); }

    .flow-stats { display: grid; grid-template-columns: repeat(5, 1fr); gap: 4px; margin-bottom: 12px; }
    .fs { display: flex; flex-direction: column; align-items: center; padding: 6px 4px; border-radius: 6px; background: var(--sb-ui-color-grayscale-L400, #FAFAFA); }
    .fs-val { font-size: 0.85rem; font-weight: 700; color: var(--sb-ui-color-grayscale-D400, #282828); }
    .fs-lbl { font-size: 0.6rem; color: var(--sb-ui-color-grayscale-D200, #5B5B5B); text-align: center; }
    .fs.ok .fs-val { color: var(--sb-ui-color-feedback-success-base, #28a745); }
    .fs.fail .fs-val { color: var(--sb-ui-color-feedback-error-base, #dc3545); }

    .flow-rates { }
    .rate-bar { display: flex; height: 20px; border-radius: 4px; overflow: hidden; font-size: 0.65rem; font-weight: 700; }
    .rate-pass { background: var(--sb-ui-color-feedback-success-base, #28a745); color: #fff; display: flex; align-items: center; justify-content: center; }
    .rate-fail { background: var(--sb-ui-color-feedback-error-base, #dc3545); color: #fff; display: flex; align-items: center; justify-content: center; }

    .cnm-summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 20px; }

    .metric-card { background: var(--sb-ui-color-grayscale-white, #fff); border-radius: 12px; padding: 20px; display: flex; align-items: center; gap: 16px; box-shadow: var(--sb-ui-shadow-m); border: 1px solid var(--sb-ui-color-grayscale-L200, #E1E1E1); }
    .metric-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0; }
    .metric-info { display: flex; flex-direction: column; gap: 2px; }
    .metric-value { font-size: 1.3rem; font-weight: 700; color: var(--sb-ui-color-grayscale-D400, #282828); }
    .metric-label { font-size: 0.8rem; color: var(--sb-ui-color-grayscale-D200, #5B5B5B); }
    .cnm-icon { background: #E3F2FD; color: #1565C0; }
    .dot-bg-ok { background: #E8F5E9; color: #2E7D32; }
    .dot-bg-warn { background: #FFF8E1; color: #F57F17; }
    .dot-bg-alert { background: #FCE4EC; color: #C62828; }
    .npm-up { background: #E8F5E9; color: #2E7D32; }
    .npm-down { background: #FCE4EC; color: #C62828; }
    .npm-inc { background: #FFF8E1; color: #F57F17; }

    .zone-list, .conn-list { display: flex; flex-direction: column; gap: 10px; }
    .zone-row, .conn-row { display: flex; align-items: center; gap: 8px; padding: 8px; border-radius: 6px; background: var(--sb-ui-color-grayscale-L400, #FAFAFA); font-size: 0.8rem; }
    .zone-name, .conn-path { flex: 1; font-weight: 600; color: var(--sb-ui-color-grayscale-D400, #282828); }
    .zone-detail { color: var(--sb-ui-color-grayscale-D200, #5B5B5B); font-size: 0.75rem; }
    .zone-latency, .conn-latency { font-weight: 700; color: var(--sb-ui-color-grayscale-D400, #282828); }
    .conn-loss { font-size: 0.7rem; color: var(--sb-ui-color-grayscale-D200, #5B5B5B); }
    .loss-warn { color: var(--sb-ui-color-feedback-error-base, #dc3545) !important; font-weight: 700; }

    .cards-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 20px; }

    .npm-metrics { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
    .npm-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid var(--sb-ui-color-grayscale-L200, #E1E1E1); font-size: 0.825rem; }
    .npm-row span { color: var(--sb-ui-color-grayscale-D200, #5B5B5B); }
    .npm-row strong { color: var(--sb-ui-color-grayscale-D400, #282828); }

    .bar-chart { display: flex; align-items: flex-end; gap: 8px; height: 120px; padding-top: 20px; }
    .bar-chart.small-chart { height: 100px; }
    .bar-item { flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%; justify-content: flex-end; }
    .bar-fill { width: 100%; max-width: 48px; border-radius: 6px 6px 0 0; position: relative; min-height: 4px; transition: height 0.5s ease; }
    .bar-fill.npm-bar { background: linear-gradient(180deg, #7B1FA2 0%, #4A148C 100%); }
    .bar-value { position: absolute; top: -18px; left: 50%; transform: translateX(-50%); font-size: 0.65rem; font-weight: 600; color: var(--sb-ui-color-grayscale-D200, #5B5B5B); white-space: nowrap; }
    .bar-label { margin-top: 6px; font-size: 0.65rem; color: var(--sb-ui-color-grayscale-D200, #5B5B5B); }

    .throughput-list { display: flex; flex-direction: column; gap: 8px; }
    .tp-row { display: flex; align-items: center; gap: 8px; padding: 6px 8px; border-radius: 6px; background: var(--sb-ui-color-grayscale-L400, #FAFAFA); font-size: 0.78rem; }
    .tp-name { flex: 1; font-weight: 600; color: var(--sb-ui-color-grayscale-D400, #282828); }
    .tp-in { color: #1565C0; font-weight: 600; }
    .tp-out { color: #2E7D32; font-weight: 600; }

    .loading-state, .error-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 64px 0; gap: 12px; color: var(--sb-ui-color-grayscale-D200, #5B5B5B); }
    .error-state i { font-size: 2rem; color: var(--sb-ui-color-feedback-error-base, #dc3545); }
    .header-stats { display: flex; gap: 12px; }
    .stat-pill { padding: 6px 14px; border-radius: 20px; font-size: 0.8rem; display: flex; align-items: center; gap: 6px; }
    .pill-ok { background: rgba(40,167,69,0.2); color: #fff; }
    .pill-warn { background: rgba(255,193,0,0.3); color: #fff; }
    .pill-alert { background: rgba(220,53,69,0.3); color: #fff; }

    @media (max-width: 768px) {
      .two-col { grid-template-columns: 1fr; }
      .services-grid { grid-template-columns: 1fr; }
      .flows-grid { grid-template-columns: 1fr; }
      .tab-nav { flex-wrap: wrap; }
      .flow-stats { grid-template-columns: repeat(3, 1fr); }
    }
  `],
})
export class ObservabilityDashboardComponent implements OnInit {
  data: ObservabilityDashboard | null = null;
  loading = true;
  error = '';
  activeTab = 'apm';

  tabs = [
    { id: 'apm', label: 'APM', icon: 'fa-solid fa-gauge-high', badge: '', badgeColor: '' },
    { id: 'rum', label: 'RUM / Synthetic', icon: 'fa-solid fa-user-check', badge: '', badgeColor: '' },
    { id: 'cnm', label: 'CNM', icon: 'fa-solid fa-cloud', badge: '', badgeColor: '' },
    { id: 'npm', label: 'NPM', icon: 'fa-solid fa-network-wired', badge: '', badgeColor: '' },
  ];

  constructor(private obsService: ObservabilityService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.obsService.getDashboard().subscribe({
      next: (d) => {
        this.data = d;
        this.updateBadges();
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar las métricas. Intente nuevamente.';
        this.loading = false;
      },
    });
  }

  updateBadges(): void {
    if (!this.data) return;
    const alertSvcs = this.data.apm.services.filter(s => s.status === 'alert').length;
    const warnSvcs = this.data.apm.services.filter(s => s.status === 'warn').length;
    this.tabs[0].badge = alertSvcs > 0 ? `${alertSvcs}` : warnSvcs > 0 ? `${warnSvcs}` : '';
    this.tabs[0].badgeColor = alertSvcs > 0 ? 'red' : 'yellow';

    const alertFlows = this.data.rum.flows.filter(f => f.status === 'alert').length;
    this.tabs[1].badge = alertFlows > 0 ? `${alertFlows}` : '';
    this.tabs[1].badgeColor = 'red';
  }

  get overallHealth(): string {
    if (!this.data) return 'ok';
    const hasAlert = this.data.apm.services.some(s => s.status === 'alert') ||
                     this.data.rum.flows.some(f => f.status === 'alert');
    if (hasAlert) return 'alert';
    const hasWarn = this.data.apm.services.some(s => s.status === 'warn') ||
                    this.data.cnm.overallStatus === 'warn';
    if (hasWarn) return 'warn';
    return 'ok';
  }

  get maxLatency(): number {
    if (!this.data) return 1;
    return Math.max(...this.data.npm.latency.trend.map(t => t.value));
  }

  getBarPct(value: number, max: number): number {
    return max > 0 ? (value / max) * 85 : 0;
  }
}

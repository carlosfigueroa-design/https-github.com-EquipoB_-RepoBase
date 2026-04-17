import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LifecycleService } from '../../core/services/lifecycle.service';
import { ApiCatalogItem } from '../../core/models/api-catalog.model';

@Component({
  selector: 'app-api-create',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="create-container">
      <header class="create-header">
        <button class="sb-ui-button sb-ui-button--outline sb-ui-button--sm" (click)="cancel()">
          <i class="fa fa-arrow-left"></i> Volver
        </button>
        <h2>Crear nueva API</h2>
      </header>

      <!-- Step 1: Upload -->
      @if (!createdApi) {
        <div class="sb-ui-card upload-card">
          <div class="upload-hero">
            <div class="hero-icon">
              <i class="fa fa-robot"></i>
            </div>
            <h3>Agente IA de Documentación</h3>
            <p>Sube tu archivo OpenAPI (JSON) y nuestro agente de IA interpretará automáticamente
              la especificación para crear la documentación completa de tu API.</p>
          </div>

          <div class="upload-area"
               (dragover)="onDragOver($event)"
               (dragleave)="onDragLeave($event)"
               (drop)="onDrop($event)"
               [class.drag-over]="isDragOver"
               [class.processing]="processing">
            @if (processing) {
              <div class="processing-state">
                <div class="sb-ui-spinner"></div>
                <p class="processing-text">{{ processingStep }}</p>
              </div>
            } @else {
              <i class="fa fa-cloud-arrow-up upload-icon"></i>
              <p class="upload-text">Arrastra tu archivo JSON aquí</p>
              <span class="upload-or">o</span>
              <label class="sb-ui-button sb-ui-button--sm upload-btn">
                <i class="fa fa-folder-open"></i> Seleccionar archivo
                <input type="file" accept=".json" (change)="onFileSelected($event)" hidden />
              </label>
              <p class="upload-formats">Formatos soportados: OpenAPI 3.0 / Swagger 2.0 (.json)</p>
            }
          </div>

          @if (parseError) {
            <div class="error-message"><i class="fa fa-exclamation-triangle"></i> {{ parseError }}</div>
          }
        </div>
      }

      <!-- Step 2: AI Results -->
      @if (createdApi) {
        <div class="sb-ui-card result-card">
          <div class="result-header">
            <div class="result-icon success">
              <i class="fa fa-check"></i>
            </div>
            <div>
              <h3>API creada exitosamente</h3>
              <p>El agente IA interpretó tu especificación y generó la documentación.</p>
            </div>
          </div>

          <div class="result-details">
            <div class="detail-row">
              <span class="detail-label">Nombre</span>
              <span class="detail-value">{{ createdApi.name }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Categoría</span>
              <span class="detail-value">
                <i class="fa {{ createdApi.icon }}"></i> {{ createdApi.category }}
              </span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Versión</span>
              <span class="detail-value">{{ createdApi.version }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Estado</span>
              <span class="sb-ui-badge sb-ui-badge--muted">{{ createdApi.status }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Descripción</span>
              <span class="detail-value desc">{{ createdApi.description }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Equipo</span>
              <span class="detail-value">{{ createdApi.contactTeam.teamName }} ({{ createdApi.contactTeam.area }})</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Casos de uso</span>
              <div class="use-cases">
                @for (uc of createdApi.useCases; track $index) {
                  <span class="use-case-chip">{{ uc }}</span>
                }
              </div>
            </div>
          </div>

          @if (aiAnalysis) {
            <div class="ai-analysis">
              <h4><i class="fa fa-brain"></i> Análisis del Agente IA</h4>
              <div class="analysis-grid">
                <div class="analysis-item">
                  <span class="analysis-number">{{ aiAnalysis['endpointsDetected'] }}</span>
                  <span class="analysis-label">Endpoints</span>
                </div>
                <div class="analysis-item">
                  <span class="analysis-number">{{ (aiAnalysis['methodsDetected'] as string[])?.length || 0 }}</span>
                  <span class="analysis-label">Métodos HTTP</span>
                </div>
                <div class="analysis-item">
                  <span class="analysis-number">{{ (aiAnalysis['tagsDetected'] as string[])?.length || 0 }}</span>
                  <span class="analysis-label">Tags</span>
                </div>
                <div class="analysis-item">
                  <span class="analysis-number">{{ (aiAnalysis['serversDetected'] as string[])?.length || 0 }}</span>
                  <span class="analysis-label">Servidores</span>
                </div>
              </div>
              <div class="analysis-details">
                <span class="analysis-tag">Categoría: {{ aiAnalysis['categoryInferred'] }}</span>
                <span class="analysis-tag">Área: {{ aiAnalysis['areaInferred'] }}</span>
                @for (method of (aiAnalysis['methodsDetected'] as string[]) || []; track method) {
                  <span class="analysis-tag method">{{ method }}</span>
                }
              </div>
            </div>
          }

          <div class="result-actions">
            <button class="sb-ui-button sb-ui-button--outline" (click)="createAnother()">
              <i class="fa fa-plus"></i> Crear otra API
            </button>
            <button class="sb-ui-button" (click)="goToAdmin()">
              <i class="fa fa-cogs"></i> Ir a Administración
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block }
    .create-container { max-width: 700px; margin: 0 auto; padding: var(--sb-ui-spacing-lg, 24px) }
    .create-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px }
    .create-header h2 { margin: 0; color: var(--sb-ui-text-primary, #1a1a2e) }

    .upload-card { text-align: center }
    .upload-hero { margin-bottom: 24px }
    .hero-icon { width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg, var(--sb-ui-color-primary, #007A3D), var(--sb-ui-color-primary-light, #009648)); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin: 0 auto 16px }
    .upload-hero h3 { margin: 0 0 8px; color: var(--sb-ui-text-primary, #1a1a2e); font-size: 1.3rem }
    .upload-hero p { margin: 0; color: var(--sb-ui-text-secondary, #6c757d); font-size: var(--sb-ui-font-size-sm, .875rem); max-width: 500px; margin: 0 auto; line-height: 1.6 }

    .upload-area { border: 2px dashed var(--sb-ui-border-color, #dee2e6); border-radius: 12px; padding: 40px 32px; transition: all 0.2s; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 8px }
    .upload-area.drag-over { border-color: var(--sb-ui-color-primary, #007A3D); background: var(--sb-ui-bg-primary, #f4faf6) }
    .upload-area.processing { border-color: var(--sb-ui-color-primary, #007A3D); background: var(--sb-ui-bg-primary, #f4faf6); cursor: default }
    .upload-icon { font-size: 2.5rem; color: var(--sb-ui-color-primary, #007A3D); opacity: 0.6 }
    .upload-text { color: var(--sb-ui-text-secondary, #6c757d); margin: 0; font-size: 1rem }
    .upload-or { color: var(--sb-ui-text-muted, #adb5bd); font-size: var(--sb-ui-font-size-sm, .875rem) }
    .upload-btn { cursor: pointer }
    .upload-formats { color: var(--sb-ui-text-muted, #adb5bd); font-size: var(--sb-ui-font-size-xs, .75rem); margin: 8px 0 0 }

    .processing-state { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 20px 0 }
    .processing-text { color: var(--sb-ui-color-primary, #007A3D); font-weight: 600; font-size: var(--sb-ui-font-size-sm, .875rem); margin: 0 }

    .error-message { margin-top: 16px; padding: 10px 14px; border-radius: 4px; background: rgba(220, 53, 69, .1); color: var(--sb-ui-color-danger, #dc3545); font-size: var(--sb-ui-font-size-sm, .875rem); display: flex; align-items: center; gap: 6px; text-align: left }

    .result-card { }
    .result-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid var(--sb-ui-border-color, #dee2e6) }
    .result-icon { width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0 }
    .result-icon.success { background: rgba(0, 122, 61, .1); color: var(--sb-ui-color-primary, #007A3D) }
    .result-header h3 { margin: 0 0 4px; color: var(--sb-ui-text-primary, #1a1a2e) }
    .result-header p { margin: 0; color: var(--sb-ui-text-secondary, #6c757d); font-size: var(--sb-ui-font-size-sm, .875rem) }

    .result-details { display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px }
    .detail-row { display: flex; gap: 12px; font-size: var(--sb-ui-font-size-sm, .875rem) }
    .detail-label { font-weight: 600; color: var(--sb-ui-text-secondary, #6c757d); min-width: 110px; flex-shrink: 0 }
    .detail-value { color: var(--sb-ui-text-primary, #1a1a2e) }
    .detail-value.desc { line-height: 1.5 }
    .use-cases { display: flex; flex-wrap: wrap; gap: 6px }
    .use-case-chip { padding: 4px 10px; border-radius: 12px; background: var(--sb-ui-bg-primary, #f4faf6); border: 1px solid var(--sb-ui-border-color, #dee2e6); font-size: var(--sb-ui-font-size-xs, .75rem); color: var(--sb-ui-text-primary, #1a1a2e) }

    .ai-analysis { background: var(--sb-ui-bg-primary, #f4faf6); border-radius: 8px; padding: 16px; margin-bottom: 24px; border: 1px solid var(--sb-ui-border-color, #dee2e6) }
    .ai-analysis h4 { margin: 0 0 12px; font-size: var(--sb-ui-font-size-sm, .875rem); color: var(--sb-ui-color-primary, #007A3D); display: flex; align-items: center; gap: 6px }
    .analysis-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 12px }
    .analysis-item { text-align: center; padding: 8px; background: var(--sb-ui-color-grayscale-white, #fff); border-radius: 8px }
    .analysis-number { display: block; font-size: 1.3rem; font-weight: 700; color: var(--sb-ui-color-primary, #007A3D) }
    .analysis-label { font-size: var(--sb-ui-font-size-xs, .75rem); color: var(--sb-ui-text-secondary, #6c757d) }
    .analysis-details { display: flex; flex-wrap: wrap; gap: 6px }
    .analysis-tag { padding: 3px 8px; border-radius: 4px; background: var(--sb-ui-color-grayscale-white, #fff); font-size: var(--sb-ui-font-size-xs, .75rem); color: var(--sb-ui-text-secondary, #6c757d); border: 1px solid var(--sb-ui-border-color, #dee2e6) }
    .analysis-tag.method { color: var(--sb-ui-color-primary, #007A3D); font-weight: 600 }

    .result-actions { display: flex; justify-content: flex-end; gap: 12px }

    @media (max-width: 576px) { .analysis-grid { grid-template-columns: repeat(2, 1fr) } .detail-row { flex-direction: column; gap: 2px } }
  `]
})
export class ApiCreateComponent {
  processing = false;
  processingStep = '';
  parseError = '';
  isDragOver = false;
  createdApi: ApiCatalogItem | null = null;
  aiAnalysis: Record<string, unknown> | null = null;

  constructor(
    private lifecycleService: LifecycleService,
    private router: Router,
  ) {}

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    const file = event.dataTransfer?.files[0];
    if (file) this.processFile(file);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.processFile(file);
  }

  private processFile(file: File): void {
    this.parseError = '';
    this.processing = true;
    this.processingStep = 'Leyendo archivo...';

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const spec = JSON.parse(reader.result as string);
        this.sendToAI(spec);
      } catch {
        this.processing = false;
        this.parseError = 'El archivo no es un JSON válido. Verifica el formato e intenta nuevamente.';
      }
    };
    reader.onerror = () => {
      this.processing = false;
      this.parseError = 'Error al leer el archivo.';
    };
    reader.readAsText(file);
  }

  private sendToAI(spec: unknown): void {
    this.processingStep = 'Agente IA analizando especificación...';

    setTimeout(() => {
      this.processingStep = 'Interpretando endpoints y esquemas...';
    }, 600);

    setTimeout(() => {
      this.processingStep = 'Generando documentación y metadatos...';
    }, 1200);

    this.lifecycleService.createApiFromSpec(spec).subscribe({
      next: (result) => {
        this.processing = false;
        this.createdApi = result;
        this.aiAnalysis = result.aiAnalysis || null;
      },
      error: () => {
        this.processing = false;
        this.parseError = 'Error al procesar la especificación. Verifica que sea un OpenAPI válido.';
      },
    });
  }

  createAnother(): void {
    this.createdApi = null;
    this.aiAnalysis = null;
    this.parseError = '';
  }

  goToAdmin(): void {
    this.router.navigate(['/admin']);
  }

  cancel(): void {
    this.router.navigate(['/admin']);
  }
}

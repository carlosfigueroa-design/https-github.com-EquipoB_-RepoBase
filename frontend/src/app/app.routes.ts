import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'catalog', pathMatch: 'full' },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login.component').then((m) => m.LoginComponent),
      },
      {
        path: 'otp-verify',
        loadComponent: () =>
          import('./features/auth/otp-verify.component').then((m) => m.OtpVerifyComponent),
      },
    ],
  },
  {
    path: 'catalog',
    loadComponent: () =>
      import('./features/public-catalog/catalog-list.component').then((m) => m.CatalogListComponent),
  },
  {
    path: 'catalog/:id',
    loadComponent: () =>
      import('./features/public-catalog/catalog-detail.component').then((m) => m.CatalogDetailComponent),
  },
  {
    path: 'swagger/:id',
    loadComponent: () =>
      import('./features/swagger-viewer/swagger-viewer.component').then((m) => m.SwaggerViewerComponent),
  },
  {
    path: 'sandbox',
    loadComponent: () =>
      import('./features/sandbox/sandbox.component').then((m) => m.SandboxComponent),
  },
  {
    path: 'ai',
    loadComponent: () =>
      import('./features/ai-assistant/ai-chat.component').then((m) => m.AiChatComponent),
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/api-management/api-lifecycle.component').then((m) => m.ApiLifecycleComponent),
  },
  {
    path: 'admin/create',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/api-management/api-create.component').then((m) => m.ApiCreateComponent),
  },
  {
    path: 'admin/analytics',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/analytics/analytics-dashboard.component').then((m) => m.AnalyticsDashboardComponent),
  },
  {
    path: 'admin/observability',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/observability/observability-dashboard.component').then((m) => m.ObservabilityDashboardComponent),
  },
  { path: '**', redirectTo: 'catalog' },
];

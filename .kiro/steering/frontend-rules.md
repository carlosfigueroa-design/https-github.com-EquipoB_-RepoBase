---
inclusion: fileMatch
fileMatchPattern: ['frontend/**/*.ts', 'frontend/**/*.html', 'frontend/**/*.scss', 'frontend/**/*.css', 'frontend/**/*.json']
---

# Frontend Rules — MVP-ECM (Angular Standalone + PrimeNG)

## Architecture Overview

- Angular standalone components (no NgModules)
- All routes use `loadComponent` with lazy loading via `app.routes.ts`
- `PreloadAllModules` strategy for background preloading
- Hash-based routing (`withHashLocation()`)
- Backend communication through ESPv2 API Gateway (production) or local proxy (development)
- Firebase Authentication for user identity; `authInterceptor` attaches tokens automatically

## Project Structure

```
frontend/src/app/
├── core/                  # Singletons: services, guards, interceptors, models, config
│   ├── config/            # microservices.config.ts (centralized API URLs)
│   ├── guards/            # auth.guard.ts (CanActivateFn)
│   ├── interceptors/      # auth.interceptor.ts (HttpInterceptorFn)
│   ├── models/            # document.model.ts, user.model.ts, search.model.ts
│   └── services/          # All injectable services (one per domain)
├── features/              # Route-level components grouped by domain
│   ├── admin/             # Admin screens (users, permissions, storage, audit, etc.)
│   ├── approvals/
│   ├── auth/              # login, unauthorized
│   ├── dashboard/
│   ├── packages/
│   └── shared-access/
├── shared/                # Reusable UI components and shared styles
│   ├── components/        # document-list, file-upload, search, dialogs, etc.
│   └── styles/            # admin-layout.scss
├── app.component.ts       # Root shell (just <router-outlet>)
├── app.config.ts          # Providers: router, httpClient, animations, MessageService
└── app.routes.ts          # All routes with lazy loadComponent + authGuard
```

When creating new code, place it according to this structure:
- New services → `core/services/`
- New models/interfaces → `core/models/`
- New route-level screens → `features/<domain>/`
- Reusable components → `shared/components/`

## Critical Rule: HttpClient Configuration

`provideHttpClient(withInterceptors([authInterceptor]))` is configured in `app.config.ts`. This is the single source of `HttpClient` for the entire app.

NEVER import `HttpClientModule` in any component's `imports` array. Doing so creates a separate `HttpClient` instance that bypasses the auth interceptor, causing 401 errors on protected endpoints.

```typescript
// ✅ Correct — inject HttpClient directly
@Component({ standalone: true, imports: [CommonModule] })
export class MyComponent {
  constructor(private http: HttpClient) {}
}

// ❌ Wrong — creates a separate HttpClient without interceptors
@Component({ standalone: true, imports: [HttpClientModule] })
```

## Design System: @seguros-bolivar/ui-bundle

The `@seguros-bolivar/ui-bundle` library is the primary design system. It is loaded globally via `angular.json` (CSS as first stylesheet, JS in scripts). The HTML root has `data-brand="seguros-bolivar"` and `data-theme="light"`.

### Token Priority

1. Use `--sb-ui-*` CSS custom properties from the bundle (always with fallback values)
2. If the bundle lacks a component, use PrimeNG components styled through `theme-bolivar.scss`
3. Never hardcode hex/rgba values directly in component styles

### Key Tokens

| Token | Fallback | Purpose |
|-------|----------|---------|
| `--sb-ui-color-primary-base` | `#009056` | Primary green (buttons, links, header) |
| `--sb-ui-color-primary-D200` | `#05794A` | Hover states |
| `--sb-ui-color-primary-L300` | `#E5F4EE` | Light backgrounds |
| `--sb-ui-color-secondary-base` | `#FFE16F` | CTA buttons, accents |
| `--sb-ui-color-feedback-error-base` | `#dc3545` | Errors |
| `--sb-ui-color-feedback-warning-base` | `#ffc100` | Warnings |
| `--sb-ui-color-feedback-success-base` | `#28a745` | Success |
| `--sb-ui-color-feedback-info-base` | `#007eff` | Info |
| `--sb-ui-color-grayscale-D400` | `#282828` | Primary text |
| `--sb-ui-color-grayscale-D200` | `#5B5B5B` | Secondary text |
| `--sb-ui-color-grayscale-L200` | `#E1E1E1` | Borders, dividers |
| `--sb-ui-color-grayscale-L400` | `#FAFAFA` | Section backgrounds |
| `--sb-ui-color-grayscale-white` | `#FFFFFF` | Card/modal backgrounds |
| `--sb-ui-shadow-m` | Shadow M | Cards, header elevation |
| `--sb-ui-typography-fontFamily` | Bolivar, Roboto | Global font |
| `--sb-ui-gradient-primary-base` | Green gradient | Accent borders |

### Styling Example

```scss
// ✅ Correct
.my-component {
  background: var(--sb-ui-color-grayscale-white, #ffffff);
  color: var(--sb-ui-color-grayscale-D400, #282828);
  box-shadow: var(--sb-ui-shadow-m);
  border: 1px solid var(--sb-ui-color-grayscale-L200, #E1E1E1);
}

// ❌ Wrong — hardcoded values
.my-component {
  background: #ffffff;
  color: #282828;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
```

### Bundle Components

- CSS classes: `sb-ui-button`, `sb-ui-card`, `sb-ui-input`, `sb-ui-alert`, `sb-ui-badge`, `sb-ui-table`, `sb-ui-accordion`, `sb-ui-avatar`, `sb-ui-checkbox`, `sb-ui-chip`, `sb-ui-file-upload`, `sb-ui-menu`, `sb-ui-radio`, `sb-ui-select`, `sb-ui-spinner`, `sb-ui-tabs`, `sb-ui-tag`, `sb-ui-textarea`, `sb-ui-toggle`
- Web Components (prefer over PrimeNG for new code): `<sb-ui-datepicker>`, `<sb-ui-modal>`, `<sb-ui-dropdown>`, `<sb-ui-toast>`, `<sb-ui-stepper>`
- Grid: `sb-ui-grid`, `sb-ui-col-*`, `sb-ui-container`
- Icons: Font Awesome 6 (from bundle) + PrimeIcons

### PrimeNG Usage

PrimeNG is used for complex components not covered by the bundle: `p-table`, `p-dialog`, `p-overlayPanel`, `p-panelMenu`, `p-confirmDialog`, `p-chart`, `p-skeleton`, `p-fileUpload`, `p-progressBar`, `p-calendar`, `p-checkbox`, `p-radioButton`, `p-toast`, `p-dropdown`, `p-button`. PrimeNG styles are bridged to bundle tokens via `theme-bolivar.scss`.

## Admin Screen Layout

All admin screens must use the shared layout from `shared/styles/admin-layout.scss`. Import it in the component's `styleUrls`.

Required HTML structure:

```html
<div class="admin-container">
  <header class="admin-header">
    <div class="header-content">
      <div class="header-left"><!-- Title, back button --></div>
      <!-- Optional: .header-stats -->
    </div>
  </header>
  <main class="admin-content">
    <!-- Page content -->
  </main>
</div>
```

Constraints:
- Never apply `overflow: hidden` on `.admin-container` or `.admin-content` (breaks PrimeNG dialogs/overlays)
- Header background is `--sb-ui-color-primary-base` (#009056) — do not change without approval
- Content max-width: 1400px, centered with auto margins
- Do not use Tailwind, Material, or Bootstrap color utilities

## Accessibility

Minimum contrast ratios: 4.5:1 for normal text, 3:1 for large text/UI elements.

Approved text/background combinations:
- `#282828` on white/light gray → AAA
- `#FFFFFF` on `#009056` → AA (headers, buttons)
- `#05794A` on white/light gray → AA (links, emphasis)

Avoid: `#E5F4EE` as text color, light grays on light backgrounds, `#009056` on dark backgrounds.

## Component Conventions

- All components are `standalone: true`
- Use `@defer` for heavy child components (lazy rendering)
- Use `loadComponent` in routes for code splitting (already established pattern)
- Inject services via constructor; do not use `inject()` function unless in functional guards/interceptors
- Use `MessageService` from PrimeNG for toast notifications (provided globally in `app.config.ts`)

## API Communication

All API URLs are centralized in `core/config/microservices.config.ts`. Services should use `buildUrl(service, endpoint)` or reference `MicroservicesConfig` to construct URLs.

- Development: requests go to `http://localhost:4200/api/v1` (Angular proxy forwards to backend)
- Production: requests go through ESPv2 at `https://api-gateway-mvp-ecm-deksoshnka-uc.a.run.app/api/v1`

When adding new endpoints, update `MicroservicesConfig` in the appropriate service block.

## CSS Conventions

- Border radius: `50px` for buttons (pill shape), `16px` for main cards, `8px` for minor cards
- Transitions: `transition: all 0.2s ease` as default; never exceed 300ms
- Z-index scale: dropdown(100), sticky(200), modal(300), toast(400), tooltip(500)
- Spacing base unit: 4px (all spacing values are multiples of 4 or 8)
- Mobile-first responsive design using breakpoints: 576px, 768px, 1024px, 1366px

## Prohibited Patterns

- Importing `HttpClientModule` in component `imports`
- Hardcoding color/shadow/font values instead of using `--sb-ui-*` tokens
- Using `overflow: hidden` on admin layout containers
- Using colors from Tailwind, Material, or Bootstrap
- Creating NgModules (use standalone components only)
- Running `gcloud` or `firebase` deploy commands directly (use project scripts)

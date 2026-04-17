import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="app-sidebar">
      <ul class="sidebar-nav">
        <li>
          <a routerLink="/catalog" routerLinkActive="active" class="nav-link">
            <i class="fa-solid fa-book"></i>
            <span>Catálogo</span>
          </a>
        </li>
        <li>
          <a routerLink="/sandbox" routerLinkActive="active" class="nav-link">
            <i class="fa-solid fa-flask"></i>
            <span>Sandbox</span>
          </a>
        </li>
        <li>
          <a routerLink="/ai" routerLinkActive="active" class="nav-link">
            <i class="fa-solid fa-robot"></i>
            <span>Asistente IA</span>
          </a>
        </li>
        <ng-container *ngIf="isAdmin">
          <div class="nav-separator"></div>
          <li>
            <a routerLink="/admin" routerLinkActive="active" class="nav-link">
              <i class="fa-solid fa-cog"></i>
              <span>Administración</span>
            </a>
          </li>
          <li>
            <a routerLink="/admin/analytics" routerLinkActive="active" class="nav-link">
              <i class="fa-solid fa-chart-line"></i>
              <span>Analítica</span>
            </a>
          </li>
          <li>
            <a routerLink="/admin/observability" routerLinkActive="active" class="nav-link">
              <i class="fa-solid fa-satellite-dish"></i>
              <span>Observabilidad</span>
            </a>
          </li>
        </ng-container>
      </ul>

      <div class="sidebar-footer">
        <span class="sidebar-version">Vínculo Bolívar v1.0</span>
      </div>
    </nav>
  `,
  styles: [`
    .app-sidebar {
      width: 230px;
      min-height: 100%;
      background: linear-gradient(180deg, var(--sb-ui-bg-sidebar, #005a2b) 0%, #004420 100%);
      padding: var(--sb-ui-spacing-md, 16px) 0;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .sidebar-nav {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px var(--sb-ui-spacing-lg, 24px);
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      font-size: var(--sb-ui-font-size-sm, 0.875rem);
      font-weight: 500;
      transition: all 0.2s ease;
      border-left: 3px solid transparent;
      position: relative;
    }

    .nav-link:hover {
      background-color: rgba(255, 255, 255, 0.08);
      color: var(--sb-ui-text-light, #FFFFFF);
      text-decoration: none;
    }

    .nav-link.active {
      background-color: rgba(255, 255, 255, 0.12);
      color: var(--sb-ui-text-light, #FFFFFF);
      border-left-color: var(--sb-ui-color-secondary, #F5A800);
      font-weight: 600;
    }

    .nav-link i {
      width: 20px;
      text-align: center;
      font-size: 0.9rem;
    }

    .nav-separator {
      height: 1px;
      background-color: rgba(255, 255, 255, 0.1);
      margin: 8px var(--sb-ui-spacing-lg, 24px);
    }

    .sidebar-footer {
      padding: 12px var(--sb-ui-spacing-lg, 24px);
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }

    .sidebar-version {
      font-size: 0.7rem;
      color: rgba(255, 255, 255, 0.35);
      letter-spacing: 0.3px;
    }
  `],
})
export class SidebarComponent {
  constructor(public authService: AuthService) {}

  get isAdmin(): boolean {
    return this.authService.getProfile()?.role === 'Admin';
  }
}

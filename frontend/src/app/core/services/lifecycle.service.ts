import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { ApiCatalogItem } from '../models/api-catalog.model';

export interface CreateApiPayload {
  name: string;
  category: string;
  description: string;
  descriptionSummary: string;
  useCases: string[];
  contactTeam: { teamName: string; email: string; area: string };
  icon: string;
}

export interface AuditEntry {
  id: string;
  apiId: string;
  userId: string;
  action: string;
  previousStatus: string;
  newStatus: string;
  timestamp: string;
}

@Injectable({ providedIn: 'root' })
export class LifecycleService {
  constructor(private http: HttpClient) {}

  getAllApis(): Observable<ApiCatalogItem[]> {
    return this.http.get<ApiCatalogItem[]>(API_CONFIG.lifecycle.list);
  }

  createApi(data: CreateApiPayload): Observable<ApiCatalogItem> {
    return this.http.post<ApiCatalogItem>(API_CONFIG.lifecycle.create, data);
  }

  createApiFromSpec(spec: unknown): Observable<ApiCatalogItem & { aiAnalysis: Record<string, unknown> }> {
    return this.http.post<ApiCatalogItem & { aiAnalysis: Record<string, unknown> }>(
      `${API_CONFIG.lifecycle.create}/from-spec`, spec
    );
  }

  changeStatus(apiId: string, newStatus: string): Observable<ApiCatalogItem> {
    return this.http.patch<ApiCatalogItem>(API_CONFIG.lifecycle.changeStatus(apiId), { newStatus });
  }

  getAuditLog(apiId: string): Observable<AuditEntry[]> {
    return this.http.get<AuditEntry[]>(API_CONFIG.lifecycle.audit(apiId));
  }
}

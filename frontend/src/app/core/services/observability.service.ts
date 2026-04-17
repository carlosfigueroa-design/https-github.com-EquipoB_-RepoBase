import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { ObservabilityDashboard } from '../models/observability.model';

@Injectable({ providedIn: 'root' })
export class ObservabilityService {
  constructor(private http: HttpClient) {}

  getDashboard(): Observable<ObservabilityDashboard> {
    return this.http.get<ObservabilityDashboard>(API_CONFIG.observability.dashboard);
  }
}

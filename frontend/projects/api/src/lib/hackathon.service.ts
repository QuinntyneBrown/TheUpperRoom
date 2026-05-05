import { HttpClient } from '@angular/common/http';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export interface CreateHackathonRequest {
  title: string;
  startDate: string;
  endDate: string;
  hostCity: string;
  partnerIds: string[];
}

export interface CreateHackathonResponse {
  id: string;
}

export interface IHackathonService {
  create(req: CreateHackathonRequest): Observable<CreateHackathonResponse>;
}

export const HACKATHON_SERVICE = new InjectionToken<IHackathonService>('HACKATHON_SERVICE');

@Injectable({ providedIn: 'root' })
export class HackathonService implements IHackathonService {
  private http = inject(HttpClient);

  create(req: CreateHackathonRequest): Observable<CreateHackathonResponse> {
    return this.http.post<CreateHackathonResponse>('/api/hackathons', req);
  }
}

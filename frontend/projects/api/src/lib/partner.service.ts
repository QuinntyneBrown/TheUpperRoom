import { HttpClient } from '@angular/common/http';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export type PartnerStage = 'Lead' | 'InFunnel' | 'Confirmed';

export interface CreatePartnerRequest {
  name: string;
  city: string;
  website?: string;
  stage?: PartnerStage;
  description?: string;
}

export interface CreatePartnerResponse {
  id: string;
}

export interface IPartnerService {
  create(req: CreatePartnerRequest): Observable<CreatePartnerResponse>;
}

export const PARTNER_SERVICE = new InjectionToken<IPartnerService>('PARTNER_SERVICE');

@Injectable({ providedIn: 'root' })
export class PartnerService implements IPartnerService {
  private http = inject(HttpClient);

  create(req: CreatePartnerRequest): Observable<CreatePartnerResponse> {
    return this.http.post<CreatePartnerResponse>('/api/partners', req);
  }
}

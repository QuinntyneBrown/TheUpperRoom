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

export interface PartnerStageHistoryDto {
  id: string;
  fromStage: string;
  toStage: string;
  changedById: string;
  changedAt: string;
}

export interface PartnerDetailDto {
  id: string;
  teamId: string;
  name: string;
  website?: string;
  city: string;
  stage: PartnerStage;
  description?: string;
  version: number;
  history: PartnerStageHistoryDto[];
}

export interface IPartnerService {
  create(req: CreatePartnerRequest): Observable<CreatePartnerResponse>;
  getById(id: string): Observable<PartnerDetailDto>;
  changeStage(id: string, toStage: PartnerStage): Observable<void>;
}

export const PARTNER_SERVICE = new InjectionToken<IPartnerService>('PARTNER_SERVICE');

@Injectable({ providedIn: 'root' })
export class PartnerService implements IPartnerService {
  private http = inject(HttpClient);

  create(req: CreatePartnerRequest): Observable<CreatePartnerResponse> {
    return this.http.post<CreatePartnerResponse>('/api/partners', req);
  }

  getById(id: string): Observable<PartnerDetailDto> {
    return this.http.get<PartnerDetailDto>(`/api/partners/${id}`);
  }

  changeStage(id: string, toStage: PartnerStage): Observable<void> {
    return this.http.post<void>(`/api/partners/${id}/stage`, { toStage });
  }
}

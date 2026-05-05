import { HttpClient } from '@angular/common/http';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export type HackathonStage = 'Discover' | 'Define' | 'Design' | 'Develop' | 'Launch';

export interface HackathonStageHistoryDto {
  id: string;
  fromStage: string;
  toStage: string;
  changedById: string;
  changedAt: string;
}

export interface ProductMemberDto {
  id: string;
  userId?: string;
  contactId?: string;
}

export interface ProductDto {
  id: string;
  name: string;
  description?: string;
  repoUrl?: string;
  demoUrl?: string;
  members: ProductMemberDto[];
}

export interface HackathonDetailDto {
  id: string;
  teamId: string;
  title: string;
  startDate: string;
  endDate: string;
  hostCity: string;
  stage: HackathonStage;
  version: number;
  history: HackathonStageHistoryDto[];
  products: ProductDto[];
}

export interface AddProductRequest {
  name: string;
  description?: string;
  repoUrl?: string;
  demoUrl?: string;
  memberUserIds: string[];
  memberContactIds: string[];
}

export interface AddProductResponse {
  id: string;
}

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
  getById(id: string): Observable<HackathonDetailDto>;
  changeStage(id: string, toStage: HackathonStage): Observable<void>;
  addProduct(hackathonId: string, req: AddProductRequest): Observable<AddProductResponse>;
}

export const HACKATHON_SERVICE = new InjectionToken<IHackathonService>('HACKATHON_SERVICE');

@Injectable({ providedIn: 'root' })
export class HackathonService implements IHackathonService {
  private http = inject(HttpClient);

  create(req: CreateHackathonRequest): Observable<CreateHackathonResponse> {
    return this.http.post<CreateHackathonResponse>('/api/hackathons', req);
  }

  getById(id: string): Observable<HackathonDetailDto> {
    return this.http.get<HackathonDetailDto>(`/api/hackathons/${id}`);
  }

  changeStage(id: string, toStage: HackathonStage): Observable<void> {
    return this.http.post<void>(`/api/hackathons/${id}/stage`, { toStage });
  }

  addProduct(hackathonId: string, req: AddProductRequest): Observable<AddProductResponse> {
    return this.http.post<AddProductResponse>(`/api/hackathons/${hackathonId}/products`, req);
  }
}

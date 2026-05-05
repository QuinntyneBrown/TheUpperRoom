import { HttpClient } from '@angular/common/http';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { NoteDto } from './contact.service';

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

export interface PartnerContactDto {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
}

export interface UpdatePartnerRequest {
  name: string;
  city: string;
  website?: string;
  description?: string;
  version: number;
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
  contacts: PartnerContactDto[];
  notes: NoteDto[];
}

export interface CreateContactForPartnerRequest {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
}

export interface CreateContactForPartnerResponse {
  contactId: string;
}

export interface IPartnerService {
  create(req: CreatePartnerRequest): Observable<CreatePartnerResponse>;
  getById(id: string): Observable<PartnerDetailDto>;
  changeStage(id: string, toStage: PartnerStage): Observable<void>;
  update(id: string, req: UpdatePartnerRequest): Observable<void>;
  delete(id: string): Observable<void>;
  addContact(partnerId: string, contactId: string): Observable<void>;
  removeContact(partnerId: string, contactId: string): Observable<void>;
  createAndLinkContact(partnerId: string, req: CreateContactForPartnerRequest): Observable<CreateContactForPartnerResponse>;
  addNote(partnerId: string, body: string): Observable<NoteDto>;
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

  update(id: string, req: UpdatePartnerRequest): Observable<void> {
    return this.http.put<void>(`/api/partners/${id}`, req);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`/api/partners/${id}`);
  }

  addContact(partnerId: string, contactId: string): Observable<void> {
    return this.http.post<void>(`/api/partners/${partnerId}/contacts`, { contactId });
  }

  removeContact(partnerId: string, contactId: string): Observable<void> {
    return this.http.delete<void>(`/api/partners/${partnerId}/contacts/${contactId}`);
  }

  createAndLinkContact(partnerId: string, req: CreateContactForPartnerRequest): Observable<CreateContactForPartnerResponse> {
    return this.http.post<CreateContactForPartnerResponse>(`/api/partners/${partnerId}/contacts/new`, req);
  }

  addNote(partnerId: string, body: string): Observable<NoteDto> {
    return this.http.post<NoteDto>(`/api/partners/${partnerId}/notes`, { body });
  }
}

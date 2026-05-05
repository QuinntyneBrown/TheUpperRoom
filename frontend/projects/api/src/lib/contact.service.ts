import { HttpClient } from '@angular/common/http';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export interface CreateContactRequest {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  city?: string;
  notes?: string;
}

export interface CreateContactResponse {
  id: string;
}

export interface NoteDto {
  id: string;
  body: string;
  authorId: string;
  createdAt: string;
}

export interface ContactDto {
  id: string;
  teamId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  city?: string;
  notes: NoteDto[];
}

export interface IContactService {
  create(req: CreateContactRequest): Observable<CreateContactResponse>;
  getById(id: string): Observable<ContactDto>;
}

export const CONTACT_SERVICE = new InjectionToken<IContactService>('CONTACT_SERVICE');

@Injectable({ providedIn: 'root' })
export class ContactService implements IContactService {
  private http = inject(HttpClient);

  create(req: CreateContactRequest): Observable<CreateContactResponse> {
    return this.http.post<CreateContactResponse>('/api/contacts', req);
  }

  getById(id: string): Observable<ContactDto> {
    return this.http.get<ContactDto>(`/api/contacts/${id}`);
  }
}

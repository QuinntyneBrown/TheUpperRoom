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

export interface IContactService {
  create(req: CreateContactRequest): Observable<CreateContactResponse>;
}

export const CONTACT_SERVICE = new InjectionToken<IContactService>('CONTACT_SERVICE');

@Injectable({ providedIn: 'root' })
export class ContactService implements IContactService {
  private http = inject(HttpClient);

  create(req: CreateContactRequest): Observable<CreateContactResponse> {
    return this.http.post<CreateContactResponse>('/api/contacts', req);
  }
}

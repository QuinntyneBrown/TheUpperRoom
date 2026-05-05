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
  version: number;
  updatedAt?: string;
  notes: NoteDto[];
}

export interface UpdateContactRequest {
  firstName: string;
  lastName: string;
  version: number;
  email?: string;
  phone?: string;
  city?: string;
}

export interface ContactListRow {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  city?: string;
}

export interface ContactListResult {
  rows: ContactListRow[];
  total: number;
}

export interface ContactSearchResult {
  id: string;
  firstName: string;
  lastName: string;
  city?: string;
  snippet: string;
  matchedField: string;
}

export interface DeletedContactDto {
  id: string;
  name: string;
  deletedAt: string;
  teamId: string;
}

export interface IContactService {
  create(req: CreateContactRequest): Observable<CreateContactResponse>;
  getById(id: string): Observable<ContactDto>;
  update(id: string, req: UpdateContactRequest): Observable<void>;
  delete(id: string): Observable<void>;
  search(term: string): Observable<ContactSearchResult[]>;
  list(page?: number, size?: number, sort?: string): Observable<ContactListResult>;
  addNote(contactId: string, body: string): Observable<NoteDto>;
  updateNote(noteId: string, body: string): Observable<void>;
  deleteNote(noteId: string): Observable<void>;
  listDeleted(): Observable<DeletedContactDto[]>;
  restore(id: string): Observable<void>;
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

  update(id: string, req: UpdateContactRequest): Observable<void> {
    return this.http.put<void>(`/api/contacts/${id}`, req);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`/api/contacts/${id}`);
  }

  search(term: string): Observable<ContactSearchResult[]> {
    return this.http.get<ContactSearchResult[]>(`/api/contacts?search=${encodeURIComponent(term)}`);
  }

  list(page = 1, size = 25, sort = 'lastName:asc'): Observable<ContactListResult> {
    return this.http.get<ContactListResult>(`/api/contacts?page=${page}&size=${size}&sort=${sort}`);
  }

  addNote(contactId: string, body: string): Observable<NoteDto> {
    return this.http.post<NoteDto>(`/api/contacts/${contactId}/notes`, { body });
  }

  updateNote(noteId: string, body: string): Observable<void> {
    return this.http.put<void>(`/api/notes/${noteId}`, { body });
  }

  deleteNote(noteId: string): Observable<void> {
    return this.http.delete<void>(`/api/notes/${noteId}`);
  }

  listDeleted(): Observable<DeletedContactDto[]> {
    return this.http.get<DeletedContactDto[]>('/api/admin/contacts/deleted');
  }

  restore(id: string): Observable<void> {
    return this.http.post<void>(`/api/admin/contacts/${id}/restore`, {});
  }
}

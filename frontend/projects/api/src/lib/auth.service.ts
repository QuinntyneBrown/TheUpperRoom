import { HttpClient } from '@angular/common/http';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
  city: string;
  inviteToken?: string;
}

export interface RegisterResponse {
  message: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignInResponse {
  message: string;
}

export interface MeResponse {
  id: string;
  email: string;
  displayName: string;
  roles: string[];
}

export interface IAuthService {
  register(req: RegisterRequest): Observable<RegisterResponse>;
  verify(token: string): Observable<void>;
  signIn(req: SignInRequest): Observable<SignInResponse>;
  signOut(): Observable<void>;
  me(): Observable<MeResponse>;
  requestRecovery(email: string): Observable<{ message: string }>;
  resetPassword(req: { email: string; token: string; newPassword: string }): Observable<{ message: string }>;
}

export const AUTH_SERVICE = new InjectionToken<IAuthService>('AUTH_SERVICE');

@Injectable({ providedIn: 'root' })
export class AuthService implements IAuthService {
  private http = inject(HttpClient);

  register(req: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>('/api/auth/register', req);
  }

  verify(token: string): Observable<void> {
    return this.http.get<void>(`/api/auth/verify?token=${encodeURIComponent(token)}`);
  }

  signIn(req: SignInRequest): Observable<SignInResponse> {
    return this.http.post<SignInResponse>('/api/auth/sign-in', req);
  }

  signOut(): Observable<void> {
    return this.http.post<void>('/api/auth/sign-out', {});
  }

  me(): Observable<MeResponse> {
    return this.http.get<MeResponse>('/api/auth/me');
  }

  requestRecovery(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>('/api/auth/recovery', { email });
  }

  resetPassword(req: { email: string; token: string; newPassword: string }): Observable<{ message: string }> {
    return this.http.post<{ message: string }>('/api/auth/reset', req);
  }
}

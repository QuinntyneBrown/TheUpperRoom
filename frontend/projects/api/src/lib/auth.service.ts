import { HttpClient } from '@angular/common/http';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
  city: string;
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

export interface IAuthService {
  register(req: RegisterRequest): Observable<RegisterResponse>;
  verify(token: string): Observable<void>;
  signIn(req: SignInRequest): Observable<SignInResponse>;
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
}

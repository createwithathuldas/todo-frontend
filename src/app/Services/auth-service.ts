import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

import {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse
} from '../models/auth.models';
import { API_BASE } from './api.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${API_BASE}`;

  private tokenSubject = new BehaviorSubject<string | null>(
    this.getStoredToken()
  );
  public token$ = this.tokenSubject.asObservable();

  private userSubject = new BehaviorSubject<any>(
    this.getStoredUser()
  );
  public user$ = this.userSubject.asObservable();

  register(
    payload: RegisterRequest
  ): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(
      `${this.apiUrl}/register`,
      payload
    );
  }

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      payload
    ).pipe(
      tap((response) => {
        if (response.token) {
          localStorage.setItem('auth_token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.tokenSubject.next(response.token);
          this.userSubject.next(response.user);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    this.tokenSubject.next(null);
    this.userSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.getStoredToken();
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }

  private getStoredToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  private getStoredUser(): any {
    if (typeof localStorage !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }
}
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthState, LoginResponse, RegisterDto, RegisterResponse } from '../../../shared/models/auth.model';
import { HttpClient } from '@angular/common/http';



@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = environment.apiUrl + '/Auth';
  private readonly TOKEN_KEY = 'access_token';

  private authStateSubject = new BehaviorSubject<AuthState | null>(null);
  authState$ = this.authStateSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(email: string, password: string, rememberMe: boolean): Observable<LoginResponse> {
    console.log(environment.apiUrl);
    return this.http.post<LoginResponse>(
      `${this.API}/login`,
      { email, password },
      { withCredentials: true }
    ).pipe(
      tap(res => {
        this.authStateSubject.next({ token: res.token, user: res.user });

        if (rememberMe) {
          localStorage.setItem(this.TOKEN_KEY, res.token);
        } else {
          sessionStorage.setItem(this.TOKEN_KEY, res.token);
        }
      })
    );
  }

  register(dto: RegisterDto): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(
      `${this.API}/register`,
      dto,
      { withCredentials: true }
    ).pipe(
      tap(res => {
        this.authStateSubject.next({ token: res.token, user: res.user });
        sessionStorage.setItem(this.TOKEN_KEY, res.token);
      })
    );
  }

  refreshToken(): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(
      `${this.API}/refresh`,
      {},
      { withCredentials: true }
    );
  }

  logout() {
    const authState = this.authStateSubject.value;

    if (!authState?.user?.email) {
      this.clearAuthState();
      return this.http.post(`${this.API}/logout`, {});
    }

    return this.http.post(
      `${this.API}/logout`,
      { email: authState.user.email },
      { withCredentials: true }
    ).pipe(
      tap(() => {
        this.authStateSubject.next(null);
        localStorage.removeItem(this.TOKEN_KEY);
        sessionStorage.removeItem(this.TOKEN_KEY);
      })
    );
  }

  getAccessToken(): string | null {
    return this.authStateSubject.value?.token
      ?? sessionStorage.getItem(this.TOKEN_KEY)
      ?? localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  clearAuthState(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.TOKEN_KEY);
    this.authStateSubject.next(null);
  }

  setAccessToken(token: string): void {
    if (localStorage.getItem(this.TOKEN_KEY)) {
      localStorage.setItem(this.TOKEN_KEY, token);
    } else {
      sessionStorage.setItem(this.TOKEN_KEY, token);
    }

    const currentState = this.authStateSubject.value;
    if (currentState) {
      this.authStateSubject.next({ ...currentState, token });
    }
  }

  loadCurrentUser(): Observable<{ user: any }> {
    return this.http.get<{ user: any }>(
      `${this.API}/me`,
      { withCredentials: true }
    ).pipe(
      tap(res => {
        const token = this.getAccessToken();

        if (!token) return;

        this.authStateSubject.next({
          token,
          user: res.user
        });
      })
    );
  }

}

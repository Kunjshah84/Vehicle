import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import {
  AuthState,
  LoginResponse,
  RegisterDto,
  RegisterResponse
} from '../../../shared/models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly TOKEN_KEY = 'access_token';

  private authStateSubject = new BehaviorSubject<AuthState | null>(null);
  authState$ = this.authStateSubject.asObservable();

  constructor(private http: HttpClient) {}

  /** ✅ API BASE — resolved at runtime, never frozen */
  private get API(): string {
    console.log("Hewre is the apo called");
    console.log(environment.apiUrl);
    return `${environment.apiUrl}/Auth`;
  }


  login(
    email: string,
    password: string,
    rememberMe: boolean
  ): Observable<LoginResponse> {
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

    const payload = authState?.user?.email
      ? { email: authState.user.email }
      : {};

    return this.http.post(
      `${this.API}/logout`,
      payload,
      { withCredentials: true }
    ).pipe(
      tap(() => this.clearAuthState())
    );
  }

  getAccessToken(): string | null {
    return (
      this.authStateSubject.value?.token ??
      sessionStorage.getItem(this.TOKEN_KEY) ??
      localStorage.getItem(this.TOKEN_KEY)
    );
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

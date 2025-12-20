import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface RegisterDto {
  FullName: string;
  Email: string;
  Password: string;
  Number: string;
}

interface LoginResponse {
  token: string;
}

interface RegisterResponse {
  token: string;
  user: {
    userId: number;
    fullName: string;
    email: string;
    number: string;
    role: string;
  };
}

interface AuthState {
  token: string;
  user?: {
    userId: number;
    fullName: string;
    email: string;
    number: string;
    role: string;
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = 'http://localhost:5078/api/auth';

  private authStateSubject = new BehaviorSubject<AuthState | null>(null);

  authState$ = this.authStateSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.API}/login`,
      { email, password },
      { withCredentials: true } 
    ).pipe(
      tap(res => {
        this.authStateSubject.next({ token: res.token });
        // this.authStateSubject.subscribe(val => {
        //   console.log('The token form the backend is', val);
        // })
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
        this.authStateSubject.next({
          token: res.token,
          user: res.user
        });
        this.authStateSubject.subscribe(val => {
          console.log('The token form the backend is', val);
        });
      })
    );
  }

  getAccessToken(): string | null {
    return this.authStateSubject.value?.token ?? null;
  }

  isAuthenticated(): boolean {
    return !!this.authStateSubject.value?.token;
  }

  clearAuthState(): void {
    this.authStateSubject.next(null);
  }
}

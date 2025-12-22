import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface RegisterDto {
  FullName: string;
  Email: string;
  Password: string;
  Number: string;
}

// interface LoginResponse {
//   token: string;
// }


export interface LoginResponse {
  token: string;
  user: {
    userId: number;
    fullName: string;
    email: string;
    number: string;
    role: string;
  };
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
  user: {
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

  // --------------->From here gonna use the local storage
  private readonly TOKEN_KEY = 'access_token';


  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.API}/login`,
      { email, password },
      { withCredentials: true } 
    ).pipe(
      tap(res => {
        // this.authStateSubject.next({ token: res.token });
        this.authStateSubject.next({
          token: res.token,
          user: res.user
        });
        // this.authStateSubject.subscribe(val => {
        //   console.log('The token form the backend is', val);
        // })
        localStorage.setItem(this.TOKEN_KEY, res.token);
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
        // this.authStateSubject.subscribe(val => {
        //   console.log('The token form the backend is', val);
        // });
          localStorage.setItem(this.TOKEN_KEY, res.token);
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
      })
    );
  }




  getAccessToken(): string | null {
    // return localStorage.getItem(this.TOKEN_KEY);
    return this.authStateSubject.value?.token
    ?? localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);

  }

  clearAuthState(): void {
    // this.authStateSubject.next(null);
    // localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
    this.authStateSubject.next(null);
  }
}

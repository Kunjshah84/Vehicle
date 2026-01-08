import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment';
import { LoginResponse, RegisterResponse } from '../../../shared/models/auth.model';
import { AuthService } from '../api/auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const API = environment.apiUrl + '/Auth';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login and store token in localStorage when rememberMe = true', () => {
    const mockResponse: LoginResponse = {
      token: 'test-token',
      user: {
        userId: 1,
        fullName: 'Test User',
        email: 'test@example.com',
        number: '1234567890',
        role: 'User'
      }
    };

    service.login('test@example.com', 'password', true).subscribe(res => {
      expect(res).toEqual(mockResponse);
      expect(localStorage.getItem('access_token')).toBe('test-token');
    });

    const req = httpMock.expectOne(`${API}/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      email: 'test@example.com',
      password: 'password'
    });

    req.flush(mockResponse);
  });

  it('should login and store token in sessionStorage when rememberMe = false', () => {
    const mockResponse: LoginResponse = {
      token: 'session-token',
      user: {
        userId: 1,
        fullName: 'Test User',
        email: 'test@example.com',
        number: '1234567890',
        role: 'User'
      }
    };

    service.login('test@example.com', 'password', false).subscribe();

    const req = httpMock.expectOne(`${API}/login`);
    req.flush(mockResponse);

    expect(sessionStorage.getItem('access_token')).toBe('session-token');
    expect(localStorage.getItem('access_token')).toBeNull();
  });

  it('should register and store token in sessionStorage', () => {
    const mockResponse: RegisterResponse = {
      token: 'register-token',
      user: {
        userId: 2,
        fullName: 'New User',
        email: 'new@example.com',
        number: '9999999999',
        role: 'User'
      }
    };

    service.register({
      FullName: 'New User',
      Email: 'new@example.com',
      Password: 'password',
      Number: '1234567891'
    }).subscribe();

    const req = httpMock.expectOne(`${API}/register`);
    expect(req.request.method).toBe('POST');

    req.flush(mockResponse);

    expect(sessionStorage.getItem('access_token')).toBe('register-token');
  });

  it('should return access token from authState', () => {
    sessionStorage.setItem('access_token', 'stored-token');
    expect(service.getAccessToken()).toBe('stored-token');
  });

  it('should return true for isAuthenticated when token exists', () => {
    localStorage.setItem('access_token', 'token');
    expect(service.isAuthenticated()).toBeTrue();
  });

  it('should clear auth state and storage on logout', () => {
    localStorage.setItem('access_token', 'token');

    service.logout().subscribe();

    const req = httpMock.expectOne(`${API}/logout`);
    req.flush({});

    expect(localStorage.getItem('access_token')).toBeNull();
    expect(sessionStorage.getItem('access_token')).toBeNull();
  });
});

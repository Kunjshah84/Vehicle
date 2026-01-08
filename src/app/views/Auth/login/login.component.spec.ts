import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/api/auth.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { LoginResponse } from '../../../shared/models/auth.model';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle password visibility', () => {
    expect(component.showPassword).toBeTrue();
    component.togglePassword();
    expect(component.showPassword).toBeFalse();
  });

  it('should NOT call login when form is invalid', () => {
    component.onSubmit();

    expect(authServiceSpy.login).not.toHaveBeenCalled();
    expect(component.loginForm.touched).toBeTrue();
  });

  it('should login successfully and navigate to dashboard', () => {
    const mockResponse: LoginResponse = {
      token: 'fake-jwt-token',
      user: {
        userId: 1,
        fullName: 'Test User',
        email: 'test@example.com',
        number: '1234567890',
        role: 'User'
      }
    };

    authServiceSpy.login.and.returnValue(of(mockResponse));

    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'password123',
      rememberMe: true
    });

    component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalledWith(
      'test@example.com',
      'password123',
      true
    );
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should show alert on 401 error', () => {
    spyOn(window, 'alert');

    authServiceSpy.login.and.returnValue(
      throwError(() => ({
        status: 401,
        error: { message: 'Invalid credentials' }
      }))
    );

    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'password123',
      rememberMe: false
    });

    component.onSubmit();

    expect(window.alert).toHaveBeenCalledWith('Invalid credentials');
  });

  it('should show generic alert on non-401 error', () => {
    spyOn(window, 'alert');

    authServiceSpy.login.and.returnValue(
      throwError(() => ({ status: 500 }))
    );

    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'password123',
      rememberMe: false
    });

    component.onSubmit();

    expect(window.alert).toHaveBeenCalledWith(
      'Unexpected server error during login'
    );
  });
});

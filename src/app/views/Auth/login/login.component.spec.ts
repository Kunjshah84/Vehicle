import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/api/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginResponse } from '../../../shared/models/auth.model';


describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should NOT call login when form is invalid', () => {
    component.onSubmit();
    expect(authServiceSpy.login).not.toHaveBeenCalled();
  });

  it('should call login and navigate on success', () => {
    
    const mockResponse: LoginResponse = {
      token: 'fake-jwt-token',
      user: {
        userId: 1,
        fullName: "kunj",
        email: "kunj@gmail.com",
        number: "123456791",
        role: "user"
      }
    };

    authServiceSpy.login.and.returnValue(of(mockResponse));

    component.loginForm.setValue({
      email: 'test@test.com',
      password: 'password123',
      rememberMe: false
    });

    component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalledWith(
      'test@test.com',
      'password123',
      false
    );
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should show alert on 401 error', () => {
    spyOn(window, 'alert');

    authServiceSpy.login.and.returnValue(
      throwError(() => ({
        status: 401,
        error: { message: 'INVALId credentials' }
      }))
    );

    component.loginForm.setValue({
      email: 'test@test.com',
      password: 'wrongpass',
      rememberMe: false
    });

    component.onSubmit();

    expect(window.alert).toHaveBeenCalledWith('Invalid credentials');
  });
});

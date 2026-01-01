import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../../core/services/api/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should mark form invalid when empty', () => {
    expect(component.registerForm.invalid).toBeTrue();
  });

  it('should fail when passwords do not match', () => {
    component.registerForm.setValue({
      FullName: 'John Doe',
      Email: 'john@test.com',
      Password: 'password123',
      confirmpassword: 'password456',
      Number: '9999999999',
      acceptTerms: true
    });

    expect(component.registerForm.errors).toEqual({
      passwordMismatch: true
    });
  });

  it('should toggle password visibility', () => {
    expect(component.showPassword).toBeFalse();
    component.togglePassword();
    expect(component.showPassword).toBeTrue();
  });

  it('should NOT call register API when form is invalid', () => {
    component.onSubmit();
    expect(authServiceSpy.register).not.toHaveBeenCalled();
  });

  it('should call register API and navigate on success', () => {

    const mockRegisterResponse = {
      token: 'fake-jwt-token',
      user: {
        userId: 1,
        fullName: 'kunj_shah',
        email: 'kunj@gmail.com',
        number: '1234567891',
        role: 'User'
      }
    };
    authServiceSpy.register.and.returnValue(of(mockRegisterResponse));

    component.registerForm.setValue({
      FullName: 'kunj',
      Email: 'kunj@gmail.com',
      Password: 'kunj123',
      confirmpassword: 'kunj123',
      Number: '9999999999',
      acceptTerms: true
    });

    component.onSubmit();

    expect(authServiceSpy.register).toHaveBeenCalledWith({
      FullName: 'kunj',
      Email: 'kunj@gmail.com',
      Password: 'kunj123',
      Number: '9999999999'
    });

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should show alert when API returns 400 error', () => {
    spyOn(window, 'alert');
    authServiceSpy.register.and.returnValue(
      throwError(() => ({
        status: 400,
        error: { message: 'Email already exists' }
      }))
    );

    component.registerForm.setValue({
      FullName: 'kunj',
      Email: 'kunj@gmail.com',
      Password: 'kunj123',
      confirmpassword: 'kunj123',
      Number: '9999999999',
      acceptTerms: true
    });

    component.onSubmit();

    expect(window.alert).toHaveBeenCalledWith('Email already exists');
  });
});

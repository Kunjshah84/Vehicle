import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../../core/services/api/auth.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;

  const mockRegisterResponse = {
    token: 'fake-jwt-token',
    user: {
      userId: 1,
      fullName: 'Test User',
      email: 'test@example.com',
      number: '1234567890',
      role: 'User'
    }
  };

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);

    await TestBed.configureTestingModule({
      imports: [
        RegisterComponent,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        provideNoopAnimations()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    fixture.detectChanges();
  });


  it('should create the component', () => {
    expect(component).toBeTruthy();
  });


  it('should initialize form as invalid', () => {
    expect(component.registerForm.invalid).toBeTrue();
  });

  it('should require acceptTerms to be true', () => {
    component.acceptTerms?.setValue(false);
    expect(component.acceptTerms?.valid).toBeFalse();
  });


  it('should mark form invalid when passwords do not match', () => {
    component.registerForm.patchValue({
      Password: '123456',
      confirmpassword: '654321'
    });

    expect(component.registerForm.errors).toEqual({
      passwordMismatch: true
    });
  });

  it('should mark form valid when passwords match', () => {
    component.registerForm.patchValue({
      Password: '123456',
      confirmpassword: '123456'
    });

    expect(component.registerForm.errors).toBeNull();
  });

  it('should not submit when form is invalid', () => {
    component.onSubmit();

    expect(authServiceSpy.register).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });


  it('should submit valid form and navigate to dashboard', fakeAsync(() => {
    authServiceSpy.register.and.returnValue(of(mockRegisterResponse));

    component.registerForm.setValue({
      FullName: 'Test User',
      Email: 'test@example.com',
      Password: '123456',
      confirmpassword: '123456',
      Number: '1234567890',
      acceptTerms: true
    });

    component.onSubmit();
    tick();

    expect(authServiceSpy.register).toHaveBeenCalledWith({
      FullName: 'Test User',
      Email: 'test@example.com',
      Password: '123456',
      Number: '1234567890'
    });

    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  }));




  it('should show alert message on 400 error', () => {
    spyOn(window, 'alert');

    authServiceSpy.register.and.returnValue(
      throwError(() => ({
        status: 400,
        error: { message: 'Email already exists' }
      }))
    );

    component.registerForm.setValue({
      FullName: 'Test User',
      Email: 'test@example.com',
      Password: '123456',
      confirmpassword: '123456',
      Number: '1234567890',
      acceptTerms: true
    });

    component.onSubmit();

    expect(window.alert).toHaveBeenCalledWith('Email already exists');
    expect(router.navigate).not.toHaveBeenCalled();
  });


  it('should show generic alert on unexpected error', () => {
    spyOn(window, 'alert');

    authServiceSpy.register.and.returnValue(
      throwError(() => ({ status: 500 }))
    );

    component.registerForm.setValue({
      FullName: 'Test User',
      Email: 'test@example.com',
      Password: '123456',
      confirmpassword: '123456',
      Number: '1234567890',
      acceptTerms: true
    });

    component.onSubmit();

    expect(window.alert).toHaveBeenCalledWith(
      'Unexpected error during registration'
    );
  });

  it('should toggle password visibility', () => {
    expect(component.showPassword).toBeFalse();

    component.togglePassword();
    expect(component.showPassword).toBeTrue();

    component.togglePassword();
    expect(component.showPassword).toBeFalse();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { AuthService } from '../../core/services/api/auth.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  // Mock auth state stream
  const authState$ = new BehaviorSubject<any>({
    user: {
      fullName: 'John Doe'
    }
  });

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['logout'], {
      authState$: authState$.asObservable()
    });

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    authServiceSpy.logout.and.returnValue(of());

    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // safe: observable already mocked
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should set userName from authState$', () => {
    expect(component.userName).toBe('John Doe');
  });

  it('should update userName when authState changes', () => {
    authState$.next({
      user: {
        fullName: 'Jane Smith'
      }
    });

    expect(component.userName).toBe('Jane Smith');
  });

  it('should set userName to null when user logs out', () => {
    authState$.next(null);

    expect(component.userName).toBeNull();
  });

  it('should call logout and navigate to login', () => {
    component.onLogout();

    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should navigate to dashboard when godeshboard is called', () => {
    component.godeshboard();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });
});

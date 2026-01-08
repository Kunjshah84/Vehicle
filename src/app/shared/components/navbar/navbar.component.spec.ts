import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../../core/services/api/auth.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

describe('TestNavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let router: Router;

  const authServiceMock = {
    authState$: of({
      user: { fullName: 'John Doe', role: 'Manager' }
    }),
    logout: jasmine.createSpy().and.returnValue(of(void 0))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NavbarComponent,             
        RouterTestingModule.withRoutes([]) 
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    fixture.detectChanges(); // ngOnInit runs
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set user name and manager flag', () => {
    expect(component.userName).toBe('John Doe');
    expect(component.isManager).toBeTrue();
  });

  it('should logout and navigate to login', () => {
    component.onLogout();

    expect(authServiceMock.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should navigate to dashboard', () => {
    component.goDashboard();
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should navigate to vehicle management', () => {
    component.goManagement();
    expect(router.navigate).toHaveBeenCalledWith(['/vehicle-management']);
  });
});

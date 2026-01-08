import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AuthService } from './core/services/api/auth.service';
import { of } from 'rxjs';

describe('AppComponent', () => {
  const authServiceMock = {
    getAccessToken: jasmine.createSpy('getAccessToken').and.returnValue(null),
    loadCurrentUser: jasmine.createSpy('loadCurrentUser').and.returnValue(of({})),
    clearAuthState: jasmine.createSpy('clearAuthState')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});

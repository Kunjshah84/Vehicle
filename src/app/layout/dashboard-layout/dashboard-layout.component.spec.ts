import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { AuthService } from '../../core/services/api/auth.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { DashboardLayoutComponent } from './dashboard-layout.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('dashboard-layout', () => {
  let component: DashboardLayoutComponent;
  let fixture: ComponentFixture<DashboardLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DashboardLayoutComponent, 
        NavbarComponent,         
        RouterTestingModule,      
        HttpClientTestingModule   
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create dashboard layout component', () => {
    expect(component).toBeTruthy();
  });
  
}); 
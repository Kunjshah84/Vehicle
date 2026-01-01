import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../../core/services/api/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  imports: [NgIf],
  standalone: true
})
export class NavbarComponent implements OnInit {

  userName: string | null = null;
  isManager = false;
  isMenuOpen = false;

  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    this.authService.authState$.subscribe(state => {
      this.userName = state?.user?.fullName ?? null;
      this.isManager = state?.user?.role === 'Manager';
    });
  }

  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      }
    });
  }

  goDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  goManagement(): void {
    this.router.navigate(['/vehicle-management']);
  }
}

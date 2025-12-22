import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  imports: [NgIf], 
  standalone: true
})
export class NavbarComponent implements OnInit {

  userName: string | null = null;


  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    this.authService.authState$.subscribe(state => {
      this.userName = state?.user?.fullName ?? null;
    });
  }

  onLogout(): void {
    console.log('Logout clicked');
    this.authService.logout().subscribe({
      next: () => {
        console.log('In the services');
        this.router.navigate(['/login']);
      }
    });
  }

  godeshboard(): void {
    this.router.navigate(['/dashboard']);
  }

}

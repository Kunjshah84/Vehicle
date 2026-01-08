import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/api/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Vehicle';
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    if (this.authService.getAccessToken()) {
      this.authService.loadCurrentUser().subscribe({
        error: () => {
          this.authService.clearAuthState();
        }
      });
    }
  }
}

import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { AuthService } from '../../../core/services/api/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgIf, NgClass],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  showPassword = true;

  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ]),
    rememberMe: new FormControl(false)
  });

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password, rememberMe } = this.loginForm.value;
    this.auth.login(email!, password!, rememberMe!).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: err => {
        if (err.status === 401) {
          alert(err.error?.message || 'Invalid credentials');
        } else {
          alert('Unexpected server error during login');
        }
      }
    });
  }

  goToForgotPassword(): void {
    
  }

}

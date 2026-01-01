import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl
} from '@angular/forms';
import { NgIf, NgClass } from '@angular/common';
import { AuthService } from '../../../core/services/api/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgIf, NgClass],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  showPassword = false;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  passwordMatchValidator = (control: AbstractControl) => {
    const form = control as FormGroup;
    return form.get('Password')?.value ===
      form.get('confirmpassword')?.value
      ? null
      : { passwordMismatch: true };
  };

  registerForm = new FormGroup(
    {
      FullName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(3)]
      }),
      Email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email]
      }),
      Password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(6)]
      }),
      confirmpassword: new FormControl('', {
        nonNullable: true,
        validators: Validators.required
      }),
      Number: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.pattern('^[0-9]{10}$')
        ]
      }),
      acceptTerms: new FormControl(false, {
        nonNullable: true,
        validators: Validators.requiredTrue
      })
    },
    { validators: this.passwordMatchValidator }
  );

  get FullName() {
    return this.registerForm.get('FullName');
  }
  get Email() {
    return this.registerForm.get('Email');
  }
  get Password() {
    return this.registerForm.get('Password');
  }
  get confirmpassword() {
    return this.registerForm.get('confirmpassword');
  }
  get Number() {
    return this.registerForm.get('Number');
  }
  get acceptTerms() {
    return this.registerForm.get('acceptTerms');
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const payload = this.registerForm.getRawValue();
    delete (payload as any).acceptTerms;

    this.auth.register(payload).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: err =>
        alert(
          err.status === 400
            ? err.error?.message
            : 'Unexpected error during registration'
        )
    });
  }
}

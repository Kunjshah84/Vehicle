import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import {FormControl, ReactiveFormsModule , FormGroup,  Validators} from '@angular/forms';
import { NgIf} from '@angular/common';
import { AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';



@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule, NgIf],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  standalone: true
})
export class RegisterComponent {

  constructor(private auth: AuthService,private router: Router) {
    console.log('RegisterComponent loaded');
  }

  // Custome Validator to check if password and confirm password match:
  
  passwordMatchValidator = (control: AbstractControl) => {
    const form = control as FormGroup;
    const password = control.get('Password')?.value;
    const confirmPassword = control.get('confirmpassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  };
  
  
  registerForm = new FormGroup({
    FullName: new FormControl<string>('', {nonNullable:true , validators:[Validators.required, Validators.minLength(3)]}),
    Email : new FormControl<string>('', {nonNullable:true , validators:[Validators.required, Validators.email]}),
    Password : new FormControl<string>('', {nonNullable:true , validators:[Validators.required, Validators.minLength(6)]}),
    confirmpassword : new FormControl<string>('', {nonNullable:true , validators:Validators.required}),
    Number: new FormControl<string>('', {nonNullable:true , validators:[Validators.required, Validators.pattern('^[0-9]{10}$')]})
  },{
    validators: this.passwordMatchValidator
  })

  // The getters for easy access to form controls in the template
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

  // The submit event:
  onSubmit() {
    console.log("Form Submitted"); 
    if(this.registerForm.invalid){
      this.registerForm.markAllAsTouched();
      return ;
    }
    // console.log(this.registerForm.value);

    const payload = this.registerForm.getRawValue();
    const { FullName , Email, Password , Number } = payload;


    this.auth.register({ FullName , Email, Password, Number }).subscribe({
      next: () => { console.log("Registration successful"); this.router.navigate(['/Deshboard'])},
      error: err =>{
        if(err.status === 400){
          alert(err.error?.message);
        }
        else{
          alert('An unexpected error occurred during registration.');
        }
      }
    });

  }

  // The property for the showing the pass
  showPassword:boolean=false;

  togglePassword(){
    this.showPassword = !this.showPassword;
  }

}

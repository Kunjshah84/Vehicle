import { Component  , } from '@angular/core';
import { RouterLink } from "@angular/router";
import {FormControl, ReactiveFormsModule , FormGroup,  Validators} from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';


@Component({
  selector: 'app-login',
  imports: [RouterLink , ReactiveFormsModule ,NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  constructor(private auth: AuthService,private router: Router) {
        // console.log('LoginComponent loaded');
    }

    get email(){
      return this.loginForm.get('email');
    }

    get password(){
      return this.loginForm.get('password');
    }

    // testClick() {
    //   console.log('Button click works');
    // }
    // test():void  {
    //   console.log('CLICK ME button works');
    // }

  onSubmit(){
    if(this.loginForm.invalid){
      this.loginForm.markAllAsTouched();
      return ;
    } 
    // console.log(this.loginForm.value); 
    const { email, password } = this.loginForm.value;
    
    this.auth.login(email!, password!).subscribe({
      next: () => { this.router.navigate(['/Deshboard'])},
      error: err => console.error(err)
    });
  }

  showPassword:boolean=false;  
  togglePassword(){
    this.showPassword = !this.showPassword;
  }

}

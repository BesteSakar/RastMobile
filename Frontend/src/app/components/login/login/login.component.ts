import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { LoginRequest } from '../../../models/loginRequest.request';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers : [AuthService]
})
export class LoginComponent {
  loginRequest: LoginRequest = new LoginRequest();
  message: string | null = null;
  success: boolean = true;
  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.loginRequest).subscribe(
      response => {
        console.log('Giriş başarılı:', response);
        this.success = true;
        setTimeout(() => (this.message = null), 3000);
        this.router.navigate(['home']);
      },
      error => {
        this.message = error.error.message;
        this.success = false;
        setTimeout(() => (this.message = null), 3000);
      }
    );
  }
  

  
}

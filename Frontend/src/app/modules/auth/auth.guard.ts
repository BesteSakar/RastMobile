import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';


@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const isLoggedIn = this.authService.isLoggedIn();
    if (isLoggedIn) {
      return true;
    } else {
      console.warn('AuthGuard: Kullanıcı giriş yapmamış, login sayfasına yönlendiriliyor.');
      this.router.navigate(['login']);
      return false;
    }
  }
}

import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  private authService = inject(AuthService);

  constructor(
    private router: Router
  ) {}

  canActivate(): boolean {
    const token = this.authService.getSessionToken();
    if (token && token !== '') {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}

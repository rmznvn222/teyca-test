import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

const TOKEN_KEY = 'teyca_token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private cookieService = inject(CookieService);
  private router = inject(Router)

  token = signal<string | null>(this.cookieService.get(TOKEN_KEY) || null);

  login(login: string, password: string) {
    return this.http
      .post<any>('https://api.teyca.ru/test-auth-only', { login, password })
      .pipe(
        tap((res) => {

          const token = res.auth_token;

          if (!token) {
            console.error('NO TOKEN IN RESPONSE', res);
            return;
          }

          this.cookieService.set(TOKEN_KEY, token);
          this.token.set(token);
        }),
      );
  }

  logout() {
    this.cookieService.delete('teyca_token', '/');
    this.token.set(null);
    this.router.navigate(['/login']);
  }

  getToken() {
    return this.cookieService.get(TOKEN_KEY);
  }

  isAuth(): boolean {
    const token = this.cookieService.get(TOKEN_KEY);
    return !!token && token.length > 10;
  }
}

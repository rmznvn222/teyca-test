import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { PushRequest, PushResponse } from './push.interface';

@Injectable({
  providedIn: 'root',
})
export class PushService {
  private http = inject(HttpClient);
  private cookieService = inject(CookieService);

  sendPush(data: PushRequest) {
    const token = this.cookieService.get('teyca_token');

    return this.http.post<PushResponse>(
      `https://api.teyca.ru/v1/${token}/message/push`,
      data,
    );
  }
}

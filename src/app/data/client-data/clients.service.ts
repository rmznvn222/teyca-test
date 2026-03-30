import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { ClientsResponse } from './clients.interface';

@Injectable({
  providedIn: 'root'
})

export class ClientsService {
  private http = inject(HttpClient);
  private cookieService = inject(CookieService);

  getClients(limit: number, offset: number, search = '') {
    const token = this.cookieService.get('teyca_token');

    const params = new URLSearchParams({
      limit: String(limit),
      offset: String(offset),
    });

    if (search) {
      params.append('search', search);
    }

    const url = `https://api.teyca.ru/v1/${token}/passes?${params.toString()}`;

    return this.http.get<ClientsResponse>(url);
  }
}
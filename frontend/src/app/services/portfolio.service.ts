import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PortfolioData } from '../models/portfolio.model';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private readonly apiUrl = '/api/portfolio';

  constructor(private readonly http: HttpClient) {}

  getPortfolio(): Observable<PortfolioData> {
    return this.http.get<PortfolioData>(this.apiUrl);
  }
}

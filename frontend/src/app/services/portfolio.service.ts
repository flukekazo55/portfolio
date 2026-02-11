import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { PortfolioData } from '../models/portfolio.model';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private readonly apiUrl = '/api/portfolio';
  private readonly staticDataUrl = 'assets/portfolio-data.json';

  constructor(private readonly http: HttpClient) {}

  getPortfolio(): Observable<PortfolioData> {
    const isGitHubPages = window.location.hostname.endsWith('github.io');
    const sourceUrl = isGitHubPages ? this.staticDataUrl : this.apiUrl;

    return this.http.get<PortfolioData>(sourceUrl).pipe(
      catchError(() => this.http.get<PortfolioData>(this.staticDataUrl))
    );
  }
}

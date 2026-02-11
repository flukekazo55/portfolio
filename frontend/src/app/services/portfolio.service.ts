import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { PortfolioData } from '../models/portfolio.model';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private readonly staticDataUrl = 'assets/portfolio-data.json';

  constructor(private readonly http: HttpClient) {}

  getPortfolio(): Observable<PortfolioData> {
    return this.http.get<PortfolioData>(this.staticDataUrl).pipe(
      catchError(() => this.http.get<PortfolioData>(this.staticDataUrl))
    );
  }
}

import { Component, OnInit } from '@angular/core';
import { PortfolioData } from './models/portfolio.model';
import { PortfolioService } from './services/portfolio.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  portfolio: PortfolioData | null = null;
  loading = true;
  error = '';

  constructor(private readonly portfolioService: PortfolioService) {}

  ngOnInit(): void {
    this.portfolioService.getPortfolio().subscribe({
      next: (portfolio) => {
        this.portfolio = portfolio;
        this.loading = false;
      },
      error: () => {
        this.error = 'Unable to load portfolio data. Please start the backend API server.';
        this.loading = false;
      }
    });
  }

  get experienceYears(): number {
    const firstProfessionalYear = 2021;
    return Math.max(1, new Date().getFullYear() - firstProfessionalYear);
  }
}

import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Subscription } from 'rxjs';
import { PortfolioData } from './models/portfolio.model';
import { PortfolioService } from './services/portfolio.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  portfolio: PortfolioData | null = null;
  loading = true;
  error = '';
  visibleExperience = new Set<number>();
  @ViewChildren('experienceCard') experienceCards!: QueryList<ElementRef<HTMLElement>>;

  private experienceObserver: IntersectionObserver | null = null;
  private experienceCardsChangeSub: Subscription | null = null;

  constructor(
    private readonly portfolioService: PortfolioService,
    private readonly ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.portfolioService.getPortfolio().subscribe({
      next: (portfolio) => {
        this.portfolio = portfolio;
        this.loading = false;
      },
      error: () => {
        this.error = 'Unable to load portfolio data. Please check the data file.';
        this.loading = false;
      }
    });
  }

  ngAfterViewInit(): void {
    this.setupExperienceObserver();
    this.experienceCardsChangeSub = this.experienceCards.changes.subscribe(() => {
      this.setupExperienceObserver();
    });
  }

  ngOnDestroy(): void {
    this.experienceObserver?.disconnect();
    this.experienceCardsChangeSub?.unsubscribe();
  }

  get experienceYears(): number {
    const firstProfessionalYear = 2021;
    return Math.max(1, new Date().getFullYear() - firstProfessionalYear);
  }

  private setupExperienceObserver(): void {
    if (!this.experienceCards?.length) {
      return;
    }

    this.experienceObserver?.disconnect();

    if (typeof IntersectionObserver === 'undefined') {
      this.experienceCards.forEach((_, index) => {
        this.visibleExperience.add(index);
      });
      return;
    }

    this.experienceObserver = new IntersectionObserver(
      (entries) => {
        this.ngZone.run(() => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              return;
            }

            const index = Number((entry.target as HTMLElement).dataset['index']);
            if (Number.isNaN(index)) {
              return;
            }

            this.visibleExperience.add(index);
            this.experienceObserver?.unobserve(entry.target);
          });
        });
      },
      {
        threshold: 0.35,
        rootMargin: '0px 0px -12% 0px'
      }
    );

    this.experienceCards.forEach((card) => {
      this.experienceObserver?.observe(card.nativeElement);
    });
  }
}

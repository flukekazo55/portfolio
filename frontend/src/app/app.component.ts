import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Subscription } from 'rxjs';
import { ExperienceEntry, PortfolioData } from './models/portfolio.model';
import { PortfolioService } from './services/portfolio.service';

interface NavigationItem {
  id: string;
  label: string;
  icon: string;
}

interface ContactLink {
  href: string;
  label: string;
  value: string;
  icon: string;
  external?: boolean;
}

interface CompetencyCard {
  label: string;
  value: string;
  icon: string;
  tone: 'primary' | 'secondary' | 'tertiary' | 'alert';
}

interface DashboardStat {
  label: string;
  value: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly navigation: NavigationItem[] = [
    { id: 'summary', label: 'Summary', icon: 'person' },
    { id: 'technical', label: 'Competencies', icon: 'bolt' },
    { id: 'experience', label: 'Experience', icon: 'work' },
    { id: 'education', label: 'Education', icon: 'school' },
    { id: 'certs', label: 'Certifications', icon: 'verified' },
    { id: 'contact', label: 'Contact', icon: 'mail' }
  ];
  readonly currentYear = new Date().getFullYear();

  portfolio: PortfolioData | null = null;
  loading = true;
  error = '';
  terminalHandle = '';
  contactLinks: ContactLink[] = [];
  competencyCards: CompetencyCard[] = [];
  skillChips: string[] = [];
  dashboardStats: DashboardStat[] = [];
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
        this.hydrateViewModel(portfolio);
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
    if (!this.portfolio?.experience.length) {
      return 0;
    }

    const firstProfessionalYear = this.getEarliestYear(this.portfolio.experience);
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

  private hydrateViewModel(portfolio: PortfolioData): void {
    const detailTools = portfolio.skills.programming.languageDetails.flatMap((detail) => detail.tools);
    const uniqueSkillChips = Array.from(
      new Set([
        ...portfolio.skills.programming.frameworks,
        ...detailTools,
        ...portfolio.skills.programming.others
      ])
    );
    const primaryEducation = portfolio.education[0];
    const phoneNumber = portfolio.profile.phone.replace(/[^\d+]/g, '');

    this.visibleExperience = new Set<number>();
    this.terminalHandle = this.createTerminalHandle(portfolio.profile.name);
    this.contactLinks = [
      {
        href: `mailto:${portfolio.profile.email}`,
        label: 'Email',
        value: portfolio.profile.email,
        icon: 'mail'
      },
      {
        href: `tel:${phoneNumber}`,
        label: 'Phone',
        value: portfolio.profile.phone,
        icon: 'call'
      },
      {
        href: portfolio.profile.linkedin,
        label: 'LinkedIn',
        value: 'View profile',
        icon: 'link',
        external: true
      }
    ];
    this.competencyCards = [
      {
        label: 'Personal Skills',
        value: portfolio.skills.personal.join(' / '),
        icon: 'psychology_alt',
        tone: 'secondary'
      },
      {
        label: 'Languages & Runtime',
        value: portfolio.skills.programming.languages.join(' / '),
        icon: 'code',
        tone: 'primary'
      },
      {
        label: 'Frameworks & Methods',
        value: portfolio.skills.programming.frameworks.join(' / '),
        icon: 'deployed_code',
        tone: 'tertiary'
      },
      {
        label: 'Platform & Tooling',
        value: this.selectChips(uniqueSkillChips, [
          'Docker',
          'Kubernetes',
          'Jenkins',
          'Argo CD',
          'Confluent Kafka',
          'SQL Server',
          'PostgreSQL',
          'MongoDB'
        ]),
        icon: 'developer_board',
        tone: 'alert'
      }
    ];
    this.skillChips = uniqueSkillChips;
    this.dashboardStats = [
      { label: 'Experience', value: `${this.experienceYears}+ YEARS` },
      { label: 'Professional Roles', value: `${portfolio.experience.length}` },
      { label: 'Certificates', value: `${portfolio.certificates.length}` },
      { label: 'GPA', value: primaryEducation ? primaryEducation.gpa : 'N/A' }
    ];
  }

  private createTerminalHandle(name: string): string {
    const [firstName] = name.trim().split(/\s+/);
    return (firstName || name).toUpperCase().replace(/[^A-Z0-9]+/g, '_');
  }

  private getEarliestYear(entries: ExperienceEntry[]): number {
    const currentYear = new Date().getFullYear();
    const years = entries
      .flatMap((entry) => entry.period.match(/\b(?:19|20)\d{2}\b/g) ?? [])
      .map((year) => Number(year))
      .filter((year) => !Number.isNaN(year));

    return years.length ? Math.min(...years) : currentYear;
  }

  private selectChips(source: string[], labels: string[]): string {
    const picked = labels.filter((label) => source.includes(label));
    return picked.length ? picked.join(' / ') : source.slice(0, 6).join(' / ');
  }
}

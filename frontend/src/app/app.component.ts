import { Component, OnInit } from '@angular/core';
import { PortfolioData } from './models/portfolio.model';
import { PortfolioService } from './services/portfolio.service';

interface NavigationItem {
  id: string;
  label: string;
}

interface ContactLink {
  href: string;
  label: string;
  value: string;
  icon: string;
  external?: boolean;
}

interface LanguageMeter {
  name: string;
  score: number;
}

interface ShowcaseMetric {
  label: string;
  value: string;
}

interface CertificateCard {
  name: string;
  icon: string;
  tone: 'sun' | 'rose' | 'ruby' | 'sky';
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  readonly navigation: NavigationItem[] = [
    { id: 'home', label: 'Home' },
    { id: 'experience', label: 'Experience' },
    { id: 'skills', label: 'Skills' },
    { id: 'education', label: 'Education' },
    { id: 'contact', label: 'Contact' }
  ];
  readonly experienceSignposts = [
    'CURRENT MISSION',
    'PORTAL ERA',
    'FULLSTACK ADVENTURE',
    'FACTORY CORE',
    'WHERE IT BEGAN'
  ];
  readonly currentYear = new Date().getFullYear();

  portfolio: PortfolioData | null = null;
  loading = true;
  error = '';
  firstName = 'Developer';
  contactLinks: ContactLink[] = [];
  languageMeters: LanguageMeter[] = [];
  frameworkChips: string[] = [];
  toolChips: string[] = [];
  personalSkills: string[] = [];
  certificateCards: CertificateCard[] = [];
  showcaseMetrics: ShowcaseMetric[] = [];
  heroPills: string[] = [];

  constructor(private readonly portfolioService: PortfolioService) {}

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

  get experienceYears(): number {
    if (!this.portfolio) {
      return 0;
    }

    const periods = [...this.portfolio.experience, ...this.portfolio.internship].map((entry) => entry.period);
    const firstProfessionalYear = this.getEarliestYear(periods);
    return Math.max(1, new Date().getFullYear() - firstProfessionalYear);
  }

  private hydrateViewModel(portfolio: PortfolioData): void {
    const detailTools = portfolio.skills.programming.languageDetails.flatMap((detail) => detail.tools);
    const uniqueTools = Array.from(new Set([...detailTools, ...portfolio.skills.programming.others]));
    const primaryEducation = portfolio.education[0] ?? null;

    this.firstName = portfolio.profile.name.trim().split(/\s+/)[0] || 'Developer';
    this.personalSkills = portfolio.skills.personal;
    this.frameworkChips = portfolio.skills.programming.frameworks;
    this.languageMeters = this.createLanguageMeters(portfolio.skills.programming.languages).slice(0, 6);
    this.toolChips = uniqueTools;
    this.heroPills = this.frameworkChips
      .slice(0, 2)
      .map((item) => item.replace(/\(.+?\)/g, '').trim())
      .filter((item) => !!item);

    if (this.heroPills.length < 2) {
      this.heroPills = [...this.heroPills, 'Cloud Native'].slice(0, 2);
    }

    this.contactLinks = [
      {
        href: `mailto:${portfolio.profile.email}`,
        label: 'Email',
        value: portfolio.profile.email,
        icon: 'mail'
      },
      {
        href: this.toPhoneHref(portfolio.profile.phone),
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

    this.certificateCards = portfolio.certificates.map((certificate, index) => this.mapCertificate(certificate, index));
    this.showcaseMetrics = [
      { label: 'Experience', value: `${this.experienceYears}+ Years` },
      { label: 'Professional Roles', value: `${portfolio.experience.length + portfolio.internship.length}` },
      { label: 'Certificates', value: `${portfolio.certificates.length}` },
      { label: 'GPA', value: primaryEducation?.gpa || 'N/A' }
    ];
  }

  private toPhoneHref(phone: string): string {
    return `tel:${phone.replace(/[^\d+]/g, '')}`;
  }

  private createLanguageMeters(languages: string[]): LanguageMeter[] {
    return languages.map((language) => ({
      name: language,
      score: this.scoreByLanguage(language)
    }));
  }

  private scoreByLanguage(language: string): number {
    const normalized = language.toLowerCase();

    if (normalized.includes('typescript')) {
      return 95;
    }
    if (normalized.includes('javascript')) {
      return 98;
    }
    if (normalized.includes('golang') || normalized.includes('go')) {
      return 84;
    }
    if (normalized.includes('c#') || normalized.includes('.net')) {
      return 88;
    }
    if (normalized.includes('database') || normalized.includes('sql')) {
      return 90;
    }
    if (normalized.includes('css') || normalized.includes('html')) {
      return 93;
    }

    return 82;
  }

  private mapCertificate(certificate: string, index: number): CertificateCard {
    const normalized = certificate.toLowerCase();

    if (normalized.includes('javascript')) {
      return { name: certificate, icon: 'javascript', tone: 'sun' };
    }
    if (normalized.includes('problem')) {
      return { name: certificate, icon: 'psychology', tone: 'rose' };
    }
    if (normalized.includes('angular')) {
      return { name: certificate, icon: 'change_history', tone: 'ruby' };
    }
    if (normalized.includes('sql')) {
      return { name: certificate, icon: 'database', tone: 'sky' };
    }

    const fallbackTones: CertificateCard['tone'][] = ['sun', 'rose', 'ruby', 'sky'];
    return {
      name: certificate,
      icon: 'verified',
      tone: fallbackTones[index % fallbackTones.length]
    };
  }

  private getEarliestYear(periods: string[]): number {
    const currentYear = new Date().getFullYear();
    const years = periods
      .flatMap((period) => period.match(/\b(?:19|20)\d{2}\b/g) ?? [])
      .map((year) => Number(year))
      .filter((year) => !Number.isNaN(year));

    return years.length ? Math.min(...years) : currentYear;
  }
}

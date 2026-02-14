import { Component, OnInit } from '@angular/core';
import { PortfolioData } from './models/portfolio.model';
import { PortfolioService } from './services/portfolio.service';

interface ToolVisual {
  iconUrl: string | null;
  tint: string;
  ring: string;
  glow: string;
  fallback: string;
}

interface ToolLogoSpec {
  slug: string;
  iconHex: string;
  tint: string;
  ring: string;
  glow: string;
}

interface CompanyLogoSpec {
  logoUrl: string;
  tint: string;
}

interface CompanyVisual {
  logoUrl: string | null;
  tint: string;
}

interface CodeRainColumn {
  left: number;
  duration: number;
  delay: number;
  opacity: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  portfolio: PortfolioData | null = null;
  loading = true;
  error = '';
  readonly codeRainText = 'Chutipong Jarensawat Software Engineer';
  readonly codeRainLines = Array.from({ length: 9 });
  readonly codeRainColumns: CodeRainColumn[] = [
    { left: 6, duration: 16, delay: -3, opacity: 0.2 },
    { left: 16, duration: 18, delay: -8, opacity: 0.25 },
    { left: 27, duration: 14, delay: -4, opacity: 0.18 },
    { left: 38, duration: 17, delay: -11, opacity: 0.22 },
    { left: 49, duration: 15, delay: -6, opacity: 0.24 },
    { left: 60, duration: 19, delay: -9, opacity: 0.2 },
    { left: 71, duration: 13, delay: -5, opacity: 0.22 },
    { left: 82, duration: 18, delay: -2, opacity: 0.18 },
    { left: 92, duration: 16, delay: -10, opacity: 0.23 }
  ];
  private readonly toolVisualCache: Record<string, ToolVisual> = {};
  private readonly companyVisualCache: Record<string, CompanyVisual> = {};

  private readonly toolLogoMap: Record<string, ToolLogoSpec> = {
    angulartemplates: { slug: 'angular', iconHex: 'DD0031', tint: 'rgba(221, 0, 49, 0.16)', ring: 'rgba(221, 0, 49, 0.34)', glow: 'rgba(221, 0, 49, 0.24)' },
    responsiveui: { slug: 'html5', iconHex: 'E34F26', tint: 'rgba(227, 79, 38, 0.16)', ring: 'rgba(227, 79, 38, 0.35)', glow: 'rgba(227, 79, 38, 0.22)' },
    scss: { slug: 'sass', iconHex: 'CC6699', tint: 'rgba(204, 102, 153, 0.17)', ring: 'rgba(204, 102, 153, 0.35)', glow: 'rgba(204, 102, 153, 0.25)' },
    flexbox: { slug: 'css', iconHex: '1572B6', tint: 'rgba(21, 114, 182, 0.17)', ring: 'rgba(21, 114, 182, 0.36)', glow: 'rgba(21, 114, 182, 0.24)' },
    gridlayout: { slug: 'css', iconHex: '1572B6', tint: 'rgba(21, 114, 182, 0.17)', ring: 'rgba(21, 114, 182, 0.36)', glow: 'rgba(21, 114, 182, 0.24)' },
    nodejs: { slug: 'nodedotjs', iconHex: '339933', tint: 'rgba(51, 153, 51, 0.17)', ring: 'rgba(51, 153, 51, 0.36)', glow: 'rgba(51, 153, 51, 0.25)' },
    restapis: { slug: 'openapiinitiative', iconHex: '6BA539', tint: 'rgba(107, 165, 57, 0.17)', ring: 'rgba(107, 165, 57, 0.34)', glow: 'rgba(107, 165, 57, 0.24)' },
    angular: { slug: 'angular', iconHex: 'DD0031', tint: 'rgba(221, 0, 49, 0.16)', ring: 'rgba(221, 0, 49, 0.34)', glow: 'rgba(221, 0, 49, 0.24)' },
    nestjs: { slug: 'nestjs', iconHex: 'E0234E', tint: 'rgba(224, 35, 78, 0.16)', ring: 'rgba(224, 35, 78, 0.34)', glow: 'rgba(224, 35, 78, 0.24)' },
    sqlserver: { slug: 'sqlite', iconHex: '003B57', tint: 'rgba(0, 59, 87, 0.18)', ring: 'rgba(0, 59, 87, 0.35)', glow: 'rgba(0, 59, 87, 0.25)' },
    postgresql: { slug: 'postgresql', iconHex: '4169E1', tint: 'rgba(65, 105, 225, 0.17)', ring: 'rgba(65, 105, 225, 0.36)', glow: 'rgba(65, 105, 225, 0.24)' },
    mongodb: { slug: 'mongodb', iconHex: '47A248', tint: 'rgba(71, 162, 72, 0.16)', ring: 'rgba(71, 162, 72, 0.35)', glow: 'rgba(71, 162, 72, 0.24)' },
    aspnetcore: { slug: 'dotnet', iconHex: '512BD4', tint: 'rgba(81, 43, 212, 0.17)', ring: 'rgba(81, 43, 212, 0.35)', glow: 'rgba(81, 43, 212, 0.24)' },
    net6: { slug: 'dotnet', iconHex: '512BD4', tint: 'rgba(81, 43, 212, 0.17)', ring: 'rgba(81, 43, 212, 0.35)', glow: 'rgba(81, 43, 212, 0.24)' },
    xamarin: { slug: 'dotnet', iconHex: '512BD4', tint: 'rgba(81, 43, 212, 0.17)', ring: 'rgba(81, 43, 212, 0.35)', glow: 'rgba(81, 43, 212, 0.24)' },
    confluentkafka: { slug: 'apachekafka', iconHex: '231F20', tint: 'rgba(35, 31, 32, 0.16)', ring: 'rgba(35, 31, 32, 0.34)', glow: 'rgba(35, 31, 32, 0.24)' },
    docker: { slug: 'docker', iconHex: '2496ED', tint: 'rgba(36, 150, 237, 0.16)', ring: 'rgba(36, 150, 237, 0.35)', glow: 'rgba(36, 150, 237, 0.24)' },
    kubernetes: { slug: 'kubernetes', iconHex: '326CE5', tint: 'rgba(50, 108, 229, 0.16)', ring: 'rgba(50, 108, 229, 0.35)', glow: 'rgba(50, 108, 229, 0.24)' },
    jenkins: { slug: 'jenkins', iconHex: 'D24939', tint: 'rgba(210, 73, 57, 0.16)', ring: 'rgba(210, 73, 57, 0.35)', glow: 'rgba(210, 73, 57, 0.24)' },
    argocd: { slug: 'argo', iconHex: 'EF7B4D', tint: 'rgba(239, 123, 77, 0.17)', ring: 'rgba(239, 123, 77, 0.35)', glow: 'rgba(239, 123, 77, 0.25)' },
    agile: { slug: 'scrumalliance', iconHex: '009FDA', tint: 'rgba(0, 159, 218, 0.16)', ring: 'rgba(0, 159, 218, 0.35)', glow: 'rgba(0, 159, 218, 0.24)' },
    angulartypescript: { slug: 'angular', iconHex: 'DD0031', tint: 'rgba(221, 0, 49, 0.16)', ring: 'rgba(221, 0, 49, 0.34)', glow: 'rgba(221, 0, 49, 0.24)' },
    nestjstypescript: { slug: 'nestjs', iconHex: 'E0234E', tint: 'rgba(224, 35, 78, 0.16)', ring: 'rgba(224, 35, 78, 0.34)', glow: 'rgba(224, 35, 78, 0.24)' },
    aspnetc: { slug: 'dotnet', iconHex: '512BD4', tint: 'rgba(81, 43, 212, 0.17)', ring: 'rgba(81, 43, 212, 0.35)', glow: 'rgba(81, 43, 212, 0.24)' },
    netc: { slug: 'dotnet', iconHex: '512BD4', tint: 'rgba(81, 43, 212, 0.17)', ring: 'rgba(81, 43, 212, 0.35)', glow: 'rgba(81, 43, 212, 0.24)' },
    hyperledgerfabric: { slug: 'blockchaindotcom', iconHex: '0E5CAD', tint: 'rgba(14, 92, 173, 0.16)', ring: 'rgba(14, 92, 173, 0.35)', glow: 'rgba(14, 92, 173, 0.24)' },
    linuxcommands: { slug: 'linux', iconHex: 'FCC624', tint: 'rgba(252, 198, 36, 0.2)', ring: 'rgba(143, 112, 20, 0.38)', glow: 'rgba(166, 129, 24, 0.22)' },
    versioncontrolgit: { slug: 'git', iconHex: 'F05032', tint: 'rgba(240, 80, 50, 0.16)', ring: 'rgba(240, 80, 50, 0.36)', glow: 'rgba(240, 80, 50, 0.24)' },
    projectmanagementjira: { slug: 'jira', iconHex: '0052CC', tint: 'rgba(0, 82, 204, 0.16)', ring: 'rgba(0, 82, 204, 0.34)', glow: 'rgba(0, 82, 204, 0.24)' }
  };

  private readonly companyLogoMap: Record<string, CompanyLogoSpec> = {
    thaibeveragepubliccompanylimited: {
      logoUrl: 'https://www.thaibev.com/images/logo.svg',
      tint: 'rgba(153, 186, 80, 0.36)'
    },
    mscsittipolcoltd: {
      logoUrl: 'https://static.jobtopgun.com/company_image/120/239028/logo_com_job/j239028.gif?time=20241220080609',
      tint: 'rgba(0, 120, 160, 0.3)'
    },
    sirisoftpubliccompanylimited: {
      logoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRlT_CeQLxjzkht-KLbZpX4T2m_A-dfioYhA&s',
      tint: 'rgba(220, 70, 98, 0.28)'
    },
    bekothaicoltd: {
      logoUrl: 'https://www.jobtopgun.com/content/filejobtopgun/image/13/25247/logo_com_job/j25247.gif',
      tint: 'rgba(54, 143, 228, 0.3)'
    },
    clicknextcoltd: {
      logoUrl: 'https://image.makewebeasy.net/makeweb/m_480x240/dVrJscvNm/Home/clicknext-logo-svg.png?v=202405291424',
      tint: 'rgba(72, 177, 226, 0.3)'
    },
    buraphauniversity: {
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Logo_of_Burapha_University.svg',
      tint: 'rgba(231, 141, 51, 0.3)'
    }
  };

  constructor(private readonly portfolioService: PortfolioService) {}

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

  get experienceYears(): number {
    const firstProfessionalYear = 2021;
    return Math.max(1, new Date().getFullYear() - firstProfessionalYear);
  }

  getToolVisual(tool: string): ToolVisual {
    const key = tool.trim().toLowerCase();
    const cached = this.toolVisualCache[key];
    if (cached) {
      return cached;
    }

    const normalized = this.normalizeToolKey(tool);
    const spec = this.toolLogoMap[normalized];
    const visual: ToolVisual = spec
      ? {
          iconUrl: `https://cdn.simpleicons.org/${spec.slug}/${spec.iconHex}`,
          tint: spec.tint,
          ring: spec.ring,
          glow: spec.glow,
          fallback: this.getFallbackLabel(tool)
        }
      : {
          iconUrl: null,
          tint: 'rgba(35, 69, 98, 0.16)',
          ring: 'rgba(35, 69, 98, 0.33)',
          glow: 'rgba(35, 69, 98, 0.2)',
          fallback: this.getFallbackLabel(tool)
        };

    this.toolVisualCache[key] = visual;
    return visual;
  }

  onToolLogoError(tool: string): void {
    const key = tool.trim().toLowerCase();
    const cached = this.toolVisualCache[key];
    if (cached) {
      cached.iconUrl = null;
    }
  }

  getCompanyVisual(company: string): CompanyVisual {
    const key = company.trim().toLowerCase();
    const cached = this.companyVisualCache[key];
    if (cached) {
      return cached;
    }

    const normalized = this.normalizeToolKey(company);
    const spec = this.companyLogoMap[normalized];
    const visual: CompanyVisual = spec
      ? { logoUrl: spec.logoUrl, tint: spec.tint }
      : { logoUrl: null, tint: 'rgba(35, 69, 98, 0.2)' };

    this.companyVisualCache[key] = visual;
    return visual;
  }

  private normalizeToolKey(value: string): string {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, '');
  }

  private getFallbackLabel(value: string): string {
    return value
      .replace(/[^a-zA-Z0-9 ]+/g, ' ')
      .trim()
      .split(/\s+/)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('')
      .slice(0, 3);
  }
}

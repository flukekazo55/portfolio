export interface ExperienceEntry {
  title: string;
  company: string;
  period: string;
  bullets: string[];
}

export interface EducationEntry {
  institution: string;
  degree: string;
  period: string;
  gpa: string;
  bullets: string[];
}

export interface Skills {
  personal: string[];
  programming: {
    languages: string[];
    frameworks: string[];
    others: string[];
  };
}

export interface Profile {
  name: string;
  role: string;
  tagline: string;
  summary: string;
  location: string;
  email: string;
  phone: string;
  linkedin: string;
}

export interface PortfolioData {
  profile: Profile;
  skills: Skills;
  experience: ExperienceEntry[];
  internship: ExperienceEntry[];
  education: EducationEntry[];
  certificates: string[];
}

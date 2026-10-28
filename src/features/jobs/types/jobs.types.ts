export interface Coordinate {
  latitude: number;
  longitude: number;
}

// One pin per company per city, so `id` is the pin's key and `companyId` the company's.
export interface MapCompany {
  id: string;
  companyId: string;
  name: string;
  city: string;
  isVerified: boolean;
  coordinate: Coordinate;
  openJobCount: number;
}

export type EmploymentType = 'fullTime' | 'partTime' | 'internship' | 'contract';

export type WorkMode = 'onSite' | 'remote' | 'hybrid';

export interface JobListing {
  id: string;
  title: string;
  company: { id: string; name: string; logoUrl: string | null; isVerified: boolean };
  city: string;
  coordinate: Coordinate;
  employmentType: EmploymentType;
  workMode: WorkMode;
  experienceYears: { min: number; max: number | null };
  salaryLpa: { min: number; max: number } | null;
  postedAt: Date;
  distanceKm: number | null;
  skills: { id: string; name: string; slug: string }[];
}

export type JobSort = 'newest' | 'oldest' | 'salary';

export type PostedAge = '0-3' | '3-7' | '7-15' | '15-30' | '30+';

export interface JobListFilters {
  search?: string;
  verifiedOnly?: boolean;
  last24Hours?: boolean;
  lastWeek?: boolean;
  postedAge?: PostedAge;
  near?: { coordinate: Coordinate; radiusKm: number };
  title?: string;
  skillSlugs?: string[];
  companyIds?: string[];
  city?: string;
  cities?: string[];
  titles?: string[];
  experienceYears?: number;
}

export interface JobListingsPage {
  jobs: JobListing[];
  page: number;
  pageSize: number;
  total: number;
}

export interface JobFilterOptions {
  cities: { name: string; jobCount: number }[];
  titles: { name: string; jobCount: number }[];
  skills: { slug: string; name: string; jobCount: number }[];
  companies: { id: string; name: string; isVerified: boolean; jobCount: number }[];
}

export type JobFilterSection = 'location' | 'country' | 'jobTitle' | 'company' | 'experience' | 'aging' | 'skills';

export type JobsSection = 'recommended' | 'allJobs' | 'saved' | 'applied';

export type JobsViewMode = 'map' | 'list';

export type LocationErrorCode = 'notFound' | 'permissionDenied' | 'unknown';

export class LocationError extends Error {
  constructor(public readonly code: LocationErrorCode) {
    super(code);
    this.name = 'LocationError';
  }
}

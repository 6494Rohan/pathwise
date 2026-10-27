export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface MapCompany {
  id: string;
  name: string;
  coordinate: Coordinate;
  openJobCount: number;
}

export type EmploymentType = 'fullTime' | 'partTime' | 'internship' | 'contract';

export interface JobPosting {
  id: string;
  title: string;
  location: string;
  employmentType: EmploymentType;
  salaryLpa: { min: number; max: number } | null;
}

export type JobsSection = 'recommended' | 'allJobs' | 'saved' | 'applied';

export type JobsViewMode = 'map' | 'list';

export type PlaceSearchErrorCode = 'notFound' | 'permissionDenied' | 'unknown';

export class PlaceSearchError extends Error {
  constructor(public readonly code: PlaceSearchErrorCode) {
    super(code);
    this.name = 'PlaceSearchError';
  }
}

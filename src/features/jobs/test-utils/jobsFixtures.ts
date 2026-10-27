import type { JobListing, MapCompany } from '../types/jobs.types';

export const mapCompany = (overrides: Partial<MapCompany> = {}): MapCompany => {
  const companyId = overrides.companyId ?? 'c1';
  const city = overrides.city ?? 'Udupi';
  return {
    id: `${companyId}:${city}`,
    companyId,
    name: 'Axis Bank',
    city,
    isVerified: true,
    coordinate: { latitude: 13.34, longitude: 74.9 },
    openJobCount: 1,
    ...overrides,
  };
};

export const jobListing = (overrides: Partial<JobListing> = {}): JobListing => ({
  id: 'l1',
  title: 'Frontend Developer',
  company: { id: 'c1', name: 'Robosoft Technologies', logoUrl: null, isVerified: true },
  city: 'Udupi',
  coordinate: { latitude: 13.34, longitude: 74.74 },
  employmentType: 'fullTime',
  workMode: 'hybrid',
  experienceYears: { min: 1, max: 3 },
  salaryLpa: { min: 3.5, max: 5 },
  postedAt: new Date(),
  distanceKm: null,
  skills: [{ id: 's1', name: 'React', slug: 'react' }],
  ...overrides,
});

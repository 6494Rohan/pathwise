import {
  EmploymentType,
  JobFilterOptions,
  JobListFilters,
  JobListing,
  JobListingsPage,
  JobSort,
  MapCompany,
  WorkMode,
} from '../types/jobs.types';
import {
  JobFilterOptionsResponseDtoSchema,
  JobFilterParamsDto,
  JobListItemDto,
  JobMapPinsResponseDtoSchema,
  JobsPageResponseDtoSchema,
  JobsQueryParamsDto,
} from './jobs.dto';

const employmentTypes: Record<JobListItemDto['job_type'], EmploymentType> = {
  full_time: 'fullTime',
  part_time: 'partTime',
  internship: 'internship',
  contract: 'contract',
};

const workModes: Record<JobListItemDto['work_mode'], WorkMode> = {
  on_site: 'onSite',
  remote: 'remote',
  hybrid: 'hybrid',
};

const salaryOf = (min: number | null, max: number | null) => (min !== null && max !== null ? { min, max } : null);

export const toMapCompanies = (raw: unknown): MapCompany[] =>
  JobMapPinsResponseDtoSchema.parse(raw).pins.map((pin) => ({
    id: `${pin.company_id}:${pin.city}`,
    companyId: pin.company_id,
    name: pin.company_name,
    city: pin.city,
    isVerified: pin.is_verified,
    coordinate: { latitude: pin.lat, longitude: pin.lng },
    openJobCount: pin.open_jobs_count,
  }));

const toJobListing = (job: JobListItemDto): JobListing => ({
  id: job.job_id,
  title: job.job_title,
  company: {
    id: job.company.company_id,
    name: job.company.company_name,
    logoUrl: job.company.logo_url,
    isVerified: job.company.is_verified,
  },
  city: job.city,
  coordinate: { latitude: job.lat, longitude: job.lng },
  employmentType: employmentTypes[job.job_type],
  workMode: workModes[job.work_mode],
  experienceYears: { min: job.min_experience_years, max: job.max_experience_years },
  salaryLpa: salaryOf(job.min_ctc_lpa, job.max_ctc_lpa),
  postedAt: new Date(job.posted_at),
  distanceKm: job.distance_km,
  skills: job.skills.map((skill) => ({ id: skill.skill_id, name: skill.skill_name, slug: skill.slug })),
});

export const toJobListingsPage = (raw: unknown): JobListingsPage => {
  const dto = JobsPageResponseDtoSchema.parse(raw);
  return { jobs: dto.jobs.map(toJobListing), page: dto.page, pageSize: dto.page_size, total: dto.total };
};

export const toJobFilterParams = (filters: JobListFilters): JobFilterParamsDto => ({
  ...(filters.search?.trim() && { q: filters.search.trim() }),
  ...(filters.verifiedOnly && { verified: 'true' }),
  ...(filters.last24Hours && { last24Hours: 'true' }),
  ...(filters.lastWeek && { lastWeek: 'true' }),
  ...(filters.postedAge && { age: filters.postedAge }),
  ...(filters.near && {
    lat: filters.near.coordinate.latitude,
    lng: filters.near.coordinate.longitude,
    radiusKm: filters.near.radiusKm,
  }),
  ...(filters.title?.trim() && { title: filters.title.trim() }),
  ...(filters.skillSlugs?.length && { skills: filters.skillSlugs.join(',') }),
  ...(filters.companyIds?.length && { companies: filters.companyIds.join(',') }),
  ...(filters.city && { city: filters.city }),
  ...(filters.cities?.length && { cities: filters.cities.join(',') }),
  ...(filters.titles?.length && { titles: filters.titles.join(',') }),
  ...(filters.experienceYears !== undefined && { experience: filters.experienceYears }),
});

export const toJobsQueryParams = (
  filters: JobListFilters,
  page: number,
  pageSize: number,
  sort?: JobSort
): JobsQueryParamsDto => ({
  ...toJobFilterParams(filters),
  // Newest is the API's default order, so it isn't sent.
  ...(sort && sort !== 'newest' && { sort }),
  page,
  pageSize,
});

export const toJobFilterOptions = (raw: unknown): JobFilterOptions => {
  const dto = JobFilterOptionsResponseDtoSchema.parse(raw);
  return {
    cities: dto.cities.map((city) => ({ name: city.city, jobCount: city.job_count })),
    titles: dto.titles.map((title) => ({ name: title.job_title, jobCount: title.job_count })),
    skills: dto.skills.map((skill) => ({ slug: skill.slug, name: skill.skill_name, jobCount: skill.job_count })),
    companies: dto.companies.map((company) => ({
      id: company.company_id,
      name: company.company_name,
      isVerified: company.is_verified,
      jobCount: company.job_count,
    })),
  };
};

import { EmploymentType, JobPosting, MapCompany } from '../types/jobs.types';
import { CompanyJobsResponseDto, CompanyJobsResponseDtoSchema, MapCompaniesResponseDtoSchema } from './jobs.dto';

const employmentTypes: Record<CompanyJobsResponseDto['jobs'][number]['job_type'], EmploymentType> = {
  FULL_TIME: 'fullTime',
  PART_TIME: 'partTime',
  INTERNSHIP: 'internship',
  CONTRACT: 'contract',
};

export const toMapCompanies = (raw: unknown): MapCompany[] =>
  MapCompaniesResponseDtoSchema.parse(raw).companies.map((company) => ({
    id: company.company_id,
    name: company.company_name,
    coordinate: { latitude: company.lat, longitude: company.lng },
    openJobCount: company.open_jobs_count,
  }));

export const toJobPostings = (raw: unknown): JobPosting[] =>
  CompanyJobsResponseDtoSchema.parse(raw).jobs.map((job) => ({
    id: job.job_id,
    title: job.job_title,
    location: job.city,
    employmentType: employmentTypes[job.job_type],
    salaryLpa: job.min_ctc_lpa !== null && job.max_ctc_lpa !== null ? { min: job.min_ctc_lpa, max: job.max_ctc_lpa } : null,
  }));

import { z } from 'zod';

export const JobMapPinsResponseDtoSchema = z.object({
  pins: z.array(
    z.object({
      company_id: z.string(),
      company_name: z.string(),
      is_verified: z.boolean(),
      city: z.string(),
      lat: z.number(),
      lng: z.number(),
      open_jobs_count: z.number().int().nonnegative(),
    })
  ),
});

const JobListItemDtoSchema = z.object({
  job_id: z.string(),
  job_title: z.string(),
  job_type: z.enum(['full_time', 'part_time', 'internship', 'contract']),
  work_mode: z.enum(['on_site', 'remote', 'hybrid']),
  city: z.string(),
  lat: z.number(),
  lng: z.number(),
  min_experience_years: z.number().int(),
  max_experience_years: z.number().int().nullable(),
  min_ctc_lpa: z.number().nullable(),
  max_ctc_lpa: z.number().nullable(),
  posted_at: z.iso.datetime({ offset: true }),
  distance_km: z.number().nullable(),
  company: z.object({
    company_id: z.string(),
    company_name: z.string(),
    logo_url: z.string().nullable(),
    is_verified: z.boolean(),
  }),
  skills: z.array(z.object({ skill_id: z.string(), skill_name: z.string(), slug: z.string() })),
});

export const JobsPageResponseDtoSchema = z.object({
  jobs: z.array(JobListItemDtoSchema),
  page: z.number().int(),
  page_size: z.number().int(),
  total: z.number().int().nonnegative(),
});

export const JobFilterOptionsResponseDtoSchema = z.object({
  skills: z.array(z.object({ skill_id: z.string(), skill_name: z.string(), slug: z.string(), job_count: z.number().int() })),
  companies: z.array(
    z.object({ company_id: z.string(), company_name: z.string(), is_verified: z.boolean(), job_count: z.number().int() })
  ),
});

export type JobListItemDto = z.infer<typeof JobListItemDtoSchema>;

export interface JobFilterParamsDto {
  q?: string;
  verified?: 'true';
  last24Hours?: 'true';
  age?: '0-3' | '3-7' | '7-15' | '15-30' | '30+';
  lat?: number;
  lng?: number;
  radiusKm?: number;
  title?: string;
  skills?: string;
  companies?: string;
  city?: string;
  experience?: number;
}

export interface JobsQueryParamsDto extends JobFilterParamsDto {
  page: number;
  pageSize: number;
  sort?: 'newest' | 'oldest' | 'salary';
}

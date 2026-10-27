import { z } from 'zod';

export const MapCompaniesResponseDtoSchema = z.object({
  companies: z.array(
    z.object({
      company_id: z.string(),
      company_name: z.string(),
      lat: z.number(),
      lng: z.number(),
      open_jobs_count: z.number().int().nonnegative(),
    })
  ),
});

export const CompanyJobsResponseDtoSchema = z.object({
  jobs: z.array(
    z.object({
      job_id: z.string(),
      job_title: z.string(),
      city: z.string(),
      job_type: z.enum(['FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'CONTRACT']),
      min_ctc_lpa: z.number().nullable(),
      max_ctc_lpa: z.number().nullable(),
    })
  ),
});

export type MapCompaniesResponseDto = z.infer<typeof MapCompaniesResponseDtoSchema>;
export type CompanyJobsResponseDto = z.infer<typeof CompanyJobsResponseDtoSchema>;

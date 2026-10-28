import { z } from 'zod';

const yearMonth = z.string().regex(/^\d{4}-\d{2}$/);

export const ProfileResponseDtoSchema = z.object({
  profile_code: z.string(),
  plan: z.enum(['guest', 'pro']),
  full_name: z.string().nullable(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  current_designation: z.string().nullable(),
  current_location: z.string().nullable(),
  preferred_locations: z.array(z.string()),
  skills: z.array(z.string()),
  resume: z
    .object({ file_name: z.string(), file_type: z.literal('pdf'), size_bytes: z.number(), uploaded_at: z.iso.datetime() })
    .nullable(),
  experiences: z.array(
    z.object({
      id: z.string(),
      designation: z.string(),
      company_name: z.string(),
      start_month: yearMonth.nullable(),
      end_month: yearMonth.nullable(),
      description: z.string().nullable(),
    })
  ),
  educations: z.array(
    z.object({
      id: z.string(),
      institution: z.string(),
      degree: z.string().nullable(),
      start_month: yearMonth.nullable(),
      end_month: yearMonth.nullable(),
    })
  ),
});

export type ProfileResponseDto = z.infer<typeof ProfileResponseDtoSchema>;

export const ResumeUploadUrlDtoSchema = z.object({
  url: z.url(),
  fields: z.record(z.string(), z.string()),
  file_key: z.string(),
  max_bytes: z.number(),
  expires_in_seconds: z.number(),
});

export const ResumeDownloadUrlDtoSchema = z.object({ url: z.url(), file_name: z.string() });

export interface ParseResumeRequestDto {
  file_key: string;
  file_name: string;
}

export const ApiErrorDtoSchema = z.object({ error: z.string() });

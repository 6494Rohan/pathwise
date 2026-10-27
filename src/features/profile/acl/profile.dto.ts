import { z } from 'zod';

const yearMonth = z.string().regex(/^\d{4}-\d{2}$/);

export const ProfileResponseDtoSchema = z.object({
  profile_code: z.string(),
  plan: z.enum(['GUEST', 'PRO']),
  full_name: z.string(),
  email: z.string(),
  current_designation: z.string().nullable(),
  current_location: z.string(),
  preferred_locations: z.array(z.string()),
  resume: z.object({ file_name: z.string(), file_type: z.enum(['PDF', 'DOC']) }).nullable(),
  experiences: z.array(
    z.object({
      id: z.string(),
      designation: z.string(),
      company_name: z.string(),
      start_date: yearMonth,
      end_date: yearMonth.nullable(),
      description: z.string().nullable(),
    })
  ),
  educations: z.array(
    z.object({
      id: z.string(),
      institution: z.string(),
      degree: z.string(),
      start_date: yearMonth,
      end_date: yearMonth.nullable(),
    })
  ),
});

export type ProfileResponseDto = z.infer<typeof ProfileResponseDtoSchema>;

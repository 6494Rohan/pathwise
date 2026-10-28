import type { PickedResume, Profile, ResumeDownload, ResumeErrorCode, ResumeUploadTarget } from '../types/profile.types';
import {
  ApiErrorDtoSchema,
  ParseResumeRequestDto,
  ProfileResponseDtoSchema,
  ResumeDownloadUrlDtoSchema,
  ResumeUploadUrlDtoSchema,
} from './profile.dto';

export const toProfile = (raw: unknown): Profile => {
  const dto = ProfileResponseDtoSchema.parse(raw);
  return {
    code: dto.profile_code,
    plan: dto.plan === 'pro' ? 'pro' : 'free',
    name: dto.full_name,
    email: dto.email,
    phone: dto.phone,
    currentRole: dto.current_designation,
    location: dto.current_location,
    preferredLocations: dto.preferred_locations,
    skills: dto.skills,
    resume: dto.resume ? { fileName: dto.resume.file_name, format: dto.resume.file_type } : null,
    experience: dto.experiences.map((job) => ({
      id: job.id,
      title: job.designation,
      subtitle: job.company_name,
      startMonth: job.start_month,
      endMonth: job.end_month,
      description: job.description,
    })),
    education: dto.educations.map((school) => ({
      id: school.id,
      title: school.institution,
      subtitle: school.degree,
      startMonth: school.start_month,
      endMonth: school.end_month,
      description: null,
    })),
  };
};

export const toResumeUploadTarget = (raw: unknown): ResumeUploadTarget => {
  const dto = ResumeUploadUrlDtoSchema.parse(raw);
  return { url: dto.url, fields: dto.fields, fileKey: dto.file_key };
};

export const toResumeDownload = (raw: unknown): ResumeDownload => {
  const dto = ResumeDownloadUrlDtoSchema.parse(raw);
  return { url: dto.url, fileName: dto.file_name };
};

export const toParseResumeRequest = (fileKey: string, file: PickedResume): ParseResumeRequestDto => ({
  file_key: fileKey,
  file_name: file.name,
});

const RESUME_ERROR_CODES: Record<string, ResumeErrorCode> = {
  too_large: 'tooLarge',
  too_many_pages: 'tooManyPages',
  not_pdf: 'notPdf',
  encrypted: 'locked',
  not_a_resume: 'notResume',
  unreadable: 'unreadable',
  parse_limit: 'dailyLimit',
  parser_unavailable: 'busy',
};

export const toResumeErrorCode = (errorBody: unknown): ResumeErrorCode => {
  const dto = ApiErrorDtoSchema.safeParse(errorBody);
  return (dto.success && RESUME_ERROR_CODES[dto.data.error]) || 'unknown';
};

import type { Profile } from '../types/profile.types';
import { ProfileResponseDtoSchema } from './profile.dto';

export const toProfile = (raw: unknown): Profile => {
  const dto = ProfileResponseDtoSchema.parse(raw);
  return {
    code: dto.profile_code,
    plan: dto.plan === 'PRO' ? 'pro' : 'guest',
    name: dto.full_name,
    email: dto.email,
    currentRole: dto.current_designation,
    location: dto.current_location,
    preferredLocations: dto.preferred_locations,
    resume: dto.resume ? { fileName: dto.resume.file_name, format: dto.resume.file_type === 'PDF' ? 'pdf' : 'doc' } : null,
    experience: dto.experiences.map((job) => ({
      id: job.id,
      title: job.designation,
      subtitle: job.company_name,
      startMonth: job.start_date,
      endMonth: job.end_date,
      description: job.description,
    })),
    education: dto.educations.map((school) => ({
      id: school.id,
      title: school.institution,
      subtitle: school.degree,
      startMonth: school.start_date,
      endMonth: school.end_date,
      description: null,
    })),
  };
};

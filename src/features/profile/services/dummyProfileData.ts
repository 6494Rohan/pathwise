import type { ProfileResponseDto } from '../acl/profile.dto';

export const dummyProfileResponse: ProfileResponseDto = {
  profile_code: 'MCSQ9387',
  plan: 'GUEST',
  full_name: 'Aarav Menon',
  email: 'aarav.menon@email.com',
  current_designation: null,
  current_location: 'Mangaluru, Karnataka, India',
  preferred_locations: ['Bengaluru, Karnataka, India'],
  resume: { file_name: 'Aarav_Menon_Resume.pdf', file_type: 'PDF' },
  experiences: [
    {
      id: 'e1',
      designation: 'Machine Learning Intern',
      company_name: 'Northwind Analytics',
      start_date: '2026-10',
      end_date: '2026-10',
      description: 'Built image-classification models using VGG networks.',
    },
  ],
  educations: [
    {
      id: 'ed1',
      institution: 'University of Massachusetts Amherst',
      degree: 'M.S. Computer Science',
      start_date: '2024-09',
      end_date: '2026-05',
    },
  ],
};

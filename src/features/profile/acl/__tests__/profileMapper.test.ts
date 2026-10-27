import { dummyProfileResponse } from '../../services/dummyProfileData';
import { toProfile } from '../profileMapper';

describe('toProfile', () => {
  it('maps the backend profile to our model', () => {
    const profile = toProfile(dummyProfileResponse);

    expect(profile).toEqual(
      expect.objectContaining({
        code: 'MCSQ9387',
        plan: 'guest',
        name: 'Aarav Menon',
        currentRole: null,
        preferredLocations: ['Bengaluru, Karnataka, India'],
        resume: { fileName: 'Aarav_Menon_Resume.pdf', format: 'pdf' },
      })
    );
    expect(profile.experience[0]).toEqual({
      id: 'e1',
      title: 'Machine Learning Intern',
      subtitle: 'Northwind Analytics',
      startMonth: '2026-10',
      endMonth: '2026-10',
      description: 'Built image-classification models using VGG networks.',
    });
    expect(profile.education[0]).toEqual(
      expect.objectContaining({ title: 'University of Massachusetts Amherst', subtitle: 'M.S. Computer Science', description: null })
    );
  });

  it('maps a pro plan, a DOC resume and no resume', () => {
    expect(toProfile({ ...dummyProfileResponse, plan: 'PRO' }).plan).toBe('pro');
    expect(toProfile({ ...dummyProfileResponse, resume: { file_name: 'cv.doc', file_type: 'DOC' } }).resume?.format).toBe('doc');
    expect(toProfile({ ...dummyProfileResponse, resume: null }).resume).toBeNull();
  });

  it('rejects a profile with badly formatted dates', () => {
    const experiences = [{ ...dummyProfileResponse.experiences[0], start_date: 'October 2026' }];

    expect(() => toProfile({ ...dummyProfileResponse, experiences })).toThrow();
  });
});

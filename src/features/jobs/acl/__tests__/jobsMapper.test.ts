import { toJobPostings, toMapCompanies } from '../jobsMapper';

describe('jobsMapper', () => {
  it('maps map companies to our model', () => {
    const raw = { companies: [{ company_id: 'c1', company_name: 'Axis Bank', lat: 13.5, lng: 75.1, open_jobs_count: 3 }] };

    expect(toMapCompanies(raw)).toEqual([
      { id: 'c1', name: 'Axis Bank', coordinate: { latitude: 13.5, longitude: 75.1 }, openJobCount: 3 },
    ]);
  });

  it('maps job postings, including types and salary', () => {
    const raw = {
      jobs: [
        { job_id: 'j1', job_title: 'Sales Executive', city: 'Udupi', job_type: 'FULL_TIME', min_ctc_lpa: 2.5, max_ctc_lpa: 4 },
        { job_id: 'j2', job_title: 'Marketing Intern', city: 'Udupi', job_type: 'INTERNSHIP', min_ctc_lpa: null, max_ctc_lpa: null },
      ],
    };

    expect(toJobPostings(raw)).toEqual([
      { id: 'j1', title: 'Sales Executive', location: 'Udupi', employmentType: 'fullTime', salaryLpa: { min: 2.5, max: 4 } },
      { id: 'j2', title: 'Marketing Intern', location: 'Udupi', employmentType: 'internship', salaryLpa: null },
    ]);
  });

  it('rejects responses that do not match the backend shape', () => {
    expect(() => toMapCompanies({ companies: [{ company_id: 'c1' }] })).toThrow();
    expect(() => toJobPostings({ jobs: [{ job_id: 'j1', job_type: 'FREELANCE' }] })).toThrow();
  });
});

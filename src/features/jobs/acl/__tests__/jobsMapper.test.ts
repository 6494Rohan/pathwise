import { toJobFilterOptions, toJobFilterParams, toJobListingsPage, toJobsQueryParams, toMapCompanies } from '../jobsMapper';

const listItem = {
  job_id: 'j1',
  job_title: 'Frontend Developer',
  job_type: 'full_time',
  work_mode: 'on_site',
  city: 'Udupi',
  lat: 13.34,
  lng: 74.74,
  min_experience_years: 1,
  max_experience_years: null,
  min_ctc_lpa: 3.5,
  max_ctc_lpa: 5,
  posted_at: '2026-10-27T10:00:00.000Z',
  distance_km: 2.1,
  company: { company_id: 'c1', company_name: 'Robosoft', logo_url: null, is_verified: true },
  skills: [{ skill_id: 's1', skill_name: 'React', slug: 'react' }],
};

describe('toMapCompanies', () => {
  it('maps each pin to a company-in-a-city', () => {
    const raw = {
      pins: [{ company_id: 'c1', company_name: 'Robosoft', is_verified: true, city: 'Udupi', lat: 13.3, lng: 74.7, open_jobs_count: 3 }],
    };

    expect(toMapCompanies(raw)).toEqual([
      {
        id: 'c1:Udupi',
        companyId: 'c1',
        name: 'Robosoft',
        city: 'Udupi',
        isVerified: true,
        coordinate: { latitude: 13.3, longitude: 74.7 },
        openJobCount: 3,
      },
    ]);
  });

  it('rejects pins without a position', () => {
    expect(() => toMapCompanies({ pins: [{ company_id: 'c1' }] })).toThrow();
  });
});

describe('toJobListingsPage', () => {
  it('maps a page of jobs to our model', () => {
    const page = toJobListingsPage({ jobs: [listItem], page: 1, page_size: 20, total: 41 });

    expect(page).toEqual({ jobs: [expect.any(Object)], page: 1, pageSize: 20, total: 41 });
    expect(page.jobs[0]).toEqual({
      id: 'j1',
      title: 'Frontend Developer',
      company: { id: 'c1', name: 'Robosoft', logoUrl: null, isVerified: true },
      city: 'Udupi',
      coordinate: { latitude: 13.34, longitude: 74.74 },
      employmentType: 'fullTime',
      workMode: 'onSite',
      experienceYears: { min: 1, max: null },
      salaryLpa: { min: 3.5, max: 5 },
      postedAt: new Date('2026-10-27T10:00:00.000Z'),
      distanceKm: 2.1,
      skills: [{ id: 's1', name: 'React', slug: 'react' }],
    });
  });

  it('treats a half-given salary as not disclosed', () => {
    const page = toJobListingsPage({ jobs: [{ ...listItem, max_ctc_lpa: null }], page: 1, page_size: 20, total: 1 });

    expect(page.jobs[0].salaryLpa).toBeNull();
  });

  it('rejects jobs the backend shaped differently', () => {
    expect(() => toJobListingsPage({ jobs: [{ ...listItem, job_type: 'freelance' }], page: 1, page_size: 20, total: 1 })).toThrow();
  });
});

describe('toJobFilterParams / toJobsQueryParams', () => {
  it('sends nothing for no filters, and paging for the list', () => {
    expect(toJobFilterParams({})).toEqual({});
    expect(toJobsQueryParams({}, 2, 20)).toEqual({ page: 2, pageSize: 20 });
  });

  it('sends the sort order, except the default newest', () => {
    expect(toJobsQueryParams({}, 1, 20, 'salary')).toEqual({ sort: 'salary', page: 1, pageSize: 20 });
    expect(toJobsQueryParams({}, 1, 20, 'newest')).toEqual({ page: 1, pageSize: 20 });
  });

  it('turns every filter into the backend parameter', () => {
    expect(
      toJobFilterParams({
        search: ' react ',
        verifiedOnly: true,
        last24Hours: true,
        postedAge: '3-7',
        near: { coordinate: { latitude: 13.3, longitude: 74.7 }, radiusKm: 10 },
        title: ' developer ',
        skillSlugs: ['react', 'python'],
        companyIds: ['c1', 'c2'],
        city: 'Udupi',
        experienceYears: 0,
      })
    ).toEqual({
      q: 'react',
      verified: 'true',
      last24Hours: 'true',
      age: '3-7',
      lat: 13.3,
      lng: 74.7,
      radiusKm: 10,
      title: 'developer',
      skills: 'react,python',
      companies: 'c1,c2',
      city: 'Udupi',
      experience: 0,
    });
  });

  it('leaves out switched-off and empty filters', () => {
    expect(toJobFilterParams({ search: ' ', verifiedOnly: false, title: '  ', skillSlugs: [], companyIds: [] })).toEqual({});
  });
});

describe('toJobFilterOptions', () => {
  it('maps skills and companies with their job counts', () => {
    const raw = {
      skills: [{ skill_id: 's1', skill_name: 'React', slug: 'react', job_count: 9 }],
      companies: [{ company_id: 'c1', company_name: 'Freshworks', is_verified: true, job_count: 8 }],
    };

    expect(toJobFilterOptions(raw)).toEqual({
      skills: [{ slug: 'react', name: 'React', jobCount: 9 }],
      companies: [{ id: 'c1', name: 'Freshworks', isVerified: true, jobCount: 8 }],
    });
  });
});

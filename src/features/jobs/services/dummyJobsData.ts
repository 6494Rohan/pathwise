import type { CompanyJobsResponseDto, MapCompaniesResponseDto } from '../acl/jobs.dto';

const companies = [
  { company_id: 'c1', company_name: 'Tata Motors Finance', lat: 13.6316, lng: 74.6901, city: 'Kundapura', open_jobs_count: 4 },
  { company_id: 'c2', company_name: 'Axis Bank', lat: 13.5562, lng: 75.0421, city: 'Hebri', open_jobs_count: 1 },
  { company_id: 'c3', company_name: 'Mulki Sundaram Shetty College', lat: 13.3409, lng: 74.7421, city: 'Udupi', open_jobs_count: 3 },
  { company_id: 'c4', company_name: 'Adani Career Site', lat: 13.3285, lng: 74.7562, city: 'Udupi', open_jobs_count: 10 },
  { company_id: 'c5', company_name: 'Manipal Health Enterprises', lat: 13.3525, lng: 74.7928, city: 'Manipal', open_jobs_count: 12 },
  { company_id: 'c6', company_name: 'Robosoft Technologies', lat: 13.3394, lng: 74.7465, city: 'Udupi', open_jobs_count: 6 },
  { company_id: 'c7', company_name: 'Kotak Mahindra Bank', lat: 13.0072, lng: 75.0712, city: 'Belthangady', open_jobs_count: 2 },
  { company_id: 'c8', company_name: 'Anjuman Arts Sci Commerce College', lat: 13.9849, lng: 74.5553, city: 'Bhatkal', open_jobs_count: 20 },
  { company_id: 'c9', company_name: 'Tata Capital', lat: 14.2147, lng: 75.2858, city: 'Shikaripura', open_jobs_count: 5 },
  { company_id: 'c10', company_name: 'Tata Motors Finance', lat: 13.9299, lng: 75.5681, city: 'Shivamogga', open_jobs_count: 17 },
  { company_id: 'c11', company_name: 'Infosys', lat: 12.8698, lng: 74.8426, city: 'Mangaluru', open_jobs_count: 15 },
  { company_id: 'c12', company_name: 'Discover Dollar', lat: 12.8716, lng: 74.8801, city: 'Mangaluru', open_jobs_count: 3 },
  { company_id: 'c13', company_name: 'MRPL', lat: 12.9877, lng: 74.8178, city: 'Mangaluru', open_jobs_count: 8 },
  { company_id: 'c14', company_name: 'Karnataka Bank', lat: 12.8889, lng: 74.8553, city: 'Mangaluru', open_jobs_count: 7 },
  { company_id: 'c15', company_name: 'Vivekananda College', lat: 12.7593, lng: 75.2024, city: 'Puttur', open_jobs_count: 2 },
  { company_id: 'c16', company_name: 'Bharat Beedi Works', lat: 13.2120, lng: 74.9952, city: 'Karkala', open_jobs_count: 1 },
  { company_id: 'c17', company_name: 'Sringeri Sharada Peetham Trust', lat: 13.4198, lng: 75.2567, city: 'Sringeri', open_jobs_count: 2 },
  { company_id: 'c18', company_name: 'Coastal Logistics', lat: 13.4320, lng: 74.7270, city: 'Brahmavar', open_jobs_count: 4 },
];

const jobTemplates = [
  { title: 'Customer Relationship Officer', job_type: 'FULL_TIME', min_ctc_lpa: 2.4, max_ctc_lpa: 3.6 },
  { title: 'Sales Executive', job_type: 'FULL_TIME', min_ctc_lpa: 2.5, max_ctc_lpa: 4 },
  { title: 'Junior Software Developer', job_type: 'FULL_TIME', min_ctc_lpa: 4, max_ctc_lpa: 7 },
  { title: 'Data Entry Operator', job_type: 'PART_TIME', min_ctc_lpa: 1.2, max_ctc_lpa: 1.8 },
  { title: 'Marketing Intern', job_type: 'INTERNSHIP', min_ctc_lpa: null, max_ctc_lpa: null },
  { title: 'Accounts Assistant', job_type: 'FULL_TIME', min_ctc_lpa: 2.2, max_ctc_lpa: 3 },
  { title: 'Field Technician', job_type: 'CONTRACT', min_ctc_lpa: 2, max_ctc_lpa: 2.8 },
  { title: 'Lecturer, Commerce', job_type: 'FULL_TIME', min_ctc_lpa: 3.5, max_ctc_lpa: 5 },
] as const;

export const dummyMapCompaniesResponse: MapCompaniesResponseDto = {
  companies: companies.map(({ city: _city, ...company }) => company),
};

export const dummyCompanyJobsResponse = (companyId: string): CompanyJobsResponseDto => {
  const company = companies.find(({ company_id }) => company_id === companyId);
  if (!company) return { jobs: [] };
  return {
    jobs: Array.from({ length: company.open_jobs_count }, (_, index) => {
      const template = jobTemplates[(Number(companyId.slice(1)) + index) % jobTemplates.length];
      return {
        job_id: `${companyId}-j${index + 1}`,
        job_title: template.title,
        city: company.city,
        job_type: template.job_type,
        min_ctc_lpa: template.min_ctc_lpa,
        max_ctc_lpa: template.max_ctc_lpa,
      };
    }),
  };
};

import React from 'react';
import { render, screen } from '@testing-library/react-native';
import type { JobPosting } from '../../types/jobs.types';
import JobPostingCard from '../JobPostingCard';

const job: JobPosting = {
  id: 'j1',
  title: 'Sales Executive',
  location: 'Udupi',
  employmentType: 'fullTime',
  salaryLpa: { min: 2.5, max: 4 },
};

describe('JobPostingCard', () => {
  it('shows the title, place, type and salary', async () => {
    await render(<JobPostingCard job={job} />);

    expect(screen.getByText('Sales Executive')).toBeOnTheScreen();
    expect(screen.getByText('Udupi · Full-time')).toBeOnTheScreen();
    expect(screen.getByText('₹2.5–4 LPA')).toBeOnTheScreen();
  });

  it('says when the salary is not disclosed', async () => {
    await render(<JobPostingCard job={{ ...job, employmentType: 'internship', salaryLpa: null }} />);

    expect(screen.getByText('Udupi · Internship')).toBeOnTheScreen();
    expect(screen.getByText('Salary not disclosed')).toBeOnTheScreen();
  });
});

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import ProfileSummaryCard from '../ProfileSummaryCard';

const props = {
  name: 'Aarav Menon',
  email: 'aarav.menon@email.com',
  currentRole: null,
  location: 'Mangaluru, Karnataka, India',
  preferredLocations: ['Bengaluru, Karnataka, India', 'Pune, Maharashtra, India'],
};

describe('ProfileSummaryCard', () => {
  it('shows initials, name, email, role, location and preferred locations', async () => {
    await render(<ProfileSummaryCard {...props} onEdit={jest.fn()} />);

    expect(screen.getByText('AM', { includeHiddenElements: true })).toBeOnTheScreen();
    expect(screen.getByRole('header', { name: 'Aarav Menon' })).toBeOnTheScreen();
    expect(screen.getByText('aarav.menon@email.com')).toBeOnTheScreen();
    expect(screen.getByText('N/A')).toBeOnTheScreen();
    expect(screen.getByText('Mangaluru, Karnataka, India')).toBeOnTheScreen();
    expect(screen.getByText('Bengaluru, Karnataka, India, Pune, Maharashtra, India')).toBeOnTheScreen();
  });

  it('shows the current role and reports edit presses', async () => {
    const onEdit = jest.fn();
    await render(<ProfileSummaryCard {...props} currentRole="Data Analyst" preferredLocations={[]} onEdit={onEdit} />);

    await fireEvent.press(screen.getByRole('button', { name: 'Edit profile' }));

    expect(screen.getByText('Data Analyst')).toBeOnTheScreen();
    expect(onEdit).toHaveBeenCalled();
  });
});

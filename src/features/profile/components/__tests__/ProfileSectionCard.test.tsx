import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import ProfileSectionCard from '../ProfileSectionCard';

const entry = {
  id: 'e1',
  title: 'Machine Learning Intern',
  subtitle: 'Northwind Analytics',
  startMonth: '2026-10',
  endMonth: null,
  description: 'Built image-classification models.',
};

describe('ProfileSectionCard', () => {
  it('lists entries with their period and reports add and edit', async () => {
    const onAdd = jest.fn();
    const onEdit = jest.fn();
    await render(<ProfileSectionCard title="Experience" entries={[entry]} onAdd={onAdd} onEdit={onEdit} />);

    await fireEvent.press(screen.getByRole('button', { name: 'Add Experience' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Edit Experience' }));

    expect(screen.getByRole('header', { name: 'Experience' })).toBeOnTheScreen();
    expect(screen.getByText('Machine Learning Intern')).toBeOnTheScreen();
    expect(screen.getByText('Northwind Analytics')).toBeOnTheScreen();
    expect(screen.getByText('Oct 2026 – Present')).toBeOnTheScreen();
    expect(screen.getByText('Built image-classification models.')).toBeOnTheScreen();
    expect(onAdd).toHaveBeenCalled();
    expect(onEdit).toHaveBeenCalled();
  });

  it('shows a finished period and says when the section is empty', async () => {
    const view = await render(
      <ProfileSectionCard
        title="Education"
        entries={[{ ...entry, endMonth: '2027-05', description: null }]}
        onAdd={jest.fn()}
        onEdit={jest.fn()}
      />
    );
    expect(screen.getByText('Oct 2026 – May 2027')).toBeOnTheScreen();

    await view.rerender(<ProfileSectionCard title="Education" entries={[]} onAdd={jest.fn()} onEdit={jest.fn()} />);
    expect(screen.getByText('Nothing added yet.')).toBeOnTheScreen();
  });
});

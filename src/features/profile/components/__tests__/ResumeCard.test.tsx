import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import ResumeCard from '../ResumeCard';

describe('ResumeCard', () => {
  it('shows the resume and reports upload and download', async () => {
    const onUpload = jest.fn();
    const onDownload = jest.fn();
    await render(
      <ResumeCard resume={{ fileName: 'Aarav_Menon_Resume.pdf', format: 'pdf' }} onUpload={onUpload} onDownload={onDownload} />
    );

    await fireEvent.press(screen.getByRole('button', { name: 'Upload a new resume' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Download resume' }));

    expect(screen.getByText('Aarav_Menon_Resume.pdf')).toBeOnTheScreen();
    expect(screen.getByText('PDF · Resume')).toBeOnTheScreen();
    expect(onUpload).toHaveBeenCalled();
    expect(onDownload).toHaveBeenCalled();
  });

  it('offers only upload when there is no resume', async () => {
    await render(<ResumeCard resume={null} onUpload={jest.fn()} onDownload={jest.fn()} />);

    expect(screen.getByText('No resume yet')).toBeOnTheScreen();
    expect(screen.queryByRole('button', { name: 'Download resume' })).not.toBeOnTheScreen();
  });
});

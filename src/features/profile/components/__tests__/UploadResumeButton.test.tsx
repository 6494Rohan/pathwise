import React from 'react';
import { Alert } from 'react-native';
import { fireEvent, render, screen } from '@testing-library/react-native';
import UploadResumeButton from '../UploadResumeButton';

describe('UploadResumeButton', () => {
  it('says resume upload is coming soon', async () => {
    const alert = jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());
    await render(<UploadResumeButton />);

    await fireEvent.press(screen.getByRole('button', { name: 'Upload Resume' }));

    expect(alert).toHaveBeenCalledWith('Upload Resume', 'Coming soon');
  });
});

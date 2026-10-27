import React from 'react';
import { Share } from 'react-native';
import { fireEvent, render, screen } from '@testing-library/react-native';
import ShareAppButton from '../ShareAppButton';

describe('ShareAppButton', () => {
  it('opens the share sheet with the invite message', async () => {
    const share = jest.spyOn(Share, 'share').mockResolvedValue({ action: Share.sharedAction, activityType: undefined });
    await render(<ShareAppButton />);

    await fireEvent.press(screen.getByRole('button', { name: 'Share' }));

    expect(share).toHaveBeenCalledWith({ message: 'Find jobs, build skills and keep learning on pathwise.' });
  });
});

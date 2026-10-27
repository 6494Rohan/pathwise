import React from 'react';
import { Share } from 'react-native';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { env } from '@/config/env';
import ShareAppButton from '../ShareAppButton';

describe('ShareAppButton', () => {
  it('shares an invite with a link that opens the Jobs tab', async () => {
    const share = jest.spyOn(Share, 'share').mockResolvedValue({ action: Share.sharedAction, activityType: undefined });
    await render(<ShareAppButton />);

    await fireEvent.press(screen.getByRole('button', { name: 'Share' }));

    expect(share).toHaveBeenCalledWith({
      message: 'Find jobs, build skills and keep learning on pathwise: https://main.example.amplifyapp.com/jobs',
    });
  });

  it('shares the invite without a link when no web address is configured', async () => {
    const share = jest.spyOn(Share, 'share').mockResolvedValue({ action: Share.sharedAction, activityType: undefined });
    const webUrl = env.EXPO_PUBLIC_WEB_URL;
    env.EXPO_PUBLIC_WEB_URL = undefined;
    try {
      await render(<ShareAppButton />);
      await fireEvent.press(screen.getByRole('button', { name: 'Share' }));
    } finally {
      env.EXPO_PUBLIC_WEB_URL = webUrl;
    }

    expect(share).toHaveBeenCalledWith({ message: 'Find jobs, build skills and keep learning on pathwise.' });
  });
});

import React from 'react';
import { AccessibilityInfo, Animated, Text } from 'react-native';
import { act, render, screen } from '@testing-library/react-native';
import JobListSkeleton from '../JobListSkeleton';
import SkeletonPulse from '../SkeletonPulse';

describe('SkeletonPulse', () => {
  afterEach(() => jest.restoreAllMocks());

  it('announces one loading state instead of its placeholder shapes', async () => {
    await render(
      <SkeletonPulse label="Loading jobs">
        <Text>placeholder</Text>
      </SkeletonPulse>
    );

    expect(screen.getByRole('progressbar', { name: 'Loading jobs' })).toBeOnTheScreen();
  });

  it('pulses, and stays still when Reduce motion is on', async () => {
    const loop = jest.spyOn(Animated, 'loop');
    await render(<SkeletonPulse label="Loading jobs">{null}</SkeletonPulse>);
    expect(loop).toHaveBeenCalledTimes(1);

    loop.mockClear();
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(true);
    await render(<SkeletonPulse label="Loading jobs">{null}</SkeletonPulse>);
    await act(async () => undefined);

    expect(loop).toHaveBeenCalledTimes(1);
  });
});

describe('job skeletons', () => {
  it('draws one placeholder card per job, with an optional header, all hidden from screen readers', async () => {
    await render(<JobListSkeleton cardCount={3} withHeader />);

    expect(screen.getByRole('progressbar', { name: 'Loading jobs' })).toBeOnTheScreen();
    expect(screen.getAllByTestId('job-card-skeleton', { includeHiddenElements: true })).toHaveLength(3);
  });
});

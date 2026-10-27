import React from 'react';
import { Text } from 'react-native';
import { fireEvent, render, screen } from '@testing-library/react-native';
import ClusterPin from '../ClusterPin';
import CompanyPin from '../CompanyPin';
import PinMarker from '../PinMarker';

describe('CompanyPin', () => {
  it("shows the company's open job count", async () => {
    await render(<CompanyPin openJobCount={17} />);

    expect(screen.getByText('17')).toBeOnTheScreen();
  });
});

describe('ClusterPin', () => {
  it('shows how many companies it groups', async () => {
    await render(<ClusterPin companyCount={4} />);

    expect(screen.getByText('4')).toBeOnTheScreen();
  });
});

describe('PinMarker', () => {
  it('renders its pin and reports presses', async () => {
    const onPress = jest.fn();
    await render(
      <PinMarker coordinate={{ latitude: 13, longitude: 75 }} accessibilityLabel="Axis Bank" onPress={onPress}>
        <Text>pin</Text>
      </PinMarker>
    );

    await fireEvent.press(screen.getByRole('button', { name: 'Axis Bank' }));

    expect(screen.getByText('pin')).toBeOnTheScreen();
    expect(onPress).toHaveBeenCalled();
  });
});

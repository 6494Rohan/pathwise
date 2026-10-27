import { useMutation } from '@tanstack/react-query';
import { locationService } from '../services/locationService';

export const useCurrentLocation = () => useMutation({ mutationFn: locationService.getCurrentLocation });

import { act, renderHook, waitFor } from '@testing-library/react-native';
import { geocodeAsync, requestForegroundPermissionsAsync } from 'expo-location';
import { createQueryWrapper } from '@/test-utils/renderWithProviders';
import { usePlaceSearch } from '../usePlaceSearch';

const renderSearch = () => renderHook(() => usePlaceSearch(), { wrapper: createQueryWrapper() });

describe('usePlaceSearch', () => {
  beforeEach(() => jest.mocked(geocodeAsync).mockClear());

  it('finds the place once typing pauses', async () => {
    const { result } = await renderSearch();

    await act(async () => result.current.setQuery(' Bengaluru '));

    await waitFor(() =>
      expect(result.current.searchedPlace).toEqual({ name: 'Bengaluru', coordinate: { latitude: 12.97, longitude: 77.59 } })
    );
    expect(geocodeAsync).toHaveBeenCalledTimes(1);
  });

  it('waits for at least three characters', async () => {
    const { result } = await renderSearch();

    await act(async () => result.current.setQuery('Be'));
    await act(() => new Promise((resolve) => setTimeout(resolve, 700)));

    expect(geocodeAsync).not.toHaveBeenCalled();
    expect(result.current.searchedPlace).toBeNull();
  });

  it('reports why a search failed', async () => {
    jest.mocked(requestForegroundPermissionsAsync).mockResolvedValueOnce({ granted: false } as never);
    const { result } = await renderSearch();

    await act(async () => result.current.setQuery('Bengaluru'));

    await waitFor(() => expect(result.current.errorCode).toBe('permissionDenied'));
  });

  it('shows no error when nothing matches', async () => {
    jest.mocked(geocodeAsync).mockResolvedValueOnce([]);
    const { result } = await renderSearch();

    await act(async () => result.current.setQuery('Nowhere'));

    await waitFor(() => expect(geocodeAsync).toHaveBeenCalledWith('Nowhere'));
    expect(result.current.errorCode).toBeNull();
    expect(result.current.searchedPlace).toBeNull();
  });
});

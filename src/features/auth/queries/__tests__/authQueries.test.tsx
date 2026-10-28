import { act, renderHook, waitFor } from '@testing-library/react-native';
import { createQueryWrapper, createTestQueryClient } from '@/test-utils/renderWithProviders';
import { authService } from '../../services/authService';
import { AuthFailure } from '../../types/auth.types';
import { authKeys } from '../authKeys';
import { useConfirmEmail } from '../useConfirmEmail';
import { useResendEmailCode } from '../useResendEmailCode';
import { useSession } from '../useSession';
import { useSignInWithEmail } from '../useSignInWithEmail';
import { useSignInWithGoogle } from '../useSignInWithGoogle';
import { useSignOut } from '../useSignOut';
import { useSignUpWithEmail } from '../useSignUpWithEmail';

jest.mock('../../services/authService', () => ({
  authService: {
    getSessionUser: jest.fn(),
    pickGoogleAccount: jest.fn(),
    signInWithGoogleAccount: jest.fn(),
    signInWithEmail: jest.fn(),
    signUpWithEmail: jest.fn(),
    confirmEmail: jest.fn(),
    resendEmailCode: jest.fn(),
    signOut: jest.fn(),
  },
}));

const user = { id: 'u1', username: 'google_1' };

describe('auth queries', () => {
  it('builds the session key under the auth key', () => {
    expect(authKeys.session()).toEqual(['auth', 'session']);
  });

  it('loads the current session', async () => {
    jest.mocked(authService.getSessionUser).mockResolvedValue(user);
    const { result } = await renderHook(() => useSession(), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.data).toEqual(user));
  });

  describe('Google', () => {
    const account = { email: 'rohan@example.com', name: 'Rohan', idToken: 'google-id-token' };

    it('signs in with the picked account and stores the user in the session', async () => {
      jest.mocked(authService.pickGoogleAccount).mockResolvedValueOnce(account);
      jest.mocked(authService.getSessionUser).mockResolvedValue(user);
      const queryClient = createTestQueryClient();
      const { result } = await renderHook(() => useSignInWithGoogle(), { wrapper: createQueryWrapper(queryClient) });

      await act(async () => result.current.start());

      await waitFor(() => expect(queryClient.getQueryData(authKeys.session())).toEqual(user));
      expect(authService.signInWithGoogleAccount).toHaveBeenCalledWith(account);
    });

    it('stays idle (not busy, no error) while the picker is open and after it is dismissed', async () => {
      let closePicker: (value: null) => void = () => undefined;
      jest.mocked(authService.pickGoogleAccount).mockReturnValueOnce(new Promise((resolve) => (closePicker = resolve)));
      jest.mocked(authService.signInWithGoogleAccount).mockClear();
      const { result } = await renderHook(() => useSignInWithGoogle(), { wrapper: createQueryWrapper() });

      await act(async () => result.current.start());
      expect(result.current.isPending).toBe(false);

      await act(async () => closePicker(null));
      expect(result.current).toMatchObject({ isPending: false, error: null });
      expect(authService.signInWithGoogleAccount).not.toHaveBeenCalled();
    });

    it('reports failures from the picker and from Cognito', async () => {
      jest.mocked(authService.pickGoogleAccount).mockRejectedValueOnce(new AuthFailure('unknown'));
      const { result } = await renderHook(() => useSignInWithGoogle(), { wrapper: createQueryWrapper() });

      await act(async () => result.current.start());

      await waitFor(() => expect(result.current.error?.code).toBe('unknown'));
    });
  });

  it('signs out, clears cached data and updates whoever watches the session', async () => {
    jest.mocked(authService.getSessionUser).mockResolvedValueOnce(user);
    const queryClient = createTestQueryClient();
    queryClient.setQueryData(['users', 'profile', 'u1'], { id: 'u1' });
    const { result } = await renderHook(() => ({ session: useSession(), signOut: useSignOut() }), {
      wrapper: createQueryWrapper(queryClient),
    });
    await waitFor(() => expect(result.current.session.data).toEqual(user));

    await act(async () => {
      await result.current.signOut.mutateAsync();
    });

    await waitFor(() => expect(result.current.session.data).toBeNull());
    expect(queryClient.getQueryData(['users', 'profile', 'u1'])).toBeUndefined();
  });

  it('ignores a session check that finishes after sign-out', async () => {
    jest.mocked(authService.getSessionUser).mockResolvedValueOnce(user);
    jest.mocked(authService.signOut).mockResolvedValue(undefined);
    const queryClient = createTestQueryClient();
    const { result } = await renderHook(() => ({ session: useSession(), signOut: useSignOut() }), {
      wrapper: createQueryWrapper(queryClient),
    });
    await waitFor(() => expect(result.current.session.data).toEqual(user));

    let finishCheck: (value: typeof user) => void = () => undefined;
    jest.mocked(authService.getSessionUser).mockReturnValueOnce(new Promise((resolve) => (finishCheck = resolve)));
    await act(async () => {
      void queryClient.refetchQueries({ queryKey: authKeys.session() });
      await result.current.signOut.mutateAsync();
      finishCheck(user);
    });

    await waitFor(() => expect(result.current.session.data).toBeNull());
  });

  it('checks the session again when sign-out fails', async () => {
    jest.mocked(authService.getSessionUser).mockResolvedValue(user);
    jest.mocked(authService.signOut).mockRejectedValue(new Error('offline'));
    const queryClient = createTestQueryClient();
    const { result } = await renderHook(() => ({ session: useSession(), signOut: useSignOut() }), {
      wrapper: createQueryWrapper(queryClient),
    });
    await waitFor(() => expect(result.current.session.data).toEqual(user));
    const checksBefore = jest.mocked(authService.getSessionUser).mock.calls.length;

    await act(async () => {
      await result.current.signOut.mutateAsync().catch(() => undefined);
    });

    await waitFor(() => expect(jest.mocked(authService.getSessionUser).mock.calls.length).toBe(checksBefore + 1));
  });

  it('refreshes the session after an email sign-in', async () => {
    jest.mocked(authService.signInWithEmail).mockResolvedValue('signedIn');
    const queryClient = createTestQueryClient();
    const invalidate = jest.spyOn(queryClient, 'invalidateQueries');
    const { result } = await renderHook(() => useSignInWithEmail(), { wrapper: createQueryWrapper(queryClient) });

    await act(async () => {
      await result.current.mutateAsync({ email: 'a@b.co', password: 'pw' });
    });

    expect(invalidate).toHaveBeenCalledWith({ queryKey: authKeys.session() });
  });

  it('sends a new code when an unverified user signs in', async () => {
    jest.mocked(authService.signInWithEmail).mockResolvedValue('emailNotVerified');
    const { result } = await renderHook(() => useSignInWithEmail(), { wrapper: createQueryWrapper() });

    await act(async () => {
      await expect(result.current.mutateAsync({ email: 'a@b.co', password: 'pw' })).resolves.toBe('emailNotVerified');
    });

    expect(authService.resendEmailCode).toHaveBeenCalledWith('a@b.co');
  });

  it('exposes the auth failure of a sign-up', async () => {
    jest.mocked(authService.signUpWithEmail).mockRejectedValueOnce(new AuthFailure('emailTaken'));
    const { result } = await renderHook(() => useSignUpWithEmail(), { wrapper: createQueryWrapper() });

    await act(async () => {
      await result.current
        .mutateAsync({ name: 'R', email: 'a@b.co', password: 'x', confirmPassword: 'x' })
        .catch(() => undefined);
    });

    await waitFor(() => expect(result.current.error?.code).toBe('emailTaken'));
  });

  it('refreshes the session once the email is confirmed', async () => {
    jest.mocked(authService.confirmEmail).mockResolvedValue('signedIn');
    const queryClient = createTestQueryClient();
    const invalidate = jest.spyOn(queryClient, 'invalidateQueries');
    const { result } = await renderHook(() => useConfirmEmail(), { wrapper: createQueryWrapper(queryClient) });

    await act(async () => {
      await result.current.mutateAsync({ email: 'a@b.co', code: '123456' });
    });

    expect(authService.confirmEmail).toHaveBeenCalledWith('a@b.co', '123456');
    expect(invalidate).toHaveBeenCalledWith({ queryKey: authKeys.session() });
  });

  it('resends the verification code', async () => {
    const { result } = await renderHook(() => useResendEmailCode(), { wrapper: createQueryWrapper() });

    await act(async () => {
      await result.current.mutateAsync('a@b.co');
    });

    expect(authService.resendEmailCode).toHaveBeenCalledWith('a@b.co');
  });
});

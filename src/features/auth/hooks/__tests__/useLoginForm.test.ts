import { act, renderHook } from '@testing-library/react-native';
import { useLoginForm } from '../useLoginForm';

describe('useLoginForm', () => {
  it('asks for the password only after a valid email', async () => {
    const { result } = await renderHook(() => useLoginForm());

    await act(async () => result.current.submitEmail());
    expect(result.current.step).toBe('email');
    expect(result.current.errors.email).toBe('Enter a valid email address');

    await act(async () => result.current.setEmail('a@b.co'));
    await act(async () => result.current.submitEmail());
    expect(result.current.step).toBe('password');
    expect(result.current.errors).toEqual({});
  });

  it('goes back to the email step when the email changes', async () => {
    const { result } = await renderHook(() => useLoginForm('a@b.co'));
    expect(result.current.step).toBe('password');

    await act(async () => result.current.setEmail('c@d.co'));

    expect(result.current.step).toBe('email');
  });

  it('returns trimmed credentials or shows the missing password', async () => {
    const { result } = await renderHook(() => useLoginForm(' a@b.co '));

    let credentials: ReturnType<typeof result.current.validateCredentials> = null;
    await act(async () => {
      credentials = result.current.validateCredentials();
    });
    expect(credentials).toBeNull();
    expect(result.current.errors.password).toBe('Password is required');

    await act(async () => result.current.setPassword('secret'));
    await act(async () => {
      credentials = result.current.validateCredentials();
    });
    expect(credentials).toEqual({ email: 'a@b.co', password: 'secret' });
  });
});

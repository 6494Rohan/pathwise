import { act, renderHook } from '@testing-library/react-native';
import { useSignUpForm } from '../useSignUpForm';

const fill = async (
  result: { current: ReturnType<typeof useSignUpForm> },
  values: Record<'name' | 'email' | 'password' | 'confirmPassword', string>
) => {
  for (const [field, value] of Object.entries(values)) {
    await act(async () => result.current.changeField(field as keyof typeof values)(value));
  }
};

describe('useSignUpForm', () => {
  it('shows an error for each invalid field', async () => {
    const { result } = await renderHook(() => useSignUpForm());
    await fill(result, { name: 'R', email: 'nope', password: 'short', confirmPassword: 'other' });

    await act(async () => {
      expect(result.current.validate()).toBeNull();
    });

    expect(result.current.errors).toEqual({
      name: 'Name must be at least 2 characters',
      email: 'Enter a valid email address',
      password: 'Password must be at least 8 characters',
      confirmPassword: "Passwords don't match",
    });
  });

  it('asks for a stronger password', async () => {
    const { result } = await renderHook(() => useSignUpForm());
    await fill(result, { name: 'Rohan', email: 'a@b.co', password: 'alllowercase', confirmPassword: 'alllowercase' });

    await act(async () => {
      result.current.validate();
    });

    expect(result.current.errors.password).toBe('Use upper and lower case letters, a number and a symbol');
  });

  it('returns valid values and clears a field error when it changes', async () => {
    const { result } = await renderHook(() => useSignUpForm());
    await act(async () => {
      result.current.validate();
    });
    await act(async () => result.current.changeField('name')('Rohan'));
    expect(result.current.errors.name).toBeUndefined();

    await fill(result, { name: 'Rohan', email: ' a@b.co ', password: 'Strong#1pw', confirmPassword: 'Strong#1pw' });
    let values: ReturnType<typeof result.current.validate> = null;
    await act(async () => {
      values = result.current.validate();
    });

    expect(values).toEqual({ name: 'Rohan', email: 'a@b.co', password: 'Strong#1pw', confirmPassword: 'Strong#1pw' });
  });
});

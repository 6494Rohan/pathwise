import { useReducer } from 'react';
import { FieldErrors, validateForm } from '@/utils/validation';
import { EmailSchema, SignInInput, SignInSchema } from '../types/auth.types';

type LoginStep = 'email' | 'password';

interface LoginFormState {
  step: LoginStep;
  values: SignInInput;
  errors: FieldErrors<SignInInput>;
}

type LoginFormAction =
  | { type: 'changeField'; field: keyof SignInInput; value: string }
  | { type: 'setErrors'; errors: FieldErrors<SignInInput> }
  | { type: 'showPasswordStep' };

const loginFormReducer = (state: LoginFormState, action: LoginFormAction): LoginFormState => {
  switch (action.type) {
    case 'changeField':
      return {
        step: action.field === 'email' ? 'email' : state.step,
        values: { ...state.values, [action.field]: action.value },
        errors: { ...state.errors, [action.field]: undefined },
      };
    case 'setErrors':
      return { ...state, errors: action.errors };
    case 'showPasswordStep':
      return { ...state, step: 'password', errors: {} };
  }
};

export const useLoginForm = (initialEmail = '') => {
  const [state, dispatch] = useReducer(loginFormReducer, {
    step: initialEmail ? 'password' : 'email',
    values: { email: initialEmail, password: '' },
    errors: {},
  });

  const submitEmail = () => {
    const result = validateForm(EmailSchema, { email: state.values.email.trim() });
    if (result.success) dispatch({ type: 'showPasswordStep' });
    else dispatch({ type: 'setErrors', errors: result.errors });
  };

  const validateCredentials = (): SignInInput | null => {
    const result = validateForm(SignInSchema, { ...state.values, email: state.values.email.trim() });
    if (!result.success) dispatch({ type: 'setErrors', errors: result.errors });
    return result.data;
  };

  return {
    step: state.step,
    values: state.values,
    errors: state.errors,
    setEmail: (value: string) => dispatch({ type: 'changeField', field: 'email', value }),
    setPassword: (value: string) => dispatch({ type: 'changeField', field: 'password', value }),
    submitEmail,
    validateCredentials,
  };
};

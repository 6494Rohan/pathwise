import { useReducer } from 'react';
import { FieldErrors, validateForm } from '@/utils/validation';
import { SignUpInput, SignUpSchema } from '../types/auth.types';

interface SignUpFormState {
  values: SignUpInput;
  errors: FieldErrors<SignUpInput>;
}

type SignUpFormAction =
  | { type: 'changeField'; field: keyof SignUpInput; value: string }
  | { type: 'setErrors'; errors: FieldErrors<SignUpInput> };

const initialState: SignUpFormState = {
  values: { name: '', email: '', password: '', confirmPassword: '' },
  errors: {},
};

const signUpFormReducer = (state: SignUpFormState, action: SignUpFormAction): SignUpFormState => {
  switch (action.type) {
    case 'changeField':
      return {
        values: { ...state.values, [action.field]: action.value },
        errors: { ...state.errors, [action.field]: undefined },
      };
    case 'setErrors':
      return { ...state, errors: action.errors };
  }
};

export const useSignUpForm = () => {
  const [state, dispatch] = useReducer(signUpFormReducer, initialState);

  const changeField = (field: keyof SignUpInput) => (value: string) =>
    dispatch({ type: 'changeField', field, value });

  const validate = (): SignUpInput | null => {
    const result = validateForm(SignUpSchema, { ...state.values, email: state.values.email.trim() });
    if (!result.success) dispatch({ type: 'setErrors', errors: result.errors });
    return result.data;
  };

  return { values: state.values, errors: state.errors, changeField, validate };
};

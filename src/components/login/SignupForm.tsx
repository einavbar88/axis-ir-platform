import React from 'react';
import { Input } from '../ui/Input';

export type SignupFormFields = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type SignupFormProps = {
  setFormValues: (signupFormFields: SignupFormFields) => void;
  formValues: SignupFormFields;
  errorMessages?: Partial<SignupFormFields>;
};

export const SignupForm: React.FC<SignupFormProps> = ({
  setFormValues,
  formValues,
  errorMessages,
}) => {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Input
        name={'username'}
        onChange={onChange}
        isRequired={true}
        label={'Username'}
        errorMessage={errorMessages?.username}
      />
      <Input
        name={'email'}
        onChange={onChange}
        type={'email'}
        isRequired={true}
        label={'Email'}
        errorMessage={errorMessages?.email}
      />
      <Input
        name={'password'}
        onChange={onChange}
        type={'password'}
        isRequired={true}
        label={'Password'}
        errorMessage={errorMessages?.password}
      />
      <Input
        name={'confirmPassword'}
        onChange={onChange}
        type={'password'}
        isRequired={true}
        label={'Confirm Password'}
        errorMessage={errorMessages?.confirmPassword}
      />
    </>
  );
};

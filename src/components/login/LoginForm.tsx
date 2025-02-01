import React from 'react';
import { Input } from '../ui/Input';

export type LoginFormType = { username: string; password: string };

type LoginFormProps = {
  formValues: LoginFormType;
  setFormValues: (values: LoginFormType) => void;
  loginError?: string;
};

export const LoginForm: React.FC<LoginFormProps> = ({
  setFormValues,
  formValues,
  loginError,
}) => {
  const setValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  return (
    <>
      <Input
        name={'username'}
        label={'Username'}
        onChange={setValue}
        isRequired={true}
      />
      <Input
        name={'password'}
        label={'Password'}
        type={'password'}
        onChange={setValue}
        isRequired={true}
      />
      {loginError && <p className='text-error text-xs'>{loginError}</p>}
    </>
  );
};

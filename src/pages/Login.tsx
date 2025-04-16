import React, { useContext, useEffect, useState } from 'react';
import { useScreenSize } from '../hooks/useScreenSize';
import { LoginForm } from '../components/login/LoginForm';
import {
  SignupForm,
  type SignupFormFields,
} from '../components/login/SignupForm';
import { useValidation } from '../hooks/useValidation';
import { API } from '../api/API';
import { AxisContext } from '../store/AxisContext';
import routes from '../constants/routes';

export const Login: React.FC = () => {
  const { setIsLoggedIn, setUser, requestOptions } = useContext(AxisContext);
  const { validate, getErrorMessage } = useValidation();
  const screenSize = useScreenSize();
  const usersApi = API.users(requestOptions);

  const [errorMessages, setErrorMessages] =
    useState<Partial<SignupFormFields>>();
  const [loginError, setLoginError] = useState('');

  const [isLogin, setIsLogin] = useState(true);
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: '',
  });
  const [signupForm, setSignupForm] = useState<SignupFormFields>({
    email: '',
    password: '',
    username: '',
    confirmPassword: '',
  });

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  const signup = async () => {
    try {
      const { isValid, errors } = validateSignupForm();
      if (!isValid) {
        setErrorMessages(errors);
        return;
      }
      const res = await usersApi.signup(signupForm);
      setLogin(res.data.responseObject);
    } catch (e: any) {
      const error = e.response?.data?.responseObject;
      if (error?.msg && error?.field) {
        setErrorMessages({ [error.field]: error.msg });
      }
    }
  };

  const login = async () => {
    try {
      const res = await usersApi.login(loginForm.username, loginForm.password);
      setLogin(res.data.responseObject);
    } catch (e) {
      setLoginError('Invalid username or password');
    }
  };

  const setLogin = ({ user, token }: { user: any; token: string }) => {
    setUser(user);
    setIsLoggedIn(true);
    localStorage.setItem('token', token);
  };

  const validateSignupForm = () => {
    const errors: any = {};
    let isValid = true;
    Object.entries(signupForm).forEach(([key, value]) => {
      if (!validate(value, key, signupForm.password)) {
        errors[key] = getErrorMessage(key);
        isValid = false;
      }
    });
    return { isValid, errors };
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    return isLogin ? login() : signup();
  };

  useEffect(() => {
    setErrorMessages(undefined);
  }, [signupForm]);

  useEffect(() => {
    setLoginError('');
  }, [loginForm]);

  return (
    <div className='flex'>
      <div
        className={`w-${screenSize.width > 900 ? '1/2' : 'full'} h-screen flex justify-center items-center bg-main-mid`}
      >
        <div className='absolute w-full top-16 text-center'>
          <div className='w-full flex justify-center mb-4'>
            <img
              className={'rounded-xl'}
              style={{ width: '180px' }}
              src={routes.assets.logo}
              alt={'AxisIR'}
            />
          </div>
          <p className='text-xl'>Smarter Response, Stronger Defense!</p>
        </div>

        <div className='w-96 mx-auto mt-10 p-6 bg-white rounded-lg shadow-md bg-main-white text-main-dark'>
          <form onSubmit={handleSubmit} className='space-y-4'>
            {isLogin ? (
              <LoginForm
                formValues={loginForm}
                setFormValues={setLoginForm}
                loginError={loginError}
              />
            ) : (
              <SignupForm
                formValues={signupForm}
                setFormValues={setSignupForm}
                errorMessages={errorMessages}
              />
            )}
            <button
              type='submit'
              className='w-full flex justify-center py-2 px-4 border border-transparent
              rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:bg-main-darkest hover:text-main-light-green'
            >
              {isLogin ? 'Login' : 'Sign Up'}
            </button>
          </form>
          <div
            onClick={toggleAuthMode}
            className='text-sm text-center font-medium mt-5 cursor-pointer'
          >
            {isLogin
              ? "Don't have an account yet? Click here to sign up!"
              : 'Already have an account? Click here to Login'}
          </div>
        </div>
      </div>
      {screenSize.width > 900 && (
        <div className='w-1/2'>
          <img
            className='w-full h-full'
            src={routes.assets.signup}
            alt={'signup'}
          />
        </div>
      )}
    </div>
  );
};

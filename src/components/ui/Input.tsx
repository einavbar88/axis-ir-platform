import React, { useEffect, useState } from 'react';

type Props = {
  name: string;
  onChange: (e: any) => void;
  type?: React.HTMLInputTypeAttribute;
  isRequired?: boolean;
  inputClasses?: string;
  label?: string;
  labelClasses?: string;
  errorMessage?: string;
  defaultValue?: string | number;
  min?: number;
  max?: number;
};

export const Input: React.FC<Props> = ({
  inputClasses,
  labelClasses,
  isRequired,
  type = 'text',
  onChange,
  label,
  name,
  errorMessage,
  defaultValue = '',
  min,
  max,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [inputType, setInputType] = useState(type);
  const [value, setValue] = useState<string>();

  useEffect(() => {
    setInputType(showPassword ? 'text' : type);
  }, [showPassword, type]);

  useEffect(() => {
    onChange({ target: { value, name } });
  }, [value]);

  const numInputProps = type === 'number' ? { min, max } : {};

  return (
    <div>
      {label && (
        <p
          className={`block text-sm font-medium text-gray-700 ${labelClasses}`}
        >
          {label}
        </p>
      )}
      <div className='relative'>
        <input
          autoComplete={'off'}
          type={inputType}
          onChange={(e) => setValue(e.target.value)}
          value={value ?? defaultValue}
          required={isRequired}
          name={name}
          className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 
        focus:border-indigo-500 sm:text-sm ${inputClasses}`}
          {...numInputProps}
        />
        {type === 'password' && (
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5'
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        )}
      </div>
      {errorMessage && <p className='text-error text-xs'>{errorMessage}</p>}
    </div>
  );
};

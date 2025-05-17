import React, { type ReactElement } from 'react';
import { Link } from 'react-router-dom';

type Props = {
  onClick?: () => void;
  text: string;
  buttonClasses?: string;
  theme?: 'primary' | 'secondary' | 'tertiary';
  icon?: () => ReactElement;
  type?: 'button' | 'submit';
  linkTo?: string;
  disabled?: boolean;
  size?: 'small' | 'large';
};

export const Button: React.FC<Props> = ({
  onClick = () => {},
  text,
  buttonClasses,
  icon,
  theme,
  type = 'button',
  linkTo,
  disabled = false,
  size = 'large',
}) => {
  const getThemeStyles = () => {
    switch (theme) {
      case 'primary':
        return 'text-main-light-green flex bg-main-mid ml-2 rounded-xl mb-2';
      case 'secondary':
        return 'text-main-dark flex bg-main-light-green ml-2 rounded-xl mb-2';
      case 'tertiary':
        return 'text-main-dark flex ml-2 mr-2';
      default:
        return '';
    }
  };

  const className = `${getThemeStyles()} ${buttonClasses} ${size === 'small' ? 'p-2 text-sm' : 'p-3'}`;

  if (linkTo) {
    return (
      <Link to={linkTo} className={className}>
        <p>{text}</p>
        {icon ? icon() : null}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={className}
      disabled={disabled}
    >
      <p>{text}</p>
      {icon ? icon() : null}
    </button>
  );
};

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
};

export const Button: React.FC<Props> = ({
  onClick = () => {},
  text,
  buttonClasses,
  icon,
  theme,
  type = 'button',
  linkTo,
}) => {
  const getThemeStyles = () => {
    switch (theme) {
      case 'primary':
        return 'text-main-light-green flex bg-main-mid p-3 ml-2 rounded-xl mb-2';
      case 'secondary':
        return 'text-main-dark flex bg-main-light-green p-3 ml-2 rounded-xl mb-2';
      case 'tertiary':
        return 'text-main-dark flex p-3 ml-2 mr-2';
      default:
        return '';
    }
  };

  if (linkTo) {
    return (
      <Link to={linkTo} className={`${getThemeStyles()} ${buttonClasses}`}>
        <p>{text}</p>
        {icon ? icon() : null}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${getThemeStyles()} ${buttonClasses}`}
    >
      <p>{text}</p>
      {icon ? icon() : null}
    </button>
  );
};

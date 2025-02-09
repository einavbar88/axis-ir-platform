import React, { type ReactElement } from 'react';

type Props = {
  onClick?: () => void;
  text: string;
  buttonClasses?: string;
  theme?: 'primary' | 'secondary';
  icon?: () => ReactElement;
  type?: 'button' | 'submit';
};

export const Button: React.FC<Props> = ({
  onClick = () => {},
  text,
  buttonClasses,
  icon,
  theme,
  type = 'button',
}) => {
  const getThemeStyles = () => {
    switch (theme) {
      case 'primary':
        return 'text-main-light-green flex bg-main-mid p-3 ml-2 rounded-xl mb-2';
      case 'secondary':
        return 'text-main-dark flex bg-main-light-green p-3 ml-2 rounded-xl mb-2';
      default:
        return '';
    }
  };

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

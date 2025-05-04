import { NavBtn } from './NavBtn';
import { CreateOptions } from './CreateOptions';
import routes from '../../constants/routes';

export const buttonsConfig = [
  {
    to: '/',
    text: 'Dashboards',
  },
  {
    to: routes.platform.users,
    text: 'Users',
  },
  {
    to: routes.platform.assets,
    text: 'Assets',
  },
  {
    to: routes.platform.assetGroups,
    text: 'Asset Groups',
  },
];

export const Navigation = () => {
  return (
    <div
      className={
        'flex flex-col h-screen w-48 bg-main-lighter fixed left-0 top-0 shadow-lg z-10 font-poppins'
      }
    >
      <nav className='mt-16 flex-1 p-4'>
        <ul>
          <CreateOptions />
          {buttonsConfig.map((button) => (
            <NavBtn key={button.to} to={button.to} text={button.text} />
          ))}
        </ul>
      </nav>
    </div>
  );
};

import React, { useContext, useState } from 'react';
import routes from '../../constants/routes';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { API } from '../../api/API';
import { AxisContext } from '../../store/AxisContext';
import { AccountContext } from '../../store/AccountContext';
import { useNavigate } from 'react-router-dom';

type UserToInvite = {
  email: string;
  role?: number;
};
export const InviteUser: React.FC = () => {
  const { requestOptions, roles } = useContext(AxisContext);
  const { selectedAccount } = useContext(AccountContext);
  const [userToInvite, setUserToInvite] = useState<UserToInvite>({
    email: '',
  });
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { email, role } = userToInvite;
    const accountId = selectedAccount?.value;
    if (!accountId) return;

    await API.users(requestOptions).invite(
      email,
      role || roles[0].value,
      accountId,
    );
    navigate(routes.platform.manageAccount.replace(':id', accountId));
  };

  const onChangeField = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    const temp = { ...userToInvite };
    if (name === 'email') temp.email = value;
    if (name === 'role') temp.role = Number(value);
    setUserToInvite(temp);
  };

  return (
    <div className='w-full flex flex-col justify-center items-center'>
      <h1 className='text-2xl font-bold my-5'>Invite a user</h1>
      <div className='w-full flex justify-around'>
        <div className='w-1/2'>
          <img alt={'New Accounts'} src={routes.assets.createAccount} />
        </div>
        <div className='w-1/3 flex items-center justify-between bg-main-lightest p-4 rounded-lg'>
          <form
            onSubmit={onSubmit}
            className='flex flex-col items-center w-full space-y-4'
          >
            <Input
              name={'email'}
              label={'User email'}
              onChange={onChangeField}
              inputClasses={'min-w-52'}
              type='email'
              isRequired
            />
            <div className='flex w-full'>
              <label>
                Role
                <select
                  name={'role'}
                  className='p-2 rounded-lg ml-2'
                  onChange={onChangeField}
                >
                  {roles?.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <Button type={'submit'} text={'Create'} theme={'primary'} />
          </form>
        </div>
      </div>
    </div>
  );
};

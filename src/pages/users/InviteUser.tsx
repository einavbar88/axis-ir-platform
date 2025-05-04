import React, { useContext, useState } from 'react';
import routes from '../../constants/routes';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { API } from '../../api/API';
import { AxisContext } from '../../store/AxisContext';
import { AccountContext } from '../../store/AccountContext';
import { useNavigate } from 'react-router-dom';
import { AxisIRModal } from '../../components/ui/AxisIRModal';
import { UserRole } from '../../components/UserRole';

type UserToInvite = {
  email: string;
  role?: number;
};
export const InviteUser: React.FC = () => {
  const { requestOptions, roles, modals } = useContext(AxisContext);
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
    navigate(routes.platform.users);
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

  const close = () => {
    modals.inviteUser.setIsOpen(false);
  };

  return (
    <AxisIRModal
      title='Invite user to account'
      ref={modals.inviteUser.ref}
      close={close}
    >
      <form onSubmit={onSubmit}>
        <Input
          name={'email'}
          label={'User email'}
          onChange={onChangeField}
          type='email'
          isRequired
        />
        <UserRole onChangeField={onChangeField} roles={roles} />
        <div className={'flex justify-end'}>
          <Button
            type={'submit'}
            text={'Create'}
            theme={'primary'}
            disabled={!userToInvite.role && !userToInvite.email?.trim()}
          />
        </div>
      </form>
    </AxisIRModal>
  );
};

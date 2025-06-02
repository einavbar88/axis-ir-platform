import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { API } from '../../api/API';
import { AxisContext } from '../../store/AxisContext';
import { AccountContext } from '../../store/AccountContext';
import routes from '../../constants/routes';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const EditAccount: React.FC = () => {
  const { requestOptions } = useContext(AxisContext);
  const { selectedAccount } = useContext(AccountContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [accountData, setAccountData] = useState<any>();

  useEffect(() => {
    if (!selectedAccount?.value) return;
    API.accounts(requestOptions)
      .getById(Number(id))
      .then((res) => {
        setAccountData(res.data.responseObject);
      })
      .catch((e) => {
        console.error(e);
        navigate('/404');
      });
  }, [selectedAccount]);

  const onChangeField = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setAccountData({ ...accountData, [name]: value });
  };
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(accountData);
  };

  return (
    <div className='flex flex-col items-center justify-center'>
      <h1 className='text-2xl font-bold mb-4 text-center text-main-darkest'>
        {accountData?.name}
      </h1>
      <div className='w-full flex justify-around'>
        <div className='w-1/2'>
          <img alt={'New Accounts'} src={routes.assets.createAccount} />
        </div>
        {accountData && (
          <div className='w-1/3 flex items-center justify-between bg-main-lightest p-4 rounded-lg'>
            <form
              onSubmit={onSubmit}
              className='flex flex-col items-center w-full space-y-4'
            >
              <Input
                name={'name'}
                label={'Company name'}
                onChange={onChangeField}
                defaultValue={accountData?.name}
                inputClasses={'min-w-52'}
                isRequired
              />
              <Input
                name={'primaryEmail'}
                label={'Company email'}
                onChange={onChangeField}
                inputClasses={'min-w-52'}
                defaultValue={accountData?.primaryEmail}
                type='email'
                isRequired
              />
              <Input
                name={'cin'}
                label={'CIN/EIN/TIN'}
                onChange={onChangeField}
                inputClasses={'min-w-52'}
                defaultValue={accountData?.cin}
                isRequired
              />
              <Input
                name={'address'}
                label={'Company address'}
                onChange={onChangeField}
                inputClasses={'min-w-52'}
                defaultValue={accountData?.address}
                isRequired
              />
              <Input
                name={'primaryPhone'}
                label={'Company phone'}
                onChange={onChangeField}
                inputClasses={'min-w-52'}
                defaultValue={accountData?.primaryPhone}
                isRequired
              />
              <Input
                name={'industry'}
                label={'Industry'}
                onChange={onChangeField}
                inputClasses={'min-w-52'}
                defaultValue={accountData?.industry}
                isRequired
              />
              <Button type={'submit'} text={'Update'} theme={'primary'} />
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

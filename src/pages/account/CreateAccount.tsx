import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { API } from '../../api/API';
import { AxisContext } from '../../store/AxisContext';
import routes from '../../constants/routes';
import { AccountContext } from '../../store/AccountContext';
import type { Account } from '../../store/types/Account.type';

export interface CreateAccountForm {
  cin: string;
  name: string;
  industry: string;
  address: string;
  primaryEmail: string;
  primaryPhone: string;
  isActive?: boolean;
  description?: string;
}

export const CreateAccount: React.FC = () => {
  const navigate = useNavigate();
  const {
    setAccounts,
    accounts = [],
    requestOptions,
  } = useContext(AxisContext);

  const { setSelectedAccount } = useContext(AccountContext);

  const [formValues, setFormValues] = useState<CreateAccountForm>({
    cin: '',
    name: '',
    primaryEmail: '',
    isActive: true,
    description: '',
    address: '',
    industry: '',
    primaryPhone: '',
  });

  const onChangeField = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value?.trim() });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    API.accounts(requestOptions)
      .create(formValues)
      .then(({ data }) => {
        const company: Account = data.responseObject;
        setAccounts([...accounts, company]);
        setSelectedAccount({
          value: `${company.companyId}`,
          label: company.name,
        });
        navigate(routes.platform.home);
      })
      .catch();
  };

  return (
    <div className='w-full flex flex-col justify-center items-center'>
      <h1 className='text-2xl font-bold my-5 text-main-darkest'>
        Create an account
      </h1>
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
              name={'name'}
              label={'Company name'}
              onChange={onChangeField}
              inputClasses={'min-w-52'}
              isRequired
            />
            <Input
              name={'primaryEmail'}
              label={'Company email'}
              onChange={onChangeField}
              inputClasses={'min-w-52'}
              type='email'
              isRequired
            />
            <Input
              name={'cin'}
              label={'CIN/EIN/TIN'}
              onChange={onChangeField}
              inputClasses={'min-w-52'}
              isRequired
            />
            <Input
              name={'address'}
              label={'Company address'}
              onChange={onChangeField}
              inputClasses={'min-w-52'}
              isRequired
            />
            <Input
              name={'primaryPhone'}
              label={'Company phone'}
              onChange={onChangeField}
              inputClasses={'min-w-52'}
              isRequired
            />
            <Input
              name={'industry'}
              label={'Industry'}
              onChange={onChangeField}
              inputClasses={'min-w-52'}
              isRequired
            />
            <Button type={'submit'} text={'Create'} theme={'primary'} />
          </form>
        </div>
      </div>
    </div>
  );
};

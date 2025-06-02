import React, { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { AxisContext } from '../../../store/AxisContext';
import { AccountContext } from '../../../store/AccountContext';
import { API } from '../../../api/API';
import routes from '../../../constants/routes';
import type { CreateAssetGroupForm } from '../types';
import { AxisIRModal } from '../../../components/ui/AxisIRModal';

type Props = {
  assetGroup?: CreateAssetGroupForm;
  onClose?: () => void;
};

export const CreateAssetGroup: React.FC<Props> = ({ assetGroup, onClose }) => {
  const { requestOptions, modals } = useContext(AxisContext);
  const { selectedAccount } = useContext(AccountContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [assetGroupData, setAssetGroupData] = useState<CreateAssetGroupForm>(
    assetGroup || {
      title: '',
      description: '',
      companyId: selectedAccount?.value,
    },
  );

  const onChangeField = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { value, name } = e.target;
    setAssetGroupData({ ...assetGroupData, [name]: value });
  };

  const close = () => {
    if (onClose) return onClose();
    modals.createAssetGroup.setIsOpen(false);
    navigate(location.pathname);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAccount?.value) {
      console.error('No account selected');
      return;
    }

    const payload: CreateAssetGroupForm = {
      ...assetGroupData,
      companyId: selectedAccount?.value,
    };

    API.assets(requestOptions)
      .createAssetGroup(payload)
      .then((res) => {
        if (onClose) return onClose();
        modals.createAssetGroup.setIsOpen(false);
        navigate(routes.platform.assetGroups);
      })
      .catch((err) => {
        console.error('Error creating asset:', err);
      });
  };

  return (
    <AxisIRModal
      title={(assetGroup ? 'Manage' : 'Create') + 'Asset Group'}
      ref={modals.createAssetGroup.ref}
      close={close}
    >
      <form onSubmit={onSubmit}>
        <Input
          name={'title'}
          onChange={onChangeField}
          isRequired={true}
          label={'Group name'}
          defaultValue={assetGroupData?.title}
        />
        <br />
        <Input
          name={'description'}
          onChange={onChangeField}
          isRequired={true}
          label={'Description'}
          defaultValue={assetGroupData?.description}
        />
        <br />
        <div className='flex justify-end'>
          <Button
            onClick={close}
            text='Cancel'
            theme='tertiary'
            type='button'
          />
          <Button
            text={assetGroup ? 'Save' : 'Create'}
            theme='primary'
            type='submit'
          />
        </div>
      </form>
    </AxisIRModal>
  );
};

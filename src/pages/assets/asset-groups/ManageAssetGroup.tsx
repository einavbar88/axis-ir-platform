import React, { useContext, useState } from 'react';
import { AxisContext } from '../../../store/AxisContext';
import { AccountContext } from '../../../store/AccountContext';
import { useParams } from 'react-router-dom';
import type { CreateAssetGroupForm } from '../types';

export const ManageAssetGroup: React.FC = () => {
  const { requestOptions } = useContext(AxisContext);
  const { selectedAccount } = useContext(AccountContext);
  const { id } = useParams();

  const [assetGroupData, setGroupAssetData] = useState<CreateAssetGroupForm>({
    title: '',
    description: '',
  });

  return <div></div>;
};

import React from 'react';
import { useParams } from 'react-router-dom';

export const ManageAccount: React.FC = () => {
  const id = useParams();
  console.log(id);
  return <div>Manage Account</div>;
};

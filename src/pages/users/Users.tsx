import React, { useContext, useEffect, useRef, useState } from 'react';
import { DataTable } from '../../components/ui/Table';
import type { Account } from '../../store/types/Account.type';
import type { GridColDef } from '@mui/x-data-grid';
import { API } from '../../api/API';
import { AxisContext } from '../../store/AxisContext';
import { AccountContext } from '../../store/AccountContext';
import { AxisIRModal } from '../../components/ui/AxisIRModal';
import { useIsClickOutside } from '../../hooks/useIsClickOutside';
import { UserRole } from '../../components/UserRole';
import { Button } from '../../components/ui/Button';

export const Users: React.FC = () => {
  const { requestOptions, roles, modals } = useContext(AxisContext);
  const { selectedAccount, hasAdminAccess } = useContext(AccountContext);
  const ref = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<Partial<Account>[]>([]);
  const [update, setUpdate] = useState<{ userId: number; roleId?: number }>();
  const { isOpen, setIsOpen } = useIsClickOutside(ref);

  const columns: GridColDef[] = [
    { field: 'userId', headerName: 'ID', width: 70 },
    { field: 'username', headerName: 'User Name', minWidth: 200 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'roleId', headerName: 'Role', minWidth: 200 },
  ];

  const onSelectRow = ({ row }: any) => {
    if (!hasAdminAccess) return;
    const { userId, roleId: roleName } = row;
    const roleId = roles.find((r) => r.label === roleName)?.value;
    setUpdate({ userId, roleId });
    setIsOpen(true);
  };

  const onChangeRole = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!update) return;
    setUpdate({ userId: update.userId, roleId: Number(e.target.value) });
  };

  const changeRole = async () => {
    if (!update || !selectedAccount?.value) return setIsOpen(false);
    const { userId, roleId } = update;

    await API.users(requestOptions).changeRole(
      userId,
      roleId || 4,
      selectedAccount?.value,
    );

    const updated = await API.users(requestOptions).getByCompanyId(
      selectedAccount.value,
    );

    setData(
      updated.data.responseObject.map((user: any) => ({
        ...user,
        roleId: roles.find((r) => r.value === user.roleId)?.label,
      })),
    );
    setIsOpen(false);
  };

  useEffect(() => {
    if (!selectedAccount?.value) return;
    API.users(requestOptions)
      .getByCompanyId(selectedAccount.value)
      .then((res) => {
        setData(
          res.data.responseObject.map((user: any) => ({
            ...user,
            roleId: roles.find((r) => r.value === user.roleId)?.label,
          })),
        );
      });
  }, [selectedAccount]);

  useEffect(() => {
    if (!isOpen) setUpdate(undefined);
  }, [isOpen]);

  return (
    <div>
      {isOpen && (
        <AxisIRModal
          ref={ref}
          close={() => setIsOpen(false)}
          title={'Manage role'}
        >
          <UserRole
            onChangeField={onChangeRole}
            roles={roles}
            defaultValue={update?.roleId}
          />
          <div className={'flex justify-end'}>
            <Button text={'Update'} theme={'primary'} onClick={changeRole} />
          </div>
        </AxisIRModal>
      )}
      <div className='flex justify-center items-center mb-6 relative'>
        <h1 className='text-2xl font-bold mb-4 text-center'>Account users</h1>
        <div className='absolute right-0 top-0 flex gap-2'>
          <Button
            type='button'
            text='Invite'
            theme='primary'
            onClick={() => {
              modals.inviteUser.setIsOpen(true);
            }}
          />
        </div>
      </div>
      <div className='w-full flex justify-around'>
        <DataTable
          rows={data}
          columns={columns}
          onClickRow={onSelectRow}
          paginationModel={{ page: 0, pageSize: 5 }}
          disableColumnFilter={true}
          disableColumnMenu={true}
          disableColumnSelector={true}
        />
      </div>
    </div>
  );
};

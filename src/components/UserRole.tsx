import React from 'react';

type Props = {
  roles: { label: string; value: number }[] | undefined;
  onChangeField: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  defaultValue?: number;
};
export const UserRole: React.FC<Props> = ({
  onChangeField,
  roles,
  defaultValue = 1,
}) => {
  return (
    <label>
      Role
      <select
        name={'role'}
        className='my-6 p-2 rounded-lg ml-2 border border-main-darkest'
        onChange={onChangeField}
        defaultValue={defaultValue}
        required
      >
        {roles?.map((role) => (
          <option key={role.value} value={role.value}>
            {role.label}
          </option>
        ))}
      </select>
    </label>
  );
};

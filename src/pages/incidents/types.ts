import React from 'react';

export type Incident = {
  caseId?: number;
  closedAt?: string;
  companyId?: number;
  created_at?: string;
  description?: string;
  openedAt?: string;
  priority?: number;
  status?: string;
  title?: string;
  tlp?: string;
  updatedAt?: string;
  assigneeName?: string;
  assignee?: string;
};

export type Task = {
  taskId?: number;
  caseId?: number;
  assignee?: string;
  iocId?: number;
  assetId?: number[] | string;
  assetGroupId?: number[] | string;
  title: string;
  description?: string;
  priority?: number;
  status?: string;
  dueDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

export type EditModalProps = {
  ref: React.RefObject<any>;
  close: () => void;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
};

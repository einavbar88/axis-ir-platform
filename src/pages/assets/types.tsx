export interface CreateAssetForm {
  name: string;
  type: string;
  operatingSystem: string;
  status: string;
  tlp: string;
  priority: number;
  parentAssetId?: number;
  assetGroupId?: string;
  companyId?: string;
  createdAt?: string;
}

export type CreateAssetGroupForm = {
  title: string;
  description: string;
  companyId?: string;
};

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

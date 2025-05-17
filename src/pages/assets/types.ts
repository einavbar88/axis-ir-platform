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

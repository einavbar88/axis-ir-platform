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
  assetId?: string;
  lastHeartbeat?: string;
  metaData?: any;
}

export interface Asset {
  assetId: number;
  name: string;
  type: string;
  operatingSystem: string;
  status: string;
  tlp: string;
  priority: number;
  assetGroupId?: string;
  lastHeartbeat?: string;
}

export type CreateAssetGroupForm = {
  title: string;
  description: string;
  companyId?: string;
};

export interface Address {
  id: number;
  userId: number;
  recipientName: string;
  phoneNumber: string;
  country: string;
  state: string;
  city: string;
  municipality: string;
  neighborhood: string;
  street: string;
  exteriorReference: string;
  interiorReference: string | null;
  postalCode: number;
  isPrimary: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export type GetAddressParms = {
  primary?: boolean;
  id?: number;
};

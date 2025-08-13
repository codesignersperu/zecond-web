import { API, api, errorHandler } from ".";
import { Address, GetAddressParms } from "../types";

export function getPostalCode(code: string | number) {
  return errorHandler<string[][]>(
    api.get(API.config.address.postalCode(code)).json,
  );
}

export function getAddresses(params: GetAddressParms) {
  return errorHandler<Address[]>(api.get(API.addresses.get(params)).json);
}

export function addAddress(data: any) {
  return errorHandler(api.post(API.addresses.add, { json: data }).json);
}

export function updateAddress(data: Partial<Address>) {
  return errorHandler(api.patch(API.addresses.update, { json: data }).json);
}

export function deleteAddress(id: string | number) {
  return errorHandler(api.delete(API.addresses.delete(id)).json);
}

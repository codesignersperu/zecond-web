import { useQuery } from "@tanstack/react-query";
import {
  getBrands,
  getCategories,
  getStates,
  getMunicipalities,
  getCities,
  getNeighborhoods,
  getPostalCode,
  getSubscriptionPlans,
  getColors,
  getConfig,
} from "../apis";
import { useGlobalStore } from "../stores";

export function useGetConfig() {
  const { setConfig } = useGlobalStore();
  return useQuery({
    queryKey: ["get_store_config"],
    queryFn: async () => {
      try {
        const config = await getConfig();
        setConfig(config.data);
        return config;
      } catch {}
    },
    retry: 1,
  });
}

export function useGetBrands() {
  return useQuery({
    queryKey: ["get_brands"],
    queryFn: getBrands,
  });
}

export function useGetCategories() {
  return useQuery({
    queryKey: ["get_categories"],
    queryFn: getCategories,
  });
}

export function useGetColors() {
  return useQuery({
    queryKey: ["get_colors"],
    queryFn: getColors,
  });
}

export function useGetPostalAddress(code: string | number) {
  return useQuery({
    queryKey: ["get_postal_address", code],
    queryFn: () => getPostalCode(code),
    enabled: !!code && code.toString().length >= 5,
  });
}

export function useGetAddressStates() {
  return useQuery({
    queryKey: ["get_states"],
    queryFn: getStates,
  });
}

export function useGetAddressMunicipalities(state: string | null) {
  return useQuery({
    queryKey: ["get_municipalities", state],
    queryFn: () => getMunicipalities(state),
    enabled: !!state,
  });
}

export function useGetAddressCities(
  state: string | null,
  municipality: string | null,
) {
  return useQuery({
    queryKey: ["get_cities", state, municipality],
    queryFn: () => getCities(state, municipality),
    enabled: !!state && !!municipality,
  });
}

export function useGetAddressNeighborhoods(
  state: string | null,
  municipality: string | null,
  city: string | null,
) {
  return useQuery({
    queryKey: ["get_neighborhoods", state, municipality, city],
    queryFn: () => getNeighborhoods(state, municipality, city),
    enabled: !!state && !!municipality && !!city,
  });
}

export function useGetSubscriptionPlans() {
  return useQuery({
    queryKey: ["get_subscription_plans"],
    queryFn: getSubscriptionPlans,
  });
}

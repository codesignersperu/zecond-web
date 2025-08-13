import { API, api, errorHandler } from ".";
import type {
  CategoriesResponse,
  BrandsResponse,
  SubscriptionPlan,
  ConfigResponse,
} from "../types";

export function getConfig() {
  return errorHandler<ConfigResponse>(api.get(API.config.get).json);
}

export function getBrands() {
  return errorHandler<BrandsResponse>(api.get(API.config.brands.getAll).json);
}

export function getCategories() {
  return errorHandler<CategoriesResponse>(
    api.get(API.config.categories.getAll).json,
  );
}

export function getColors() {
  return errorHandler<[string, string][]>(api.get(API.config.colors).json);
}

export function getStates() {
  return errorHandler<string[]>(api.get(API.config.address.states).json);
}

export function getMunicipalities(state: string | null) {
  return errorHandler<string[]>(
    api.get(API.config.address.municipalities(state)).json,
  );
}

export function getCities(state: string | null, municipality: string | null) {
  return errorHandler<string[]>(
    api.get(API.config.address.cities(state, municipality)).json,
  );
}

export function getNeighborhoods(
  state: string | null,
  municipality: string | null,
  city: string | null,
) {
  return errorHandler<string[]>(
    api.get(API.config.address.neighborhoods(state, municipality, city)).json,
  );
}

export function getSubscriptionPlans() {
  return errorHandler<SubscriptionPlan[]>(
    api.get(API.config.subscriptionPlans.getAll).json,
  );
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { xxhash64 } from "hash-wasm";
import { type QueryClient } from "@tanstack/react-query";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function imageUrl(url: string | undefined) {
  if (!url) return "/placeholder.png";
  if (url && !url.match(/http/)) url = process.env.NEXT_PUBLIC_API_URL + url;
  return url;
}

export async function xxHash(input: string) {
  try {
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(input);

    const hashValue = await xxhash64(encodedData);
    return hashValue;
  } catch (error) {
    console.error("Hashing error:", error);
    return "";
  }
}

export function invalidateQueries(client: QueryClient, queries: unknown[]) {
  client.invalidateQueries({
    predicate: (query) => {
      // Check if the query key starts with any of the provided keys
      return queries.some((queryToInvalidate) =>
        query.queryKey.includes(queryToInvalidate),
      );
    },
  });
}

export function generateQueryParams(
  params: Record<string, string | number | boolean | undefined | null>,
) {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      queryParams.append(key, String(value));
    }
  });
  return queryParams.toString();
}

export function formatAccountNumber(accountNumber: string): string {
  return `${accountNumber.slice(0, 3)} ${accountNumber.slice(3, 12)} ${accountNumber.slice(12)}`;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

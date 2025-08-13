import { ASSETS } from "./constants";
import type { IProduct, ISeller } from "@/lib/types";
import { ProductStatus, ProductSize, ProductCondition } from "@/lib/types";
import dayjs from "dayjs";

const seller1: ISeller = {
  id: 1,
  firstName: "Rafael C.",
  lastName: "C.",
  avatarUrl: ASSETS["person-2.png"] as string,
  isInfluencer: true,
  username: "rafael_c",
};

const seller2: ISeller = {
  id: 2,
  firstName: "Nicola P.",
  lastName: "P.",
  avatarUrl: ASSETS["person-1.png"] as string,
  isInfluencer: true,
  username: "nicola_p",
};

export const products: Record<string, IProduct> = {
  "1": {
    id: 1,
    title: "Blazer negro marca ZARA Men",
    category: "Hombres",
    subcategory: "Shoes",
    condition: ProductCondition.New,
    price: 70.0,
    size: ProductSize.M,
    status: ProductStatus.LIVE,
    material: null,
    color: null,
    colorCode: null,
    brand: "ZARA",
    brandImage: "/placeholder.png",
    description:
      "1pc Organizador de cables de varias ranuras, sistema de gestión de cables de plástico para escritorio, hogar, oficina y coche, accesorio de soporte de cables para mesita de noche",
    isAuction: false,
    startDate: null,
    endDate: null,
    productHeight: null,
    chestMeasurement: null,
    waistMeasurement: null,
    hipsMeasurement: null,
    createdAt: "string",
    updatedAt: "string",
    images: [
      { id: 1, url: ASSETS["cloth-1.png"] },
      { id: 2, url: ASSETS["cloth-2.png"] },
      { id: 3, url: ASSETS["cloth-1.png"] },
    ],
    bids: [],
    totalBids: 0,
    seller: seller1,
  },
  "2": {
    id: 2,
    title: "Blazer negro marca ZARA Men",
    category: "Hombres",
    subcategory: "Shoes",
    condition: ProductCondition.New,
    price: 45.0,
    size: ProductSize.M,
    status: ProductStatus.LIVE,
    material: null,
    color: null,
    colorCode: null,
    brand: "ZARA",
    brandImage: "/placeholder.png",
    description:
      "1pc Organizador de cables de varias ranuras, sistema de gestión de cables de plástico para escritorio, hogar, oficina y coche, accesorio de soporte de cables para mesita de noche",
    isAuction: false,
    startDate: null,
    endDate: null,
    productHeight: null,
    chestMeasurement: null,
    waistMeasurement: null,
    hipsMeasurement: null,
    createdAt: "string",
    updatedAt: "string",
    images: [
      { id: 4, url: ASSETS["cloth-2.png"] },
      { id: 5, url: ASSETS["cloth-1.png"] },
      { id: 6, url: ASSETS["cloth-2.png"] },
    ],
    bids: [],
    totalBids: 0,
    seller: seller2,
  },
  "3": {
    id: 3,
    title: "Blazer negro marca ZARA Men",
    category: "Hombres",
    subcategory: "Shoes",
    condition: ProductCondition.New,
    price: 65.0,
    size: ProductSize.M,
    status: ProductStatus.LIVE,
    material: null,
    color: null,
    colorCode: null,
    brandImage: "/placeholder.png",
    brand: "ZARA",
    description:
      "1pc Organizador de cables de varias ranuras, sistema de gestión de cables de plástico para escritorio, hogar, oficina y coche, accesorio de soporte de cables para mesita de noche",
    isAuction: true,
    startDate: dayjs().subtract(12, "hours").toISOString(), // 12 hours ago
    endDate: dayjs().add(12, "hours").toISOString(), // 12 hours from now
    productHeight: null,
    chestMeasurement: null,
    waistMeasurement: null,
    hipsMeasurement: null,
    createdAt: "string",
    updatedAt: "string",
    images: [
      { id: 7, url: ASSETS["cloth-1.png"] },
      { id: 8, url: ASSETS["cloth-2.png"] },
      { id: 9, url: ASSETS["cloth-1.png"] },
    ],
    bids: [
      { amount: 90.0 },
      { amount: 100.0 },
      { amount: 110.0 },
      { amount: 120.0 },
    ],
    totalBids: 4,
    seller: seller1,
  },
  "4": {
    id: 4,
    title: "Blazer negro marca ZARA Men",
    category: "Hombres",
    subcategory: "Shoes",
    condition: ProductCondition.New,
    price: 55.0,
    size: ProductSize.M,
    status: ProductStatus.LIVE,
    material: null,
    color: null,
    brandImage: "/placeholder.png",
    colorCode: null,
    brand: "ZARA",
    description:
      "1pc Organizador de cables de varias ranuras, sistema de gestión de cables de plástico para escritorio, hogar, oficina y coche, accesorio de soporte de cables para mesita de noche",
    isAuction: true,
    productHeight: null,
    chestMeasurement: null,
    waistMeasurement: null,
    hipsMeasurement: null,
    createdAt: "string",
    updatedAt: "string",
    startDate: dayjs().subtract(23, "hours").toISOString(), // 23 hours ago
    endDate: dayjs().add(1, "hours").toISOString(), // 1 hours from now
    images: [
      { id: 10, url: ASSETS["cloth-2.png"] },
      { id: 11, url: ASSETS["cloth-1.png"] },
      { id: 12, url: ASSETS["cloth-2.png"] },
    ],
    bids: [
      { amount: 60.0 },
      { amount: 65.0 },
      { amount: 70.0 },
      { amount: 75.0 },
    ],
    totalBids: 4,
    seller: seller2,
  },
};

export const auctionProducts: IProduct[] = [
  {
    ...products["3"],
    seller: seller1,
  },
  {
    ...products["4"],
    seller: seller2,
  },
  {
    ...products["3"],
    seller: seller1,
  },
  {
    ...products["4"],
    seller: seller2,
  },
];

export const newArrivalsProducts: IProduct[] = [
  products["1"],
  products["2"],
  products["1"],
  products["2"],
];

export const luxuryProducts: IProduct[] = [
  products["2"],
  products["1"],
  products["2"],
  products["1"],
];

export const relatedProducts: IProduct[] = [
  products["3"],
  products["1"],
  products["2"],
  products["1"],
  products["2"],
  products["1"],
  products["4"],
  products["1"],
  products["2"],
  products["1"],
  products["2"],
  products["1"],
];

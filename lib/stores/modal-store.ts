import { create } from "zustand";
import type { IProduct, Address, ReviewInResponse } from "@/lib/types";

export enum Modal {
  LoginSignup = "LOGIN_SIGNUP_MODAL",
  ForgetPassword = "FORGET_PASSWORD_MODAL",
  Product = "PRODUCT_MODAL",
  BidPlaced = "BID_PLACED_MODAL",
  AddedToCart = "ADDED_TO_CART_MODAL",
  CreateCloset = "CREATE_CLOSET",
  AddAddress = "ADD_ADDRESS",
  SelectAddress = "SELECT_ADDRESS",
  SizeGuide = "SIZE_GUIDE",
  AuctionWon = "AUCTION_WON",
  AuctionIt = "AUCTION_IT",
  ReviewProduct = "REVIEW_PRODUCT",
}

type ModalStoreDataItems = {
  // Product Modal
  productModalData:
    | { mode: "product"; productId: number }
    | { mode: "story"; influencerId: number };

  // Added to Cart Modal
  addedToCartModalProduct: Pick<IProduct, "images" | "title" | "price">;

  // Add Address
  addAddressModalData:
    | { mode: "add" }
    | { mode: "edit"; address: Partial<Address> };

  selectAddressModalData: {
    onSubmit: (adderssId: number) => void;
  };

  // Size Guide
  sizeGuideModalData: Pick<
    IProduct,
    | "seller"
    | "size"
    | "productHeight"
    | "chestMeasurement"
    | "waistMeasurement"
    | "hipsMeasurement"
  >;

  auctionWonModalData: {
    productId: number;
    bidderId: number;
    amount: number;
    productTitle: string;
    productImage: string;
  };

  auctionItModalData: {
    product: Pick<
      IProduct,
      "images" | "title" | "price" | "startDate" | "endDate"
    >;
    onSubmit: () => void;
  };

  reviewProductModalData: ReviewInResponse;
};

type OpenModalProps =
  | {
      modal: Modal.LoginSignup;
    }
  | {
      modal: Modal.ForgetPassword;
    }
  | {
      modal: Modal.Product;
      data: ModalStoreDataItems["productModalData"];
    }
  | {
      modal: Modal.AddedToCart;
      data: ModalStoreDataItems["addedToCartModalProduct"];
    }
  | {
      modal: Modal.CreateCloset;
    }
  | {
      modal: Modal.AddAddress;
      data: ModalStoreDataItems["addAddressModalData"];
    }
  | {
      modal: Modal.SelectAddress;
      data: ModalStoreDataItems["selectAddressModalData"];
    }
  | {
      modal: Modal.SizeGuide;
      data: ModalStoreDataItems["sizeGuideModalData"];
    }
  | {
      modal: Modal.AuctionWon;
      data: ModalStoreDataItems["auctionWonModalData"];
    }
  | {
      modal: Modal.AuctionIt;
      data: ModalStoreDataItems["auctionItModalData"];
    }
  | {
      modal: Modal.ReviewProduct;
      data: ModalStoreDataItems["reviewProductModalData"];
    };

interface ModalStore {
  // Product Modal
  productModalData: ModalStoreDataItems["productModalData"] | undefined;

  // Added To Cart Modal
  addedToCartModalProduct:
    | ModalStoreDataItems["addedToCartModalProduct"]
    | undefined;

  // Added To Cart Modal
  addAddressModalData: ModalStoreDataItems["addAddressModalData"] | undefined;

  // Select Address Modal
  selectAddressModalData:
    | ModalStoreDataItems["selectAddressModalData"]
    | undefined;

  sizeGuideModalData: ModalStoreDataItems["sizeGuideModalData"] | undefined;

  // Auction Won Data
  auctionWonModalData: ModalStoreDataItems["auctionWonModalData"] | undefined;

  // Auction Won Data
  auctionItModalData: ModalStoreDataItems["auctionItModalData"] | undefined;

  // Review Product
  reviewProductModalData:
    | ModalStoreDataItems["reviewProductModalData"]
    | undefined;

  currentOpenedModal: Modal | null;

  openModal: (props: OpenModalProps) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalStore>()((set) => ({
  currentOpenedModal: null,

  openModal: (props) =>
    set(() => {
      {
        switch (props.modal) {
          case Modal.LoginSignup:
            return { currentOpenedModal: Modal.LoginSignup };
          case Modal.ForgetPassword:
            return { currentOpenedModal: Modal.ForgetPassword };
          case Modal.Product:
            return {
              currentOpenedModal: Modal.Product,
              productModalData: props.data,
            };
          case Modal.AddedToCart:
            return {
              currentOpenedModal: Modal.AddedToCart,
              addedToCartModalProduct: props.data,
            };
          case Modal.CreateCloset:
            return {
              currentOpenedModal: Modal.CreateCloset,
            };
          case Modal.AddAddress:
            return {
              currentOpenedModal: Modal.AddAddress,
              addAddressModalData: props.data,
            };
          case Modal.SelectAddress:
            return {
              currentOpenedModal: Modal.SelectAddress,
              selectAddressModalData: props.data,
            };
          case Modal.SizeGuide:
            return {
              currentOpenedModal: Modal.SizeGuide,
              sizeGuideModalData: props.data,
            };
          case Modal.AuctionWon:
            return {
              currentOpenedModal: Modal.AuctionWon,
              auctionWonModalData: props.data,
            };
          case Modal.AuctionIt:
            return {
              currentOpenedModal: Modal.AuctionIt,
              auctionItModalData: props.data,
            };
          case Modal.ReviewProduct:
            return {
              currentOpenedModal: Modal.ReviewProduct,
              reviewProductModalData: props.data,
            };
          default:
            return {};
        }
      }
    }),

  closeModal: () =>
    set(() => {
      return { currentOpenedModal: null };
    }),

  // Product Modal
  productModalData: undefined,

  // Added To Cart Modal
  addedToCartModalProduct: undefined,

  // Add Address Modal
  addAddressModalData: undefined,

  // Size Guide
  sizeGuideModalData: undefined,

  // Select Address Modal
  selectAddressModalData: undefined,

  // Auction Won
  auctionWonModalData: undefined,

  // Auction It
  auctionItModalData: undefined,

  // Review Product
  reviewProductModalData: undefined,
}));

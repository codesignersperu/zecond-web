"use client";
import ProductModal from "@/components/common/modals/product-modal";
import AddedToCartModal from "@/components/common/modals/added-to-cart-modal";
import LoginSignupModal from "@/components/common/modals/login-signup-modal";
import ForgetPasswordModal from "@/components/common/modals/forget-password-modal";
import CreateClosetModal from "@/components/common/modals/create-closet-modal";
import AuctionWonModal from "@/components/common/modals/auction-won-modal";

export default function GlobalModalsProvider() {
  return (
    <>
      <LoginSignupModal />

      <ForgetPasswordModal />

      <ProductModal />

      <AddedToCartModal />

      <CreateClosetModal />

      <AuctionWonModal />
    </>
  );
}

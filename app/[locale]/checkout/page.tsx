"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ChevronUp, InfoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ASSETS } from "@/lib/constants";
import { PaymentElement, useCheckout } from "@stripe/react-stripe-js";
import { CheckoutProvider } from "@stripe/react-stripe-js";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useGetAddresses, useGetConfig, useGetProducts } from "@/lib/queries";
import { MoonLoader, PulseLoader } from "react-spinners";
import { cn, formatCurrency, imageUrl } from "@/lib/utils";
import { Modal, useModalStore, useGlobalStore } from "@/lib/stores";
import SelectAddressModal from "@/components/common/modals/select-address-modal";
import toast from "react-hot-toast";
import CreateAddressModal from "@/components/common/modals/create-address-modal";
import Checkbox1 from "@/components/common/checkbox-1";
import { useApplyPromoCode, useCheckoutProducts } from "@/lib/mutations";
import {
  Address,
  HttpErrorResponse,
  ProductsResponse,
  PromoCode,
} from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMediaQuery } from "usehooks-ts";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { stripePromise } from "@/lib/config";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function CheckoutPage() {
  useGetConfig(); // refreshing the config
  const t = useTranslations();
  const params = useSearchParams();
  const { user, config } = useGlobalStore();
  const { openModal } = useModalStore();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [mobileSteps, setMobileSteps] = useState<"step1" | "step2" | "step3">(
    "step1",
  );
  const [mobileSummaryModal, setMobileSummaryModal] = useState(false);

  const {
    data: productsRes,
    isSuccess: productsSuccess,
    isLoading: productsLoading,
    isError: productsError,
    error: _productsError,
  } = useGetProducts({
    ids:
      params
        .get("ids")
        ?.split(",")
        .map((v) => +v) || [],
    mode: "checkout",
    userId: user?.id,
    enabled: Boolean(params.get("ids")) && !!user,
  });

  // Product Items

  const [itemsToCheckout, setItemsToCheckout] = useState<number[]>([]);

  useEffect(() => {
    if (productsSuccess) {
      setItemsToCheckout(
        productsRes?.data?.products?.length
          ? productsRes.data.products.map((v) => v.id)
          : [],
      );
    }
  }, [productsRes]);

  function selectAllToggle() {
    if (productsRes?.data?.products.length === itemsToCheckout.length) {
      setItemsToCheckout([]);
    } else if (productsRes?.data) {
      setItemsToCheckout(productsRes.data.products.map((v) => v.id));
    }
  }

  function selectItemToggle(id: number) {
    if (itemsToCheckout.includes(id)) {
      setItemsToCheckout((prev) => prev.filter((v) => v !== id));
    } else {
      setItemsToCheckout((prev) => [...prev, id]);
    }
  }

  // Promo Code
  const [promoCode, setPromoCode] = useState<string>("");
  const [promoRes, setPromoRes] = useState<PromoCode | null>(null);
  const [promoMessage, setPromoMessage] = useState<[boolean, string] | null>(
    null,
  );
  const applyPromoCode = useApplyPromoCode();
  async function onPromoCode(code?: string) {
    try {
      const res = await applyPromoCode.mutateAsync({
        promoCode: code || promoCode,
        for: "products",
      });
      if (!res.data.usable) {
        setPromoMessage([false, `${res.data.invalidReason}`]);
      } else {
        setPromoRes(res.data);
        setPromoMessage([
          true,
          res.data.description || "Promo code applied successfully",
        ]);
      }
    } catch (e) {
      if ((e as HttpErrorResponse).statusCode === 400)
        setPromoMessage([false, "Invalid promo code"]);
      setPromoMessage([false, "Error Occurred"]);
    }
  }
  useEffect(() => {
    const code = params.get("promo");
    if (code) {
      setPromoCode(code);
      onPromoCode(code);
    }
  }, []);

  const subTotal = useMemo(() => {
    if (productsSuccess) {
      return productsRes.data.products.reduce(
        (sum, item) =>
          itemsToCheckout.includes(item.id)
            ? sum + (item.isAuction ? item.bids[0].amount : item.price)
            : sum,
        0,
      );
    } else return 0;
  }, [productsSuccess, productsRes?.data, itemsToCheckout]);

  const total = useMemo(() => {
    let sum = subTotal;

    if (
      promoRes &&
      (!promoRes.minimumAmount || subTotal >= promoRes.minimumAmount)
    ) {
      if (promoRes.discount.type === "percent") {
        sum -= Math.floor(sum * (promoRes.discount.value / 100));
      } else {
        sum -= promoRes.discount.value;
      }
    }

    if (sum > 0) {
      sum += config?.deliveryFee || 0;
    }

    return sum;
  }, [subTotal, promoRes]);

  const checkoutComponentKey = useMemo(
    () =>
      promoRes && promoMessage && promoMessage[0]
        ? `checkout-${itemsToCheckout.join("-")}-promo-${promoRes.code}`
        : `checkout-${itemsToCheckout.join("-")}`,
    [promoRes],
  );

  // Addresses
  const [selectedAddress, setSelectedAddress] = useState(0);

  const {
    data: addressRes,
    isLoading: addressLoading,
    isSuccess: addressSuccess,
  } = useGetAddresses({
    id: selectedAddress || undefined,
    primary: Boolean(selectedAddress),
  });
  function selectAddress(id: number) {
    setSelectedAddress(id);
  }
  useEffect(() => {
    if (addressSuccess && addressRes.data.length) {
      setSelectedAddress(addressRes.data[0].id);
    }
  }, [addressRes]);

  const checkout = useCheckoutProducts();

  // Stripe
  function checkoutSession() {
    return checkout.mutateAsync({
      itemsToCheckout,
      selectedAddress,
      promoCode:
        promoRes && promoMessage && promoMessage[0] ? promoRes.code : undefined,
    });
  }

  if (!config) {
    return (
      <div className="h-[100px] justify-center items-center text-center">
        <p className="text-center text-red-500">{t("common.error-occured")}</p>
      </div>
    );
  }

  if (productsLoading) {
    return (
      <div className="bg-[#f3f3f3] pb-10">
        <div className="h-[350px] col-span-full w-full flex justify-center items-center">
          <MoonLoader color="#989898" size={40} />
        </div>
      </div>
    );
  }

  if (productsError) {
    return (
      <div className="bg-[#f3f3f3] pb-10">
        <div className="h-[350px] col-span-full w-full flex justify-center items-center">
          <p className="text-red-500">{_productsError.message}</p>
        </div>
      </div>
    );
  }

  if (productsSuccess && productsRes?.data?.products.length) {
    // Mobile
    if (isMobile) {
      return (
        <div className="bg-[#f3f3f3] pb-10">
          <Tabs defaultValue="step1" value={mobileSteps}>
            <TabsList className="flex relative h-auto px-5 py-3 justify-between bg-transparent text-[#353E49]">
              {/* steps bar */}
              <div className="absolute top-7 h-[2px] left-10 right-10 bg-[#353E49] z-10"></div>
              <TabsTrigger
                className="flex items-start flex-col z-20 data-[state=active]:shadow-none gap-2 !bg-transparent"
                value={"step1"}
                onClick={() => setMobileSteps("step1")}
              >
                <div className="p-1 size-6 bg-[#353E49] border border-[#353E49] flex justify-center items-center leading-none rounded-full text-sm font-semibold text-white">
                  <span className="mt-1">1</span>
                </div>
                <p className="font-bold">Pedido</p>
              </TabsTrigger>

              <TabsTrigger
                className="flex flex-col z-20 data-[state=active]:shadow-none items-center gap-2 !bg-transparent"
                value="step2"
                onClick={() => {
                  if (itemsToCheckout.length) setMobileSteps("step2");
                  else toast.error(t("cart.select-products-to-checkout"));
                }}
              >
                <div
                  className={cn(
                    "p-1 size-6 border border-[#353E49] flex justify-center items-center leading-none rounded-full text-sm font-semibold",
                    mobileSteps === "step2" || mobileSteps === "step3"
                      ? "bg-[#353E49] text-white"
                      : "bg-white text-[#353E49",
                  )}
                >
                  <span className="mt-1">2</span>
                </div>
                <p className="font-bold">Entrega</p>
              </TabsTrigger>

              <TabsTrigger
                value="step3"
                onClick={() => {
                  if (itemsToCheckout.length && selectedAddress)
                    setMobileSteps("step3");
                  else if (!itemsToCheckout.length)
                    toast.error(t("cart.select-products-to-checkout"));
                  else toast.error(t("checkout.add-address"));
                }}
                className="flex flex-col z-20 data-[state=active]:shadow-none items-end gap-2 !bg-transparent"
              >
                <div
                  className={cn(
                    "p-1 size-6 border border-[#353E49] flex justify-center items-center leading-none rounded-full text-sm font-semibold",
                    mobileSteps === "step3"
                      ? "bg-[#353E49] text-white"
                      : "bg-white text-[#353E49",
                  )}
                >
                  <span className="mt-1">3</span>
                </div>
                <p className="font-bold">Pago</p>
              </TabsTrigger>
            </TabsList>

            {/* Products Selection */}
            <TabsContent
              className="min-h-[calc(100vh-212px)] px-5"
              value={"step1"}
            >
              {/* Products */}
              <div className="space-y-4 mb-8">
                <h2 className="text-lg font-bold px-3">
                  {t("common.products")} ({productsRes?.data?.products.length})
                </h2>
                {/* Items */}
                {productsRes?.data?.products.map((item) => (
                  <MobileItemCard
                    product={item}
                    isSelected={itemsToCheckout.includes(item.id)}
                    toggleItem={selectItemToggle}
                  />
                ))}
              </div>
              {/* Order Summary */}
              <h3 className="text-[#1c1c1c] text-lg font-bold px-4 mb-4">
                {t("common.order-summary")}
              </h3>
              <MobileOrderSummary
                numberOfItems={itemsToCheckout.length}
                subTotal={subTotal}
                total={total}
                promoRes={promoRes}
                className="mb-10"
              />

              <a href="#scroll-top">
                <Button
                  className="w-full h-14 bg-black hover:bg-black/90 uppercase rounded-full text-white font-medium"
                  onClick={() => {
                    if (itemsToCheckout.length) setMobileSteps("step2");
                    else toast.error(t("cart.select-products-to-checkout"));
                  }}
                >
                  {t("common.continue-buying")}
                </Button>
              </a>
            </TabsContent>

            {/* Address Selection */}
            <TabsContent
              className={cn(
                "px-5 flex flex-col",
                mobileSteps === "step2" && "min-h-[calc(100vh-212px)]",
              )}
              value={"step2"}
            >
              <ShowOrderSummary
                total={total}
                openSummaryDrawer={() => setMobileSummaryModal(true)}
                summaryOpen={mobileSummaryModal}
                className="mb-8"
              />

              <div className="mb-5">
                <div className="flex p-3 justify-between items-center">
                  <h2 className="text-lg font-bold">
                    {t("dashboard.my-orders.id.mailing-address")}
                  </h2>
                  {addressSuccess && !addressRes?.data.length && (
                    <Button
                      variant="ghost"
                      className="text-[#424242] font-bold flex items-center"
                      onClick={() =>
                        openModal({
                          modal: Modal.AddAddress,
                          data: { mode: "add" },
                        })
                      }
                    >
                      {t("common.add-address")}
                      <ChevronRight className="ml-1 h-5 w-5" />
                    </Button>
                  )}
                </div>
                {addressLoading ? (
                  <div className="h-[120px] flex justify-center items-center">
                    <MoonLoader size={40} color="#d9d9d9" />
                  </div>
                ) : addressSuccess && addressRes?.data.length ? (
                  <MobileAddressCard
                    address={addressRes.data[0]}
                    openSelectionModal={() =>
                      openModal({
                        modal: Modal.SelectAddress,
                        data: { onSubmit: selectAddress },
                      })
                    }
                  />
                ) : (
                  <div className="h-[120px] flex justify-center items-center gap-2  leading-none text-yellow-300">
                    <InfoIcon className="mb-1" /> {t("checkout.add-address")}
                  </div>
                )}
              </div>

              <DeliveryTimeCard className="border border-neutral-400 rounded-2xl" />

              <a href="#checkout-top" className="block mt-auto">
                <Button
                  className="w-full h-14 bg-black hover:bg-black/90 uppercase rounded-full text-white font-medium"
                  onClick={() => {
                    if (selectedAddress) setMobileSteps("step3");
                    else toast.error(t("checkout.add-address"));
                  }}
                >
                  {t("common.go-to-pay")}
                </Button>
              </a>
            </TabsContent>

            {/* Checkout */}
            <TabsContent
              className={cn(
                "px-5 flex flex-col",
                mobileSteps === "step3" && "min-h-[calc(100vh-212px)]",
              )}
              value={"step3"}
            >
              <ShowOrderSummary
                total={total}
                openSummaryDrawer={() => setMobileSummaryModal(true)}
                summaryOpen={mobileSummaryModal}
                className="mb-8"
              />

              {itemsToCheckout.length && Boolean(selectedAddress) && (
                <CheckoutProvider
                  key={checkoutComponentKey}
                  stripe={stripePromise}
                  options={{
                    fetchClientSecret: checkoutSession,
                    elementsOptions: {
                      appearance: {
                        variables: {
                          borderRadius: "8px",
                          colorPrimary: "#222",
                        },
                        rules: {
                          ".Block:focus": {
                            outline: "none",
                          },
                          ".AccordionItem": {
                            boxShadow: "none",
                            border: "none",
                            outline: "none",
                            margin: "0",
                          },
                        },
                      },
                    },
                  }}
                >
                  <MobileCheckoutForm
                    selectedAddress={selectedAddress}
                    checkoutLoading={checkout.isPending}
                    coupon={{
                      promoCode,
                      setPromoCode,
                      onPromoCode,
                      promoPending: applyPromoCode.isPending,
                      promoMessage,
                    }}
                  />
                </CheckoutProvider>
              )}
            </TabsContent>
          </Tabs>

          {/* Modals */}
          <MobileSummaryDrawer
            products={productsRes?.data?.products}
            promoRes={promoRes}
            total={total}
            subTotal={subTotal}
            drawerOpen={mobileSummaryModal}
            onClose={() => setMobileSummaryModal(false)}
          />
          <CreateAddressModal />
          <SelectAddressModal />
        </div>
      );
    }
    // Web
    return (
      <div className="bg-[#f3f3f3] pb-10">
        <div className="max-w-7xl px-4 py-10 sm:py-8 mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Checkout Details */}
            <div className="xl:col-span-2 space-y-6">
              {/* Products To Checkout */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex gap-5 p-3 pl-7 items-center">
                  <Checkbox1
                    checked={
                      productsRes?.data?.products.length ===
                      itemsToCheckout.length
                    }
                    onChange={selectAllToggle}
                  />
                  <h2 className="text-lg font-bold">
                    {t("common.products")} ({productsRes?.data?.products.length}
                    )
                  </h2>
                </div>
                {/* Items */}
                {productsRes?.data?.products.map((item) => (
                  <ItemCard
                    product={item}
                    isSelected={itemsToCheckout.includes(item.id)}
                    toggleItem={selectItemToggle}
                  />
                ))}
              </div>

              {/* Shipping Address */}
              <div>
                <div className="flex p-3 justify-between items-center">
                  <h2 className="text-lg font-bold">
                    {t("dashboard.my-orders.id.mailing-address")}
                  </h2>
                  <Button
                    variant="ghost"
                    className="text-[#424242] font-bold flex items-center"
                    onClick={() =>
                      !selectedAddress
                        ? openModal({
                            modal: Modal.AddAddress,
                            data: { mode: "add" },
                          })
                        : openModal({
                            modal: Modal.SelectAddress,
                            data: { onSubmit: selectAddress },
                          })
                    }
                  >
                    {!selectedAddress
                      ? t("common.add-address")
                      : t("dashboard.my-orders.id.change-address")}
                    <ChevronRight className="ml-1 h-5 w-5" />
                  </Button>
                </div>
                {addressLoading ? (
                  <div className="h-[120px] flex justify-center items-center">
                    <MoonLoader size={40} color="#d9d9d9" />
                  </div>
                ) : addressSuccess && addressRes?.data.length ? (
                  <AddressCard address={addressRes.data[0]} />
                ) : (
                  <div className="h-[120px] flex justify-center items-center gap-2  leading-none text-yellow-300">
                    <InfoIcon className="mb-1" /> {t("checkout.add-address")}
                  </div>
                )}
              </div>
              {/* Delivery Time */}
              <DeliveryTimeCard />
              {/* Purchase Protection */}
              <PurchaseProtectionCard />
            </div>

            {/* Right Column - Payment Summary */}
            <div className="space-y-6">
              {/* Coupon Code */}
              <CouponCode
                promoCode={promoCode}
                setPromoCode={setPromoCode}
                promoMessage={promoMessage}
                promoPending={applyPromoCode.isPending}
                onPromoCode={onPromoCode}
              />
              {/* Order Summary */}
              <OrderSummary
                subTotal={subTotal}
                promoRes={promoRes}
                total={total}
              />
              {itemsToCheckout.length && Boolean(selectedAddress) && (
                <CheckoutProvider
                  key={checkoutComponentKey}
                  stripe={stripePromise}
                  options={{
                    fetchClientSecret: checkoutSession,
                    elementsOptions: {
                      appearance: {
                        variables: {
                          borderRadius: "8px",
                          colorPrimary: "#222",
                        },
                        rules: {
                          ".Block:focus": {
                            outline: "none",
                          },
                          ".AccordionItem": {
                            boxShadow: "none",
                            border: "none",
                            outline: "none",
                            margin: "0",
                          },
                        },
                      },
                    },
                  }}
                >
                  <CheckoutForm
                    selectedAddress={selectedAddress}
                    checkoutLoading={checkout.isPending}
                  />
                </CheckoutProvider>
              )}
            </div>

            {/* Modals */}
            <CreateAddressModal />
            <SelectAddressModal />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f3f3f3] pb-10">
      <div className="h-[350px] col-span-full text-red-400 w-full flex justify-center items-cent">
        {user && t("checkout.no-checkout-product")}
      </div>
    </div>
  );
}

const CheckoutForm = ({
  selectedAddress,
  checkoutLoading,
}: {
  selectedAddress: number;
  checkoutLoading: boolean;
}) => {
  const t = useTranslations();
  const checkout = useCheckout();
  const [loading, setLoading] = useState(true);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [formReady, setFormReady] = useState(false);
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedAddress) {
      return toast.error(t("checkout.select-address"));
    }
    setPaymentProcessing(true);
    const result = await checkout.confirm();

    if (result.type === "error") {
      // Show error to your customer (for example, payment details incomplete)
      console.log(result.error.message);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
    setPaymentProcessing(false);
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg bg-white shadow-shadow-1 border border-black px-3 pt-[1px]"
    >
      {(checkoutLoading || loading) && (
        <div className="h-[150px] flex justify-center items-center">
          <MoonLoader size={30} color="#989898" />
        </div>
      )}

      <PaymentElement
        options={{ layout: "accordion" }}
        onLoaderStart={() => setLoading(false)}
        onReady={() => setFormReady(true)}
      />

      {formReady && (
        <div className="pt-1 pb-5 px-5 space-y-3">
          {/* Terms and Conditions */}
          <div className="text-sm text-[#898989]">
            <p>
              {t.rich("dashboard.my-orders.id.purchase-agreement", {
                anchor: (chunk) => (
                  <Link
                    href="/privacy"
                    className="text-[#424242] font-medium hover:underline"
                  >
                    {chunk}
                  </Link>
                ),
              })}
            </p>
          </div>
          {/* Complete Purchase Button */}
          <Button
            className="w-full h-14 bg-[#27AE60] hover:bg-[#27AE60]/90 rounded-full text-white text-lg font-medium"
            disabled={paymentProcessing}
          >
            <Image
              src={ASSETS["credit-card-white.svg"] || "/placeholder.svg"}
              alt="Credit Card"
              width={24}
              height={24}
              className="mr-2"
            />
            {t("dashboard.my-orders.id.finish-purchase")}
          </Button>
        </div>
      )}
    </form>
  );
};

const MobileCheckoutForm = ({
  selectedAddress,
  checkoutLoading,
  coupon,
}: {
  selectedAddress: number;
  checkoutLoading: boolean;
  coupon: {
    promoCode: string;
    setPromoCode: React.Dispatch<React.SetStateAction<string>>;
    onPromoCode: () => void;
    promoPending: boolean;
    promoMessage: [boolean, string] | null;
    className?: string;
  };
}) => {
  const t = useTranslations();
  const checkout = useCheckout();
  const [loading, setLoading] = useState(true);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [formReady, setFormReady] = useState(false);
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedAddress) {
      return toast.error(t("checkout.select-address"));
    }
    setPaymentProcessing(true);
    const result = await checkout.confirm();

    if (result.type === "error") {
      // Show error to your customer (for example, payment details incomplete)
      console.log(result.error.message);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
    setPaymentProcessing(false);
  };
  return (
    <form onSubmit={handleSubmit} className="rounded-lg h-full flex flex-col">
      {(checkoutLoading || loading) && (
        <div className="h-[150px] flex justify-center items-center">
          <MoonLoader size={30} color="#989898" />
        </div>
      )}

      <div className="bg-white shadow-shadow-1 border border-neutral-400 px-3 pt-[1px] rounded-2xl mb-8">
        <PaymentElement
          options={{ layout: "accordion" }}
          onLoaderStart={() => setLoading(false)}
          onReady={() => setFormReady(true)}
        />
      </div>

      <div className="mb-5">
        <h3 className="mb-3 text-[#1c1c1c] font-bold">
          {t("common.have-a-coupon")}
        </h3>
        <CouponCode {...coupon} className="border-neutral-400 rounded-2xl" />
      </div>

      <hr className="bg-neutral-300 mb-5" />

      {/* Terms and Conditions */}
      <div className="text-sm text-[#898989] mb-4">
        <p>
          {t.rich("dashboard.my-orders.id.purchase-agreement", {
            anchor: (chunk) => (
              <Link
                href="/privacy"
                className="text-[#424242] font-medium hover:underline"
              >
                {chunk}
              </Link>
            ),
          })}
        </p>
      </div>

      {/* Complete Purchase Button */}
      <Button
        className="w-full mt-auto h-14 bg-[#27AE60] hover:bg-[#27AE60]/90 rounded-full text-white text-lg font-medium"
        disabled={!formReady || paymentProcessing}
      >
        <Image
          src={ASSETS["credit-card-white.svg"] || "/placeholder.svg"}
          alt="Credit Card"
          width={24}
          height={24}
          className="mr-2"
        />
        {t("dashboard.my-orders.id.finish-purchase")}
      </Button>
    </form>
  );
};

const ItemCard = (props: {
  product: ProductsResponse;
  isSelected: boolean;
  toggleItem: (id: number) => void;
}) => {
  const t = useTranslations();
  return (
    <div
      key={props.product.id}
      className={`rounded-lg shadow-shadow-1 p-4 shadow-1 relative overflow-hidden ${props.product.isAuction ? "bg-black text-white" : "bg-white"}`}
    >
      <div className="grid sm:grid-cols-[8fr,2fr,2fr,1fr] gap-4 props.product.products-center">
        {/* Select Product */}

        <div className="col-span-full flex justify-between p-3 border-b border-neutral-200">
          <label
            className="flex items-center gap-2"
            onClick={() => props.toggleItem(props.product.id)}
          >
            <Checkbox1 checked={props.isSelected} onChange={() => {}} />
            <p>
              {props.isSelected ? t("common.selected") : t("common.select")}
            </p>
          </label>

          <p>
            {t("common.sold-by")}:{" "}
            <span className="capitalize">
              {props.product.seller.firstName}{" "}
              {props.product.seller.lastName[0]}
            </span>
          </p>
        </div>
        {/* Product Info */}
        <div className="flex gap-4">
          <div className="flex-1 max-w-[98px] h-[116px] bg-[#F5F5F5] rounded-xl overflow-hidden">
            <Image
              src={imageUrl(props.product.images[0].url) || "/placeholder.svg"}
              alt={props.product.title}
              width={98}
              height={116}
              className="w-full min-w-20 rounded-xl h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-medium">
              <span className="line-clamp-2 break-words">
                {props.product.title}
              </span>
              {props.product.isAuction && (
                <Image
                  src={ASSETS["trophy.svg"] || "/placeholder.svg"}
                  alt="Auction"
                  width={16}
                  height={16}
                  className="inline ml-2"
                />
              )}
            </h3>
            <div
              className={`text-sm ${props.product.isAuction ? "text-white/70" : "text-[#424242]"}`}
            >
              <p>Talla: {props.product.size}</p>
              <p>Color: {props.product.color}</p>
              <p>Marca: {props.product.brand}</p>
            </div>
          </div>
        </div>

        {/* Quantity */}
        <div className="flex items-center sm:justify-center sm:text-center">
          <span className="sm:hidden font-bold mr-2">Cant: </span>1
        </div>

        {/* Price */}
        <div className="flex items-center sm:justify-center sm:text-center">
          <span className="sm:hidden font-bold mr-2">Precio: </span>
          {formatCurrency(
            props.product.isAuction
              ? props.product.bids[0].amount
              : props.product.price,
          )}
        </div>

        {/* Auction Timer */}
        {/* TODO: Fix this for the auctioned products */}
        {/* {item.product.isAuction && item.product?.biddingEndsAt && (
          <div className="sm:absolute bottom-3 right-3 sm:w-[50%] flex item.products-center justify-center bg-[#FED843] text-black rounded-full px-4 h-[30px]">
            Vence en <Countdown date={item.product?.biddingEndsAt} />
          </div>
        )} */}
      </div>
    </div>
  );
};

const MobileItemCard = (props: {
  product: ProductsResponse;
  isSelected: boolean;
  toggleItem: (id: number) => void;
}) => {
  const t = useTranslations();
  return (
    <div
      key={props.product.id}
      className={`rounded-2xl border border-neutral-400 shadow-shadow-1 p-4 shadow-1 relative overflow-hidden ${props.product.isAuction ? "bg-black text-white" : "bg-white"}`}
    >
      <div className="grid grid-cols-[3fr,5fr,2fr] gap-2">
        {/* Select Product */}
        <div className="col-span-full flex justify-between p-3 border-b border-neutral-200">
          <label
            className="flex items-center gap-2"
            onClick={() => props.toggleItem(props.product.id)}
          >
            <Checkbox1 checked={props.isSelected} onChange={() => {}} />
            <p>
              {props.isSelected ? t("common.selected") : t("common.select")}
            </p>
          </label>

          <p className="flex justify-end flex-wrap gap-1">
            <span className="text-right">{t("common.sold-by")}: </span>
            <span className="capitalize text-right">
              {props.product.seller.firstName}{" "}
              {props.product.seller.lastName[0]}
            </span>
          </p>
        </div>

        {/* Product Info */}
        <div className="flex-1 max-w-[98px] h-[116px] bg-[#F5F5F5] rounded-xl overflow-hidden">
          <Image
            src={imageUrl(props.product.images[0].url) || "/placeholder.svg"}
            alt={props.product.title}
            width={98}
            height={116}
            className="w-full min-w-20 rounded-xl h-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="font-medium">
            {/* TODO: Implement text ellipses here */}
            <span className="line-clamp-2 break-words">
              {props.product.title}
            </span>
            {props.product.isAuction && (
              <Image
                src={ASSETS["trophy.svg"] || "/placeholder.svg"}
                alt="Auction"
                width={16}
                height={16}
                className="inline ml-2"
              />
            )}
          </h3>
          <p
            className={`text-sm mt-auto ${props.product.isAuction ? "text-white/70" : "text-[#424242]"}`}
          >
            Talla: {props.product.size} | Marca: {props.product.brand} | Color:{" "}
            {props.product.color}
          </p>
        </div>

        {/* Quantity & Price */}
        <div className="flex flex-col items-end">
          <p className="sm:hidden font-bold mb-2">
            {formatCurrency(props.product.price)}
          </p>
          <p className="sm:hidden font-bold">1</p>
        </div>

        {/* Auction Timer */}
        {/* TODO: Fix this for the auctioned products */}
        {/* {item.product.isAuction && item.product?.biddingEndsAt && (
          <div className="sm:absolute bottom-3 right-3 sm:w-[50%] flex item.products-center justify-center bg-[#FED843] text-black rounded-full px-4 h-[30px]">
            Vence en <Countdown date={item.product?.biddingEndsAt} />
          </div>
        )} */}
      </div>
    </div>
  );
};

const AddressCard = ({ address }: { address: Address }) => {
  return (
    <div className="p-6 flex items-start gap-4 bg-white rounded-lg shadow-shadow-1">
      <div className="mt-1">
        <Image
          src={ASSETS["location-black.svg"] || "/placeholder.svg"}
          alt="Location"
          width={24}
          height={24}
        />
      </div>
      <div>
        <p className="font-medium">{address.recipientName}</p>
        <p>
          {((v) =>
            v
              ? `${v.exteriorReference}, ${v.street}, ${v.neighborhood}, ${v.city}, ${v.municipality}, ${v.state}, ${v.postalCode}`
              : "")(address)}
        </p>
        {address.interiorReference && <p>{address.interiorReference}</p>}
        <p>{address.phoneNumber}</p>
      </div>
    </div>
  );
};

const MobileAddressCard = ({
  address,
  openSelectionModal,
}: {
  address: Address;
  openSelectionModal: () => void;
}) => {
  return (
    <div className="p-6 flex gap-4 bg-white border border-neutral-400 rounded-2xl shadow-shadow-1">
      <div className="mt-1">
        <Image
          src={ASSETS["location-black.svg"] || "/placeholder.svg"}
          alt="Location"
          width={24}
          height={24}
        />
      </div>
      <div className="flex-1">
        <p>
          <span className="font-semibold">{address.recipientName}</span> |{" "}
          <span className="">{address.phoneNumber}</span>
        </p>
        <p>
          {((v) =>
            v
              ? `${v.exteriorReference}, ${v.street}, ${v.neighborhood}, ${v.city}, ${v.municipality}, ${v.state}, ${v.postalCode}`
              : "")(address)}
        </p>
        {address.interiorReference && <p>{address.interiorReference}</p>}
      </div>
      <div
        className="flex justify-center items-center"
        onClick={openSelectionModal}
      >
        <ChevronRight />
      </div>
    </div>
  );
};

const DeliveryTimeCard = ({ className }: { className?: string }) => {
  const t = useTranslations();
  return (
    <div
      className={cn(
        "bg-white rounded-lg overflow-hidden shadow-shadow-1",
        className,
      )}
    >
      <div className="p-6 flex items-center gap-4">
        <Image
          src={ASSETS["shopping-cart-black.svg"] || "/placeholder.svg"}
          alt="Delivery"
          width={24}
          height={24}
        />
        <span className="text-lg">
          {t("common.delivery")}: 3 - 7 días hábiles
        </span>
      </div>
    </div>
  );
};

const PurchaseProtectionCard = () => {
  const t = useTranslations();
  return (
    <div className="px-4">
      <h2 className="text-lg font-bold mb-2">
        {t("dashboard.my-orders.id.purchase-protection")}
      </h2>
      <p className="text-[#424242]">
        {t("dashboard.my-orders.id.purchase-protection-details")}
      </p>
    </div>
  );
};

const CouponCode = ({
  promoCode,
  setPromoCode,
  onPromoCode,
  promoPending,
  promoMessage,
  className,
}: {
  promoCode: string;
  setPromoCode: React.Dispatch<React.SetStateAction<string>>;
  onPromoCode: () => void;
  promoPending: boolean;
  promoMessage: [boolean, string] | null;
  className?: string;
}) => {
  const t = useTranslations();
  return (
    <>
      <form
        className={cn(
          "flex border border-black rounded-lg shadow-shadow-1 overflow-hidden",
          className,
        )}
        onSubmit={(e) => {
          e.preventDefault();
          onPromoCode();
        }}
      >
        <div className="flex-1 relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <Image
              src={ASSETS["coupon-black.svg"] || "/placeholder.svg"}
              alt="Coupon"
              width={24}
              height={24}
            />
          </div>
          <Input
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Introduce tu cupón aquí"
            className="pl-12 h-14 rounded-l-lg rounded-r-none border-r-0"
          />
        </div>
        <Button
          className="h-14 uppercase rounded-l-none bg-black hover:bg-black/90"
          disabled={promoPending}
        >
          {promoPending ? (
            <PulseLoader size={8} color="#fff" />
          ) : (
            t("common.apply")
          )}
        </Button>
      </form>
      {promoMessage && (
        <p className={cn(promoMessage[0] ? "text-green-500" : "text-red-500")}>
          {promoMessage[1]}
        </p>
      )}
    </>
  );
};

const OrderSummary = ({
  promoRes,
  subTotal,
  total,
}: {
  promoRes: PromoCode | null;
  subTotal: number;
  total: number;
}) => {
  const t = useTranslations();
  const { config } = useGlobalStore();

  return (
    <div className="bg-white rounded-lg border border-black  overflow-hidden p-6 shadow-shadow-1">
      <h2 className="text-xl font-bold mb-6">{t("common.order-summary")}</h2>

      <div className="space-y-4">
        <div className="flex justify-between">
          <span>{t("common.total-items")}</span>
          {subTotal ? (
            <span className="font-medium">{formatCurrency(subTotal)}</span>
          ) : (
            <span>-</span>
          )}
        </div>

        <div className="flex justify-between">
          <span>{t("dashboard.my-orders.id.shipping-cost")}</span>
          {subTotal ? (
            <span className="font-medium">
              {formatCurrency(config?.deliveryFee || 0)}
            </span>
          ) : (
            <span>-</span>
          )}
        </div>

        {promoRes &&
          ((amountNoFullfilled) => (
            <div
              className={cn(
                "flex justify-between",
                amountNoFullfilled ? "text-red-500" : "",
              )}
            >
              <span className="flex items-center gap-2">
                {t("common.discount")}
                {amountNoFullfilled && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button type="button">
                          <InfoIcon />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {t.rich("common.minimum-discount-requirement", {
                            minimumAmount: `${promoRes.minimumAmount}`,
                          })}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </span>
              <span>
                - {promoRes.discount.type === "amount" ? "$" : ""}
                {promoRes.discount.value}
                {promoRes.discount.type === "percent" ? "%" : ""}
              </span>
            </div>
          ))(promoRes.minimumAmount && subTotal < promoRes.minimumAmount)}

        <div className="pt-4 border-t border-black ">
          <div className="flex justify-between">
            <span className="text-xl font-bold">Total:</span>
            <span className="text-xl font-bold">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const MobileOrderSummary = ({
  numberOfItems,
  subTotal,
  total,
  promoRes,
  className,
}: {
  numberOfItems: number;
  subTotal: number;
  total: number;
  promoRes: PromoCode | null;
  className?: string;
}) => {
  const { config } = useGlobalStore();
  const t = useTranslations();
  return (
    <div className={cn("text-[#1c1c1c]", className)}>
      <ul className="mb-4">
        <li className="border-b px-4 py-3 border-[#d3d3d3] flex justify-between">
          <p>
            {t("common.total-items")} ({numberOfItems})
          </p>
          {subTotal ? (
            <h4 className="font-bold">{formatCurrency(subTotal)}</h4>
          ) : (
            <span>-</span>
          )}
        </li>
        <li className="border-b px-4 py-3 border-[#d3d3d3] flex justify-between">
          <p>{t("dashboard.my-orders.id.shipping-cost")}</p>
          {subTotal ? (
            <h4 className="font-bold">${config?.deliveryFee.toFixed(2)}</h4>
          ) : (
            <span>-</span>
          )}
        </li>

        {promoRes &&
          ((amountNoFullfilled) => (
            <li
              className={cn(
                "border-b px-4 py-3 border-[#d3d3d3] flex justify-between",
                amountNoFullfilled ? "text-red-500" : "",
              )}
            >
              <span className="flex items-center gap-2">
                {t("common.discount")}
                {amountNoFullfilled && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button type="button">
                          <InfoIcon />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {t.rich("common.minimum-discount-requirement", {
                            minimumAmount: `${promoRes.minimumAmount}`,
                          })}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </span>
              <span>
                - {promoRes.discount.type === "amount" ? "S/" : ""}
                {promoRes.discount.value}
                {promoRes.discount.type === "percent" ? "%" : ""}
              </span>
            </li>
          ))(promoRes.minimumAmount && subTotal < promoRes.minimumAmount)}
      </ul>
      <h3 className="flex justify-between px-4 text-xl font-bold">
        <span>Total</span>
        <span>{formatCurrency(total ? total : 0)}</span>
      </h3>
    </div>
  );
};

const ShowOrderSummary = (props: {
  total: number;
  summaryOpen: boolean;
  openSummaryDrawer: () => void;
  className?: string;
}) => {
  const t = useTranslations();
  return (
    <div
      className={cn(
        "flex justify-between bg-white items-center text-[#1c1c1c] font-bold px-5 py-3 rounded-2xl border border-neutral-400 shadow-shadow-1",
        props.className,
      )}
      onClick={props.openSummaryDrawer}
    >
      <p className="text-base flex gap-2 items-center">
        {t("common.show-order-summary")}{" "}
        <ChevronUp
          className={cn(
            "transition-transform mb-1",
            props.summaryOpen && "rotate-180",
          )}
        />
      </p>

      <h3 className="text-xl">{formatCurrency(props.total)}</h3>
    </div>
  );
};

const MobileSummaryDrawer = ({
  drawerOpen,
  onClose,
  products,
  promoRes,
  subTotal,
  total,
  className,
}: {
  drawerOpen: boolean;
  onClose: () => void;
  products: ProductsResponse[];
  promoRes: PromoCode | null;
  subTotal: number;
  total: number;
  className?: string;
}) => {
  const t = useTranslations();
  return (
    <Drawer open={drawerOpen} onClose={onClose}>
      <DrawerContent
        className={cn("max-h-[80vh] p-8 pt-4 rounded-t-[30px]", className)}
      >
        <div className="flex-1 w-16 min-h-3 rounded-full bg-neutral-300 mx-auto mb-7"></div>
        <DrawerTitle className="mb-3 text-2xl font-semibold text-left">
          {t("common.order-summary")}
        </DrawerTitle>

        <div className="overflow-y-auto">
          {products.map((product) => {
            return (
              <div
                className="grid grid-cols-[1fr,4fr,1fr] py-3 border-b border-neutral-300 gap-2"
                key={product.id}
              >
                <div className="flex-1 w-[45px] aspect-[4/5] bg-[#F5F5F5] rounded-xl overflow-hidden">
                  <Image
                    src={imageUrl(product.images[0].url) || "/placeholder.svg"}
                    alt={product.title}
                    width={45}
                    height={69}
                    className="w-full rounded-xl h-full object-cover"
                  />
                </div>

                <div>
                  <h3 className="line-clamp-2 break-word">{product.title}</h3>
                </div>

                {/* Price */}
                <div className="font-bold">{formatCurrency(product.price)}</div>
              </div>
            );
          })}
        </div>
        <MobileOrderSummary
          numberOfItems={products.length}
          promoRes={promoRes}
          subTotal={subTotal}
          total={total}
          className="mb-10"
        />
      </DrawerContent>
    </Drawer>
  );
};

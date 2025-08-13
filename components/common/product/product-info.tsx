"use client";

import { useTranslations } from "next-intl";
import type { AuctionStatus, IProduct } from "@/lib/types";
import { cn, imageUrl } from "@/lib/utils";
import { Heart } from "lucide-react";
import { ChevronUp } from "lucide-react";
import { useGlobalStore } from "@/lib/stores";
import { useToggleFavoriteProducts } from "@/lib/mutations";
import { useState } from "react";
import Countdown from "react-countdown";
import { useLoginPass } from "@/lib/hooks";

type IProductInfo = Pick<
  IProduct,
  | "id"
  | "isAuction"
  | "title"
  | "description"
  | "price"
  | "size"
  | "color"
  | "colorCode"
  | "brand"
  | "brandImage"
  | "seller"
  | "bids"
>;

type IProductInfoProps = (
  | {
      cardType: "modal" | "page" | "drawer";
    }
  | {
      cardType: "drawerTrigger";
      trigger: () => void;
    }
  | {
      cardType: "page-mobile";
      auctionStatus: AuctionStatus | null;
      biddingEndsAt: string;
      setRecalcStatus: () => void;
    }
) & {
  product: IProductInfo | null;
  className?: string;
};

export default function ProductInfo(props: IProductInfoProps) {
  const t = useTranslations();
  const { favoriteProducts } = useGlobalStore();
  const loginPass = useLoginPass();
  const isFavorite = favoriteProducts.includes(
    props.product ? props.product?.id : 0,
  );
  const _toggleFavorite = useToggleFavoriteProducts();
  const [descriptionOpen, setDescriptionOpen] = useState(false);

  function toggleFavorite() {
    loginPass(() =>
      _toggleFavorite.mutate(props.product ? props.product?.id : 0),
    );
  }

  if (!props.product) {
    return <></>;
  }

  if (props.cardType === "drawerTrigger") {
    return (
      <div
        className={cn(
          "md:hidden bg-white z-10 shadow-lg rounded-lg rounded-b-2xl space-y-3 px-6 py-3",
          props.className,
        )}
      >
        <PriceToggleFav
          isAuction={props.product.isAuction}
          isFavorite={isFavorite}
          buttonDisabled={_toggleFavorite.isPending}
          price={props.product.price}
          toggleFavorite={toggleFavorite}
        />

        <Heading
          heading={props.product.title}
          cardType={props.cardType}
          className="text-left"
        />

        {/* Drawer Trigger */}
        <div className="w-fit mx-auto">
          {" "}
          <div
            onClick={props.trigger}
            className="flex text-neutral-500 font-bold flex-col items-center"
          >
            <ChevronUp className="w-6 h-6 stroke-[2.5px] text-3xl" />
            <p className="-mt-1 uppercase">{t("common.see-more")}</p>
          </div>
        </div>
      </div>
    );
  }

  if (props.cardType === "drawer") {
    return (
      <div className={cn("space-y-4 py-6", props.className)}>
        <PriceToggleFav
          isAuction={props.product.isAuction}
          isFavorite={isFavorite}
          buttonDisabled={_toggleFavorite.isPending}
          price={props.product.price}
          toggleFavorite={toggleFavorite}
        />

        <Heading
          heading={props.product.title}
          cardType={props.cardType}
          className="text-left mb-4"
        />

        <SizeColorBrand
          cardType={props.cardType}
          product={props.product}
          className="px-3"
        />
      </div>
    );
  }

  if (props.cardType === "page-mobile") {
    return (
      <div className={cn("space-y-5 pb-6", props.className)}>
        <PriceToggleFav
          isAuction={props.product.isAuction}
          isFavorite={isFavorite}
          buttonDisabled={_toggleFavorite.isPending}
          price={props.product.price}
          toggleFavorite={toggleFavorite}
        />

        <Heading
          heading={props.product.title}
          cardType={props.cardType}
          className="text-center px-3 mt-6"
        />

        <p className="px-3">
          <span className="font-semibold">{t("common.sold-by")}:</span>{" "}
          <span className="capitalize">
            {props.product.seller.firstName} {props.product.seller.lastName}
          </span>
        </p>

        {props.product.isAuction && (
          <>
            {props.auctionStatus && props.auctionStatus !== "ended" && (
              <div className="bg-[#1374aa] text-white p-4 rounded-full">
                <p className="text-lg font-medium text-center">
                  {props.auctionStatus === "has-to-start-yet"
                    ? t("common.starts-in")
                    : t("common.ends-in")}{" "}
                  <Countdown
                    date={props.biddingEndsAt as any}
                    renderer={({ days, hours, minutes, seconds }) => (
                      <p className="min-[440px]:inline">
                        {days}d : {hours}h : {minutes}m : {seconds}s
                      </p>
                    )}
                    onComplete={props.setRecalcStatus}
                  />
                </p>
              </div>
            )}

            <div className="px-3 mb-2 grid grid-cols-2">
              <p className="font-semibold text-[#424242]">
                N de Propuestas:{" "}
                <span className="text-xl font-bold ml-1">
                  {props.product.bids.length}
                </span>
              </p>
              {!!props.product.bids.length && (
                <p className="font-semibold text-[#424242]">
                  Oferta mas alta:{" "}
                  <span className="text-xl font-bold ml-1">
                    ${props.product.bids[0].amount}
                  </span>
                </p>
              )}
            </div>
          </>
        )}

        <SizeColorBrand
          cardType={props.cardType}
          product={props.product}
          className="px-3"
        />
      </div>
    );
  }

  return (
    <div className={cn("space-y-4 py-6", props.className)}>
      <Heading
        heading={props.product.title}
        cardType={props.cardType}
        className="mb-4"
      />

      {props.cardType !== "modal" && (
        <pre
          className={cn(
            "text-[#424242] font-sans text-lg break-words text-wrap max-h-[500px]",
            props.cardType === "page" && "cursor-pointer",
            props.cardType === "page" && descriptionOpen
              ? "overflow-y-auto"
              : "line-clamp-3",
          )}
          onClick={() => setDescriptionOpen((prev) => !prev)}
        >
          {props.product.description}
        </pre>
      )}

      <PriceToggleFav
        isAuction={props.product.isAuction}
        isFavorite={isFavorite}
        buttonDisabled={_toggleFavorite.isPending}
        price={props.product.price}
        toggleFavorite={toggleFavorite}
      />

      <SizeColorBrand cardType={props.cardType} product={props.product} />
    </div>
  );
}

function SizeColorBrand(props: {
  product: Pick<
    IProduct,
    "size" | "color" | "colorCode" | "brand" | "brandImage"
  >;
  cardType: IProductInfoProps["cardType"];
  className?: string;
}) {
  const t = useTranslations();
  const productSizes = {
    XS: t("sizes.XS"),
    S: t("sizes.S"),
    M: t("sizes.M"),
    L: t("sizes.L"),
    XL: t("sizes.XL"),
    XXL: t("sizes.XXL"),
  };
  return (
    <div
      className={cn(
        "flex justify-between sm:grid grid-cols-3 gap-8 !mt-8",
        props.className,
      )}
    >
      <div
        className={cn("space-y-2", props.cardType === "modal" && "space-y-0")}
      >
        <h3
          className={cn(
            "text-lg font-bold capitalize text-black text-center",
            props.cardType === "modal" && "text-xl",
          )}
        >
          {t("product.info.size")}:
        </h3>
        <div className="flex flex-col space-y-1 items-center">
          <div
            className={cn(
              "size-16 sm:size-12 rounded-full border border-black bg-white flex leading-none items-center justify-center text-xl",
              props.cardType === "modal" && "size-8 text-lg",
            )}
          >
            <span className="h-6">{props.product.size}</span>
          </div>
          <span
            className={cn(
              "text-center",
              props.cardType === "modal" && "text-sm",
            )}
          >
            {productSizes[props.product ? props.product.size : "S"]}
          </span>
        </div>
      </div>

      {props.product.color && (
        <div
          className={cn("space-y-2", props.cardType === "modal" && "space-y-0")}
        >
          <h3
            className={cn(
              "text-lg font-bold capitalize text-black text-center",
              props.cardType === "modal" && "text-xl",
            )}
          >
            {t("product.info.color")}:
          </h3>
          <div className="flex flex-col space-y-1 items-center">
            <div
              className={cn(
                "size-16 sm:size-12 rounded-full border",
                props.cardType === "modal" && "size-8",
              )}
              style={{
                backgroundColor: props.product.colorCode || "#f5f5f5",
              }}
            ></div>
            <span
              className={cn(
                "text-center",
                props.cardType === "modal" && "text-sm",
              )}
            >
              {props.product.color}
            </span>
          </div>
        </div>
      )}

      <div
        className={cn("space-y-2", props.cardType === "modal" && "space-y-0")}
      >
        <h3
          className={cn(
            "text-lg font-bold capitalize text-black text-center",
            props.cardType === "modal" && "text-xl",
          )}
        >
          {t("product.info.brand")}:
        </h3>
        <div className="flex flex-col space-y-1 justify-center items-center">
          <img
            src={imageUrl(props.product.brandImage)}
            alt={props.product.brand}
            className={cn(
              "size-16 object-cover object-center sm:size-12 rounded-full border border-black",
              props.cardType === "modal" && "size-8",
            )}
          />
          <span
            className={cn(
              "text-center",
              props.cardType === "modal" && "text-sm",
            )}
          >
            {props.product.brand}
          </span>
        </div>
      </div>

      {!props.product.color && <div className="size-16 sm:size-12"></div>}
    </div>
  );
}

function PriceToggleFav(props: {
  isAuction: boolean;
  price: number;
  toggleFavorite: () => void;
  buttonDisabled: boolean;
  isFavorite: boolean;
  className?: string;
}) {
  const t = useTranslations();

  return (
    <div className="px-3 flex justify-between items-start">
      <div className={cn("text-[27px] font-bold")}>
        {props.isAuction ? (
          <span className="text-base font-normal">
            {t("product.info.from")}
          </span>
        ) : (
          ""
        )}{" "}
        <span>$</span>{" "}
        {(([price, decimal]) => (
          <>
            <span className="text-4xl">{price}</span>
            <span>.</span>
            <span>{decimal}</span>
          </>
        ))(props.price.toFixed(2).split("."))}
      </div>
      <button
        onClick={props.toggleFavorite}
        disabled={props.buttonDisabled}
        className={cn(
          "size-10 rounded-full border border-black flex items-center justify-center transition-colors",
        )}
      >
        <Heart
          className={cn(
            "w-5 h-5 transition-colors",
            props.isFavorite
              ? "fill-red-500 stroke-red-500"
              : "stroke-gray-400",
          )}
        />
      </button>
    </div>
  );
}

function Heading(props: {
  heading: string;
  className?: string;
  cardType: IProductInfoProps["cardType"];
}) {
  return (
    <h2
      className={cn(
        "text-2xl font-bold text-black line-clamp-3",
        props.cardType === "modal" && "text-[22px]",
        props.cardType === "drawerTrigger" &&
          "text-[20px] leading-tight text-neutral-600 line-clamp-2",
      )}
    >
      {props.heading}
    </h2>
  );
}

"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Search, Plus } from "lucide-react";
import { ProductStatus } from "@/lib/types";
import { ASSETS } from "@/lib/constants";
import SalesProductCard from "@/components/common/product/sales-product-card";
import AuctionItModal from "@/components/common/modals/auction-it-modal";
import DeleteProductModal from "@/components/common/product/delete-product-modal";
import { useGetMyProducts } from "@/lib/queries";
import { Modal, useModalStore } from "@/lib/stores";
import { useUpdateProduct } from "@/lib/mutations";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ProductAction =
  | `${ProductStatus}`
  | "delete"
  | "edit"
  | "compare"
  | "auction";

export default function SalesPage() {
  const router = useRouter();
  const t = useTranslations();
  const { openModal } = useModalStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteProduct, setDeleteProduct] = useState<number | null>(null);
  const [actionDrawerOpen, setActionDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<number>(0);
  const [page, setPage] = useState<number | null>(null);

  const { data: myProducts, isLoading } = useGetMyProducts({
    page: page || 1,
  });

  const filteredProducts = useMemo(() => {
    if (!myProducts?.data) return [];
    return myProducts.data.products.filter((product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [myProducts, searchQuery]);

  const updateProduct = useUpdateProduct();

  function productAction(productId: number, action: ProductAction) {
    const product = myProducts?.data?.products.find((v) => v.id === productId);
    if (!product) return;

    switch (action) {
      case ProductStatus.SOLD:
        router.push(`/user-dashboard/sales/orders/${productId}`);
        break;
      case ProductStatus.DRAFT:
        if (product.isAuction) {
          openModal({
            modal: Modal.AuctionIt,
            data: {
              product: product,
              onSubmit: () => publishProduct(productId, true),
            },
          });
        } else publishProduct(productId);

        break;
      case ProductStatus.LIVE:
        break;
      case "auction":
        break;
      case "edit":
        router.push(`/user-dashboard/sales/publications/edit/${productId}`);
        break;
      case "delete":
        setDeleteProduct(productId);
        break;
      case "compare":
        // Implement compare functionality
        break;
    }
  }

  function publishProduct(productId: number, confirmation: boolean = false) {
    if (!confirmation) confirmation = confirm(t("products.make-product-live"));
    if (!confirmation) return;
    updateProduct.mutate({
      id: productId.toString(),
      status: ProductStatus.LIVE,
    });
  }

  function openActionDrawer(productId: number) {
    setSelectedProduct(productId);
    setActionDrawerOpen(true);
  }

  return (
    <>
      <div className="container mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col min-[1230px]:flex-row min-[1230px]:items-center min-[1230px]:justify-between gap-4">
          <h1 className="text-2xl font-bold text-center sm:text-left">
            {t("navigation.dashboard.your-publications")}{" "}
            <span className="text-xl font-normal">
              {myProducts?.data && `(${myProducts?.data?.pagination.total})`}
            </span>
          </h1>

          <div className="grid sm:flex flex-row items-center gap-4">
            {/* Search Bar */}
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder={t("common.search-your-publications")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-[300px] rounded-full bg-[#F8F8F8] pl-10 border-0 focus-visible:ring-0"
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div>{t("common.loading")}</div>
        ) : !myProducts?.data?.products.length ? (
          <div>{t("products.no-products-published")}</div>
        ) : (
          <div>
            <div
              className={cn(
                "w-fit mx-auto mb-6",
                !myProducts?.data?.products?.length ||
                  !myProducts?.data?.pagination?.prevPage
                  ? "hidden"
                  : "",
              )}
            >
              <Button
                variant="default"
                className="rounded-full uppercase bg-black !h-[40px] border-0 text-white"
                onClick={() => setPage((prev) => (prev ? prev - 1 : 1))}
                disabled={!myProducts?.data?.pagination?.prevPage}
              >
                {t("common.previous")}
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-[10px] sm:gap-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mb-8">
              {filteredProducts.map((product) => (
                <SalesProductCard
                  key={product.id}
                  {...product}
                  productAction={productAction}
                  openActionDrawer={openActionDrawer}
                />
              ))}
            </div>
            <div className="w-fit mx-auto">
              <Button
                variant="default"
                className="rounded-full uppercase bg-black !h-[40px] border-0 text-white"
                onClick={() => setPage((prev) => (prev ? prev + 1 : 1))}
                disabled={!myProducts?.data?.pagination?.nextPage}
              >
                {t("common.see-more")}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modals/Drawers */}

      <AuctionItModal />
      <DeleteProductModal
        isOpen={!!deleteProduct}
        onClose={() => setDeleteProduct(null)}
        product={
          filteredProducts.filter((product) => product.id === deleteProduct)[0]
        }
      />

      {/* Publication Actions */}
      <ActionDrawer
        open={actionDrawerOpen}
        openChange={() => setActionDrawerOpen(false)}
        onAction={(action) => productAction(selectedProduct, action)}
      />
    </>
  );
}

function ActionDrawer({
  open,
  openChange,
  onAction,
}: {
  open: boolean;
  openChange: () => void;
  onAction: (action: ProductAction) => void;
}) {
  const t = useTranslations();

  const actions: Array<{
    action: ProductAction;
    label: string;
    icon: string;
  }> = [
    {
      action: "auction",
      label: t("common.auction"),
      icon: ASSETS["flash-black.svg"],
    },
    {
      action: "delete",
      label: t("common.delete"),
      icon: ASSETS["trash-solid-black.svg"],
    },
    {
      action: "edit",
      label: t("common.edit"),
      icon: ASSETS["edit-black.svg"],
    },
    {
      action: "compare",
      label: t("common.compare"),
      icon: ASSETS["out-link-black.svg"],
    },
  ];

  return (
    <Drawer open={open} onOpenChange={openChange}>
      <DrawerContent className="!rounded-t-[40px]">
        <div className="p-7 pt-3">
          <div className="w-[54px] h-[10px] rounded-full bg-[#d9d9d9] mx-auto mb-6" />
          <div className="space-y-4">
            {actions.map((action) => (
              <button
                key={action.action}
                className="flex w-full items-center gap-4"
                onClick={() => {
                  openChange();
                  onAction(action.action);
                }}
              >
                <span className="w-10 h-10 flex justify-center items-center rounded-full bg-[#e9e9e9]">
                  <img
                    src={action.icon}
                    alt={action.label}
                    className="w-4 h-4"
                  />
                </span>
                <span className="text-sm font-bold uppercase">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

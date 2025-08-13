"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProductCard from "@/components/common/product/product-card";
import { useTranslations } from "next-intl";
import {
  useGetBrands,
  useGetColors,
  useGetInfiniteProducts,
  useGetProducts,
} from "@/lib/queries";
import { PulseLoader } from "react-spinners";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AccessoriesSvg,
  CapsSvg,
  CoatsSvg,
  DressesSvg,
  HeelsSvg,
  HoodiesSvg,
  JacketsSvg,
  LadiesPantsSvg,
  LadiesPolosSvg,
  LadiesShirtsSvg,
  PantsSvg,
  PolosSvg,
  ShirtsSvg,
  ShoesSvg,
  ShortsSvg,
  SkirtsSvg,
  StrapsSvg,
  TopsSvg,
} from "@/components/svgs/subcategories";
import { useGetCategories } from "@/lib/queries";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation } from "swiper/modules";
import { GetProductsSearchParams } from "@/lib/types";
import { cn, generateQueryParams } from "@/lib/utils";
import InfiniteScroll from "react-infinite-scroll-component";

type Category = Record<
  string,
  {
    link: string;
    category: undefined | null | string;
    subcategories: [string, string][];
  }
>;

const subcategoriesIcons = {
  accessories: <AccessoriesSvg />,
  caps: <CapsSvg />,
  coats: <CoatsSvg />,
  dresses: <DressesSvg />,
  heels: <HeelsSvg />,
  hoodies: <HoodiesSvg />,
  jackets: <JacketsSvg />,
  "ladies-pants": <LadiesPantsSvg />,
  "ladies-polos": <LadiesPolosSvg />,
  "ladies-shirts": <LadiesShirtsSvg />,
  pants: <PantsSvg />,
  polos: <PolosSvg />,
  shirts: <ShirtsSvg />,
  shoes: <ShoesSvg />,
  shorts: <ShortsSvg />,
  skirts: <SkirtsSvg />,
  straps: <StrapsSvg />,
  tops: <TopsSvg />,
};

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

export default function ProductsPage() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const router = useRouter();
  const getCategories = useGetCategories();
  const getBrands = useGetBrands();
  const getColors = useGetColors();

  // Remove local page state, infinite query manages pagination
  // const [page, setPage] = useState<number | null>(null);
  const [productQuery, setProductQuery] = useState<string | null>(null);
  const [selectedSort, setSelectedSort] = useState<
    GetProductsSearchParams["sort"] | null
  >(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(
    null,
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [isFeatured, setIsFeatured] = useState<boolean | null>(null);

  useEffect(() => {
    let query = searchParams.get("query");
    query &&= decodeURI(query);
    setProductQuery(query);

    let changedSort = searchParams.get("sort");
    setSelectedSort(changedSort as any);

    let changedCategory = searchParams.get("category");
    changedCategory &&= decodeURI(changedCategory);
    setSelectedCategory(changedCategory);

    let changedSubcategory = searchParams.get("subcategory");
    changedSubcategory &&= decodeURI(changedSubcategory);
    setSelectedSubCategory(changedSubcategory);

    let changedSize = searchParams.get("size");
    setSelectedSize(changedSize);

    let changedColor = searchParams.get("color");
    changedColor &&= decodeURI(changedColor);
    setSelectedColor(changedColor);

    let changedBrand = searchParams.get("brand");
    changedBrand &&= decodeURI(changedBrand);
    setSelectedBrand(changedBrand);

    let featuredChange = searchParams.get("isFeatured");
    setIsFeatured(
      featuredChange === "true"
        ? true
        : featuredChange === "false"
          ? false
          : null,
    );
  }, [searchParams]);

  // Push all params except page to the url to keep filters synced
  useEffect(() => {
    const params = generateQueryParams({
      query: productQuery,
      category: selectedCategory,
      subcategory: selectedSubCategory,
      sort: selectedSort,
      size: selectedSize,
      color: selectedColor,
      brand: selectedBrand,
      isFeatured,
    });

    if (params) {
      router.push(`/products?${params}`);
    }
  }, [
    productQuery,
    selectedCategory,
    selectedSubCategory,
    selectedSort,
    selectedSize,
    selectedColor,
    selectedBrand,
    isFeatured,
  ]);

  const sortOptions = [
    { title: t("products.sort-options.price-low-to-high"), key: "price-asc" },
    { title: t("products.sort-options.price-high-to-low"), key: "price-desc" },
    { title: t("products.sort-options.newest"), key: "desc" },
    { title: t("products.sort-options.oldest"), key: "asc" },
  ];
  const categories: Category = useMemo(() => {
    if (!getCategories.data) return {};
    const prev: Category = {
      Todos: {
        link: "/products",
        category: null,
        subcategories: [
          ...new Set(
            Object.values(getCategories.data.data).reduce(
              (acc, curr) => [...acc, ...curr.subcategories],
              [] as [string, string][],
            ),
          ),
        ],
      },
      Subastas: {
        link: "/auctions",
        category: undefined,
        subcategories: [],
      },
    };
    const _new: Category = {};
    for (let key of Object.keys(getCategories.data.data)) {
      _new[key] = {
        link: `?category=${key}`,
        category: key,
        subcategories: getCategories.data.data[key].subcategories,
      };
    }
    return { ...prev, ..._new };
  }, [getCategories.data]);

  // Use infinite query instead of single page query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useGetInfiniteProducts({
    limit: 24,
    query: productQuery ?? undefined,
    sort: selectedSort ?? undefined,
    category: selectedCategory ?? undefined,
    subcategory: selectedSubCategory ?? undefined,
    color: selectedColor ?? undefined,
    size: selectedSize ?? undefined,
    brand: selectedBrand ?? undefined,
    isFeatured: isFeatured ?? undefined,
  });

  const allProducts = data?.pages
    ? data.pages.flatMap((page) => page.data.products)
    : [];

  const noProducts = !isLoading && (!allProducts || allProducts.length === 0);

  return (
    <main className="container mx-auto p-4 sm:py-8">
      {/* Filters and categories */}
      {getCategories.isLoading ? (
        <div className="h-[100px] flex justify-center items-center">
          <PulseLoader color="#d9d9d9" />
        </div>
      ) : (
        !!categories && (
          <>
            <div className="flex md:hidden justify-center flex-wrap gap-4 px-3 overflow-x-auto no-scrollbar sm:gap-8 mx-auto mb-5 sm:mb-8">
              {Object.keys(categories).map((category) => (
                <div
                  key={category}
                  className="flex cursor-pointer gap-1 flex-col items-center"
                  onClick={() => {
                    setSelectedSubCategory(null);
                    if (category === "Todos" || category === "Subastas") {
                      router.push(categories[category].link);
                    } else {
                      setSelectedCategory(category);
                    }
                  }}
                >
                  <p className="text-sm min-[470px]:text-base text-center font-bold capitalize text-[#3e3e3e]">
                    {category}
                  </p>

                  {selectedCategory === categories[category].category ? (
                    <div className="w-[18px] h-[5px] bg-[#3e3e3e] rounded-full"></div>
                  ) : null}
                </div>
              ))}
            </div>

            {/* Subcategories */}
            <div className="max-w-3xl mx-auto px-5 relative mb-6 sm:mb-8">
              {((category, subcategories) => (
                <>
                  {/* Left Arrow */}
                  <div className="swiper-navigation-btn cursor-pointer absolute products-subcategories-prev top-[25px] left-0 sm:-left-2">
                    <ChevronLeft />
                  </div>

                  <Swiper
                    className="!px-3"
                    modules={[Navigation, FreeMode]}
                    slidesPerView={3}
                    slidesPerGroup={2}
                    spaceBetween={24}
                    navigation={{
                      prevEl: ".products-subcategories-prev",
                      nextEl: ".products-subcategories-next",
                    }}
                    breakpoints={{
                      420: {
                        slidesPerView: 4,
                        slidesPerGroup: 3,
                      },
                      560: {
                        slidesPerView: 5,
                        slidesPerGroup: 4,
                      },
                      768: {
                        slidesPerView: 6,
                        slidesPerGroup: 5,
                      },
                    }}
                  >
                    {subcategories.map(([title, iconKey], idx) => (
                      <SwiperSlide
                        key={title + idx}
                        className="!flex !justify-center px-3"
                      >
                        <div
                          className="flex cursor-pointer flex-col items-center"
                          onClick={() => {
                            if (title === selectedSubCategory) {
                              setSelectedSubCategory(null);
                            } else {
                              setSelectedSubCategory(title);
                            }
                          }}
                        >
                          <div
                            className={cn(
                              "flex size-[62px] min-[450px]:size-[72px] transition-all text-black justify-center items-center mb-2 p-1 border border-black rounded-full",
                              title === selectedSubCategory
                                ? "bg-black text-white"
                                : "hover:shadow-lg",
                            )}
                          >
                            {subcategoriesIcons[iconKey]}
                          </div>
                          <p className="text-sm min-[450px]:text-base text-center">
                            {title}
                          </p>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>

                  {/* Right Arrow */}
                  <div className="swiper-navigation-btn cursor-pointer absolute products-subcategories-next top-[25px] right-0 sm:-right-2">
                    <ChevronRight />
                  </div>
                </>
              ))(
                selectedCategory,
                (selectedCategory
                  ? categories[selectedCategory as any]
                  : categories["Todos"]
                )?.subcategories || [],
              )}
            </div>
          </>
        )
      )}

      <div className="flex flex-wrap min-[450px]:flex-nowrap gap-1 sm:gap-4 w-fit mx-auto mb-8">
        {/* Sort */}
        <Select
          onValueChange={(v) => setSelectedSort(v as any)}
          name={"sort"}
          value={`${selectedSort}`}
        >
          <SelectTrigger className="rounded-full bg-[#F5F5F5] border-0 text-[#424242] px-4 sm:px-6 gap-1 sm:py-2">
            <SelectValue placeholder={t("products.filters.sort-by")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem disabled value={"null"}>
              {t("products.filters.sort-by")}
            </SelectItem>
            {sortOptions.map((option) => (
              <SelectItem value={option.key}>{option.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Size */}
        <Select
          onValueChange={(v) => v && setSelectedSize(v as any)}
          name={"size"}
          value={`${selectedSize}`}
        >
          <SelectTrigger className="rounded-full bg-[#F5F5F5] border-0 text-[#424242] px-4 sm:px-6 gap-1 sm:py-2">
            <SelectValue placeholder={t("products.filters.size")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem disabled value={"null"}>
              {t("products.filters.size")}
            </SelectItem>
            {sizes.map((option) => (
              <SelectItem value={option}>{option}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Color */}
        <Select
          onValueChange={(v) => v && setSelectedColor(v as any)}
          name={"color"}
          value={`${selectedColor}`}
        >
          <SelectTrigger className="rounded-full bg-[#F5F5F5] border-0 text-[#424242] px-4 sm:px-6 gap-1 sm:py-2">
            <SelectValue placeholder={t("products.filters.color")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem disabled value={"null"}>
              {t("products.filters.color")}
            </SelectItem>
            {(getColors.isSuccess ? getColors.data.data : []).map(([color]) => (
              <SelectItem value={color}>{color}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Brand */}
        <Select
          onValueChange={(v) => v && setSelectedBrand(v as any)}
          name={"brand"}
          value={`${selectedBrand}`}
        >
          <SelectTrigger className="rounded-full bg-[#F5F5F5] border-0 text-[#424242] px-4 sm:px-6 gap-1 sm:py-2">
            <SelectValue placeholder={t("products.filters.brand")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem disabled value={"null"}>
              {t("products.filters.brand")}
            </SelectItem>
            {(getBrands.isSuccess ? getBrands.data.data : []).map((brand) => (
              <SelectItem value={brand.name}>{brand.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Infinite Scroll - Products Grid */}
      {isLoading ? (
        <div className="h-[350px] sm:h-[500px] text-center flex items-center justify-center">
          <PulseLoader color="#d9d9d9" />
        </div>
      ) : noProducts ? (
        <div className="h-[350px] sm:h-[500px] text-muted-foreground flex justify-center items-center text-center">
          <p>
            {productQuery
              ? t.rich("common.no-products-for-query", { query: productQuery })
              : t("common.no-products-atm")}
          </p>
        </div>
      ) : (
        <InfiniteScroll
          dataLength={allProducts.length}
          next={fetchNextPage}
          hasMore={!!hasNextPage}
          loader={
            <div className="flex justify-center py-4">
              <PulseLoader color="#d9d9d9" />
            </div>
          }
          endMessage={
            <p className="text-center text-muted-foreground font-normal py-6">
              <b>{t("common.end-of-results")}</b>
            </p>
          }
        >
          <div className="max-w-7xl mx-auto grid justify-items-center grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-4 px-2 md:px-6 mb-12">
            {allProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                cardType="default"
              />
            ))}
          </div>
        </InfiniteScroll>
      )}
    </main>
  );
}

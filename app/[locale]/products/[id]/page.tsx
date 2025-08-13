import Header from "@/components/pages/product/header";
import RelatedProducts from "@/components/pages/product/related-products";
import { use } from "react";

export default function ProductPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(props.params);
  return (
    <>
      <Header productId={id} />
      <RelatedProducts />
    </>
  );
}

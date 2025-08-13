"use client";

import { useEffect, use } from "react";
import { useTranslations } from "next-intl";
import { useUpdateProduct } from "@/lib/mutations";
import {
  Form,
  FormControl,
  FormLabel,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useGetProduct } from "@/lib/queries";
import { PulseLoader } from "react-spinners";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface IProps {
  params: Promise<{
    id: string;
  }>;
}

export default function NewPublicationPage(props: IProps) {
  const t = useTranslations();
  const { id } = use(props.params);
  if (!id) {
    return (
      <div className="container max-w-4xl mx-auto pb-8">
        <h1 className="text-center sm:text-left text-2xl font-bold mb-8">
          {t("common.update-product")}
        </h1>

        <p>{t("common.provide-a-product-id-to-update")}</p>
      </div>
    );
  }
  const {
    data: product,
    isLoading: productLoading,
    isError: productError,
  } = useGetProduct(id);
  const update = useUpdateProduct();

  const productFormSchema = z.object({
    title: z.string({ message: t("products.form.title-required") }),
    description: z
      .string({ message: t("products.form.description-required") })
      .optional(),
  });

  type ProductFormSchema = z.infer<typeof productFormSchema>;

  const productForm = useForm<ProductFormSchema>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  function onSubmit(values: any) {
    // @ts-ignore
    values.id = id;
    update.mutate(values);
  }

  useEffect(() => {
    if (product?.data) {
      productForm.setValue("title", product.data.title);
      productForm.setValue("description", product.data.description || "");
    }
  }, [product]);

  if (productLoading) {
    return (
      <div className="py-10 flex justify-center">
        <PulseLoader color="#d9d9d9" />
      </div>
    );
  }
  if (productError) {
    return (
      <div className="py-10 flex justify-center">
        <p>{t("common.error")}</p>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto pb-8">
      <h1 className="text-center sm:text-left text-2xl font-bold mb-8">
        {t("common.update-product")}
      </h1>

      <Form {...productForm}>
        <form
          className="grid gap-6"
          onSubmit={productForm.handleSubmit(onSubmit)}
        >
          {/* Title */}
          <div className="px-3 py-2 rounded-xl border border-[#bfbfbf] shadow-shadow-1">
            <FormField
              control={productForm.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-neutral-500">
                    {t("common.title")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder={t("products.form.title")}
                      className="focus:outline-none focus-visible:ring-0 border-0 rounded-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Description */}
          <div className="col-span-full px-3 py-2 rounded-xl border border-[#bfbfbf] shadow-shadow-1">
            <FormField
              control={productForm.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-neutral-500 capitalize">
                    {t("common.description")}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder={t("products.form.description-placeholder")}
                      className="focus:outline-none focus-visible:ring-0 border-0 rounded-none text-black"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Action Buttons */}
          <div className="col-span-full flex flex-col items-center sm:flex-row sm:justify-end gap-4">
            <Button
              className="w-[200px] lg:w-[250px] py-4 text-lg font-bold h-auto px-8 text-[#F1F1F1]  bg-[#009045] hover:bg-[#009045]/90 rounded-full"
              type="submit"
            >
              {t("common.update")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

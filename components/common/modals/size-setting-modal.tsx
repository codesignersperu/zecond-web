"use client";

import type React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormLabel,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { ASSETS } from "@/lib/constants";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface SizeSettingModalProps {
  isOpen: boolean;
  onClose: () => void;
  formControl: any;
  onSubmit: (measurements: {
    size: string;
    height: string;
    chest: string;
    waist: string;
    hip: string;
  }) => void;
}

export default function SizeSettingModal({
  isOpen,
  onClose,
  formControl,
  onSubmit,
}: SizeSettingModalProps) {
  const t = useTranslations();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[350px] rounded-2xl sm:max-w-md p-0">
        {/* Close Button */}
        <DialogClose className="absolute w-7 h-7 sm:w-10 sm:h-10 right-2 top-2 rounded-full bg-black flex justify-center items-center opacity-100 transition-opacity hover:opacity-70 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <Image
            src={ASSETS["cross-white.svg"] || "/placeholder.svg"}
            alt="Close Modal"
            width={14}
            height={14}
            className="w-[10px] h-[10px] sm:w-[10px] sm:h-[10px]"
          />
          <span className="sr-only">Close</span>
        </DialogClose>

        <div className="p-6">
          <DialogTitle asChild>
            <h2 className="text-2xl font-bold text-center mb-8">
              {t("sizes.specifySize")}
            </h2>
          </DialogTitle>
          <form className="space-y-6">
            {/* Size Selector */}
            <div className="space-y-2">
              <FormField
                control={formControl}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-gray-600 capitalize">
                      {t("product.info.size")}
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Select
                          onValueChange={(v) =>
                            v && field.onChange({ target: { value: v } })
                          }
                          disabled={field.disabled}
                          name={field.name}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t("products.form.select-a-size")}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="XS">XS</SelectItem>
                            <SelectItem value="S">S</SelectItem>
                            <SelectItem value="M">M</SelectItem>
                            <SelectItem value="L">L</SelectItem>
                            <SelectItem value="XL">XL</SelectItem>
                            <SelectItem value="XXL">XXL</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Exact Measurements Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                {t("products.form.enter-exact-measurements")}
              </h3>

              <div className="space-y-4">
                <div>
                  <FormField
                    control={formControl}
                    name="productHeight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-gray-600 capitalize">
                          {t("products.form.height")} (CM)
                        </FormLabel>
                        <FormControl>
                          <Input {...field} className="mt-1" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <FormField
                    control={formControl}
                    name="chestMeasurement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-gray-600 capitalize">
                          {t("products.form.chest")} (CM)
                        </FormLabel>
                        <FormControl>
                          <Input {...field} className="mt-1" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <FormField
                    control={formControl}
                    name="waistMeasurement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-gray-600 capitalize">
                          {t("products.form.waist")} (CM)
                        </FormLabel>
                        <FormControl>
                          <Input {...field} className="mt-1" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <FormField
                    control={formControl}
                    name="hipsMeasurement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-gray-600 capitalize">
                          {t("products.form.hips")} (CM)
                        </FormLabel>
                        <FormControl>
                          <Input {...field} className="mt-1" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="button"
              onClick={onClose}
              className="w-full bg-black hover:bg-black/90 text-white rounded-full"
            >
              {t("common.save")}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

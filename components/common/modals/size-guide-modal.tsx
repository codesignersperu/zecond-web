"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ASSETS } from "@/lib/constants";
import { Modal, useModalStore } from "@/lib/stores";
import { imageUrl } from "@/lib/utils";

const sizeData = [
  { label: "S", eu: "46", waist: "76", hip: "104" },
  { label: "M", eu: "48", waist: "80", hip: "108" },
  { label: "L", eu: "50", waist: "85", hip: "113" },
  { label: "XL", eu: "52", waist: "90", hip: "118" },
];

export default function SizeGuideModal() {
  const t = useTranslations();
  const {
    currentOpenedModal,
    closeModal,
    sizeGuideModalData: data,
  } = useModalStore();
  return (
    <Dialog
      open={currentOpenedModal === Modal.SizeGuide}
      onOpenChange={closeModal}
    >
      <DialogContent className="max-w-[340px] rounded-2xl sm:max-w-[425px] md:max-w-[620px] pt-16 gap-y-0">
        {/* Close button */}
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

        {/* Model Details */}
        <div className="flex sm:items-center space-x-4 mb-10 border rounded-md p-3">
          <Image
            src={imageUrl(data?.seller.avatarUrl) || "/placeholder.svg"}
            alt="Model"
            width={60}
            height={60}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-top object-cover"
          />
          <div>
            <p className="text-sm sm:text-base font-semibold">
              Modelo lleva: {data?.size} | Ajuste: Fiel a la talla
            </p>
            <p className="text-xs sm:text-sm text-gray-500">
              Altura: {data?.productHeight ? `${data?.productHeight} cm` : "-"}{" "}
              Pecho:{" "}
              {data?.chestMeasurement ? `${data?.chestMeasurement} cm` : "-"}{" "}
              Cintura:{" "}
              {data?.waistMeasurement ? `${data?.waistMeasurement} cm` : "-"}{" "}
              Cadera:{" "}
              {data?.hipsMeasurement ? `${data?.hipsMeasurement} cm` : "-"}{" "}
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center mb-1">
          <h2 className="text-lg leading-none font-semibold">
            Detalles del producto
          </h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-sm text-right leading-none flex items-center gap-1 text-stone-400">
                  Cómo medir el producto
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 0 1-.988-1.129c1.454-1.272 3.776-1.272 5.23 0 1.513 1.324 1.513 3.518 0 4.842a3.75 3.75 0 0 1-.837.552c-.676.328-1.028.774-1.028 1.152v.75a.75.75 0 0 1-1.5 0v-.75c0-1.279 1.06-2.107 1.875-2.502.182-.088.351-.199.503-.331.83-.727.83-1.857 0-2.584ZM12 18a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>
                  Defina métricas clave en función de los objetivos de su
                  producto y luego recopile datos sobre esas métricas utilizando
                  varios métodos, como cifras de ventas, comentarios de
                  clientes, estadísticas de uso y análisis de mercado.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <Table className="min-w-max border border-b-0 border-stone-300 border-separate border-spacing-0 rounded">
          <TableHeader>
            <TableRow className="bg-stone-100">
              <TableHead className="font-semibold text-black border-r border-b border-stone-200">
                Tamaño de la etiqueta
              </TableHead>
              <TableHead className="font-semibold text-black border-r border-b border-stone-200">
                EU
              </TableHead>
              <TableHead className="font-semibold text-black border-r border-b border-stone-200">
                Medida de la cintura
              </TableHead>
              <TableHead className="font-semibold text-black border-b border-stone-200">
                Medida de la cadera
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sizeData.map((size) => (
              <TableRow key={size.label} className="font-semibold text-center">
                <TableCell className="border-r bg-stone-100 border-b border-stone-200">
                  {size.label}
                </TableCell>
                <TableCell className="border-r border-b border-stone-200">
                  {size.eu}
                </TableCell>
                <TableCell className="border-r border-b border-stone-200">
                  {size.waist}
                </TableCell>
                <TableCell className="border-b border-stone-200">
                  {size.hip}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}

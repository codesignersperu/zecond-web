import { ASSETS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function Checkbox1(props: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  key?: string;
}) {
  return (
    <div
      className="relative select-none block w-6 h-6 sm:w-8 sm:h-8 border-2 border-[#D0D0D0] rounded-full cursor-pointer"
      onClick={() => props.onChange(!props.checked)}
    >
      <Image
        src={ASSETS["check.svg"] || "/placeholder.svg"}
        alt="Selected"
        width={40}
        height={40}
        className={cn(
          "absolute inset-0 select-none scale-[1.5] left-[3.5px] sm:left-[5px] -top-[1.35px]  sm:-top-[2px]",
          props.checked ? "block" : "hidden",
        )}
      />
    </div>
  );
}

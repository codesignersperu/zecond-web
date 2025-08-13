import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function SwiperNavigationButton({
  direction,
  className,
}: {
  direction: "left" | "right";
  className: string;
}) {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;

  return (
    <button
      className={cn(
        "swiper-navigation-btn absolute top-[185px] z-10 w-8 h-8 sm:w-[49px] sm:h-[49px] bg-[#E7E7E7] rounded-full flex items-center justify-center",
        direction === "left" ? "-left-4" : "-right-4",
        className,
      )}
      aria-label="Scroll right"
    >
      <Icon className="w-6 h-6 text-white" />
    </button>
  );
}

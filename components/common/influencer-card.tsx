"use client";

import Image from "next/image";
import { ASSETS } from "@/lib/constants";
import type { InfluencerCard } from "@/lib/types";
import { useModalStore, Modal } from "@/lib/stores";
import { cn, imageUrl } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface InfluencerCardProps {
  influencer: InfluencerCard;
  className?: string;
}

export default function InfluencerCard({
  influencer,
  className,
}: InfluencerCardProps) {
  const { openModal } = useModalStore();
  const router = useRouter();

  return (
    <div
      className={cn(
        "w-[100px] sm:w-[115px]  flex flex-col items-center flex-shrink-0 cursor-pointer",
        className,
      )}
      onClick={() =>
        influencer?.liveProducts
          ? openModal({
              modal: Modal.Product,
              data: {
                mode: "story",
                influencerId: influencer.id,
              },
            })
          : router.push("/featured-sellers/" + influencer.username)
      }
    >
      <div
        className={cn(
          "aspect-square rounded-full p-1",
          influencer?.liveProducts ? "bg-[#f244d5]" : "bg-neutral-300",
        )}
      >
        <div className="size-full rounded-full p-1 bg-white">
          <Image
            src={imageUrl(influencer?.avatarUrl) || ASSETS["placeholder.svg"]}
            alt={influencer?.firstName || ""}
            width={120}
            height={120}
            className="rounded-full w-full aspect-square object-cover object-top"
          />
        </div>
      </div>
      <span className="mt-3 text-[#989898] text-center capitalize line-clamp-2">
        {influencer?.firstName || ""} {influencer?.lastName[0] + "." || ""}
      </span>
    </div>
  );
}

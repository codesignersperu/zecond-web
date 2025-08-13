"use client";

import MoreProducts from "@/components/pages/influencer/more-products";
import Image from "next/image";
import { use } from "react";
import { useGetInfluencer, useGetUserFollowingIds } from "@/lib/queries";
import { PulseLoader } from "react-spinners";
import RatingStars from "@/components/common/rating-stars";
import { useTranslations } from "next-intl";
import { imageUrl, cn } from "@/lib/utils";
import { useModalStore, Modal, useGlobalStore } from "@/lib/stores";
import { useToggleFollow } from "@/lib/mutations";
import { useLoginPass } from "@/lib/hooks";

interface InfluencerPageProps {
  params: Promise<{
    username: string;
  }>;
}

export default function InfluencerPage({ params }: InfluencerPageProps) {
  const t = useTranslations();
  const { openModal } = useModalStore();
  const { user } = useGlobalStore();
  const loginPass = useLoginPass();

  const { username } = use(params);
  const {
    data: influencer,
    isLoading: influencerLoading,
    isError: isInfluencerError,
    error: influencerError,
  } = useGetInfluencer({
    mode: "username",
    username,
  });

  const { data: myFollowingIds, isLoading: idsLoading } =
    useGetUserFollowingIds();

  const toggle = useToggleFollow();

  function toggleFollow(id: number) {
    loginPass<void>(() => toggle.mutate(id));
  }

  return (
    <main>
      <div className="relative w-full bg-[#272C2D] py-16">
        <div className="container mx-auto px-4">
          {influencerLoading ? (
            <div className="h-[250px] flex justify-center items-center">
              <PulseLoader color="#d9d9d9" />
            </div>
          ) : isInfluencerError ? (
            <div className="h-[250px] grid content-center">
              <p className="text-red-500 text-center">
                {influencerError.message}
              </p>
            </div>
          ) : influencer ? (
            <div className="flex flex-col items-center">
              {/* Profile Picture */}
              <div className="mb-6">
                <div className="w-32 h-32 rounded-full overflow-hidden">
                  <Image
                    src={
                      imageUrl(influencer.data.avatarUrl) || "/placeholder.svg"
                    }
                    alt={influencer.data.firstName}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Username and Name */}
              <div className="text-center mb-4">
                <h1 className="text-4xl font-bold italic text-white mb-2">
                  {influencer.data.username}
                </h1>
                <p className="text-2xl text-white/90">
                  {influencer.data.firstName} {influencer.data.lastName}
                </p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-8">
                <RatingStars
                  noOfReviews={influencer.data.noOfReviews}
                  rating={influencer.data.rating}
                />
                <button
                  className={cn(
                    "rounded-full text-white bg-transparent px-4 py-1 text-sm disabled:opacity-80 border border-white",
                    idsLoading && "cursor-progress",
                  )}
                  disabled={idsLoading || toggle.isPending}
                  onClick={() => toggleFollow(influencer.data.id)}
                >
                  {(Array.isArray(myFollowingIds?.data)
                    ? myFollowingIds?.data
                    : []
                  ).includes(influencer.data.id)
                    ? t("common.following")
                    : t("common.follow")}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <MoreProducts userId={influencer?.data.id || 0} />
    </main>
  );
}

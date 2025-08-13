"use client";

import FollowingCard from "@/components/common/following-card";
import { useTranslations } from "next-intl";
import { useGetUserFollowing } from "@/lib/queries";

export default function FollowingPage() {
  const { data: following, isSuccess } = useGetUserFollowing();

  const t = useTranslations();

  return (
    <div>
      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-8 text-center sm:text-left">
        {t("navigation.dashboard.following")}
      </h1>

      {/* Following Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isSuccess &&
          following.data.influencers.map((user, index) => (
            <FollowingCard key={index} {...user} />
          ))}
      </div>
    </div>
  );
}

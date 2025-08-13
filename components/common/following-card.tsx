"use client";

import Image from "next/image";
import Link from "next/link";
import RatingStars from "./rating-stars";
import { imageUrl } from "@/lib/utils";

interface FollowingCardProps {
  username: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  rating: number;
  noOfReviews: number;
}

export default function FollowingCard({
  username,
  firstName,
  lastName,
  avatarUrl,
  rating,
  noOfReviews,
}: FollowingCardProps) {
  return (
    <Link
      href={`/featured-sellers/${username}`}
      className="block p-6 rounded-2xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-shadow"
    >
      <div className="flex flex-col items-center text-center">
        {/* Avatar */}
        <div className="w-[120px] h-[120px] mb-4">
          <Image
            src={imageUrl(avatarUrl) || "/placeholder.svg"}
            alt={firstName}
            width={120}
            height={120}
            className="rounded-full aspect-square object-cover object-top"
          />
        </div>

        {/* Username and Name */}
        <div className="space-y-1 mb-2">
          <h3 className="font-bold">@{username}</h3>
          <p className="text-[#898989]">
            {firstName} {lastName}
          </p>
        </div>

        {/* Rating */}
        <RatingStars rating={rating} noOfReviews={noOfReviews} />
      </div>
    </Link>
  );
}

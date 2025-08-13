"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { ASSETS } from "@/lib/constants";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useDebounceCallback } from "usehooks-ts";
import { useFindInfluencers } from "@/lib/queries";
import { imageUrl } from "@/lib/utils";
import { PulseLoader } from "react-spinners";
import { useDebouncedState } from "@/lib/hooks";

interface SearchResult {
  id: string;
  username: string;
  name: string;
  image: string;
}

const mockResults: SearchResult[] = [];

export default function InfluencersHeader() {
  const t = useTranslations();
  const [searchQuery, query, setSearchQuery] = useDebouncedState("");

  const {
    data: influencers,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useFindInfluencers(query);

  const showResults = isLoading || isSuccess || isError;

  return (
    <div className="w-full bg-[#272c2d] py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-8 italic">
          INFLUENCERS
        </h1>
        <div className="max-w-md mx-auto relative">
          <input
            type="text"
            placeholder={t("influencers.search-profiles")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border border-white/30 rounded-full py-3 px-6 text-white placeholder:text-white/70 focus:outline-none focus:border-white"
          />
          <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-white/70 w-5 h-5" />

          {/* Search Results Dropdown */}
          {showResults && (
            <div className="absolute w-full mt-2 bg-white rounded-lg shadow-lg overflow-hidden z-50 max-h-[300px] overflow-y-auto">
              {isLoading ? (
                <div className="flex h-[65px] justify-center items-center">
                  <PulseLoader size={10} color="#d9d9d9" />
                </div>
              ) : isError ? (
                <div className="flex h-[100px] px-6 py-2 justify-center items-center text-red-500 text-center">
                  {error.message}
                </div>
              ) : !influencers?.data.length ? (
                <div className="flex h-[100px] justify-center items-center text-blue-500">
                  {t("common.no-results-found")}
                </div>
              ) : (
                isSuccess &&
                influencers?.data.map((result) => (
                  <div
                    key={result.username}
                    className="relative flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                  >
                    <Link
                      href={`/featured-sellers/${result.username}`}
                      className="absolute inset-0"
                    ></Link>
                    <img
                      src={imageUrl(result.avatarUrl) || "/placeholder.svg"}
                      alt={result.username}
                      className="size-16 rounded-full object-cover object-top"
                    />
                    <div className="ml-3">
                      <div className="font-medium text-gray-900">
                        @{result.username}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {result.firstName} {result.lastName}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { auctionsSocket } from "@/lib/apis";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import {
  AuctionWinnerWsResponse,
  BidsWsResponse,
  ProductsResponse,
} from "../types";
import toast from "react-hot-toast";
import { Modal, useModalStore, useGlobalStore } from "../stores";

export function useBidSocket({
  product,
}: {
  product: ProductsResponse | undefined;
}) {
  const t = useTranslations();
  const { openModal } = useModalStore();
  const [totalBids, setTotalBids] = useState(0);
  const [highestBid, setHighestBid] = useState(0);
  const [price, setPrice] = useState("0");

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setPrice(value);
    }
  };

  // Auctions Sockets
  function onNewBidNotification(bid: BidsWsResponse) {
    setTotalBids((prev) => prev + 1);
    setHighestBid(bid.amount);
    setPrice((bid.amount + 1).toFixed(2));
    if (bid.bidderId !== useGlobalStore.getState().user?.id) {
      toast(
        `${t.rich("auctions.someone-bid", { name: bid.bidderName, amount: bid.amount.toFixed(2) })}`,
      );
    }
  }

  function onAuctionWonNotification(data: AuctionWinnerWsResponse) {
    if (data.bidderId === useGlobalStore.getState().user?.id)
      openModal({ modal: Modal.AuctionWon, data });
  }

  useEffect(() => {
    // setting input price
    if (product) {
      if (product.totalBids) {
        setTotalBids(product.totalBids);
        setHighestBid(product.bids[0].amount);
        setPrice((product.bids[0].amount + 1).toFixed(2));
      } else {
        setPrice(product.price.toFixed(2));
      }
    }

    if (product && product.isAuction && !auctionsSocket.connected) {
      auctionsSocket.connect();
    }

    if (!auctionsSocket.hasListeners("newBid")) {
      auctionsSocket.on("newBid", onNewBidNotification);
    }
    if (!auctionsSocket.hasListeners("auctionWinner")) {
      auctionsSocket.on("auctionWinner", onAuctionWonNotification);
    }

    return () => {
      auctionsSocket.disconnect();
    };
  }, [product]);

  useEffect(() => {
    if (product) auctionsSocket.emit("joinAuction", { productId: product.id });
  }, [auctionsSocket.connected]);

  return {
    totalBids,
    highestBid,
    price,
    handlePriceChange,
  };
}

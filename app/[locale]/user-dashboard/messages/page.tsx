"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { cn } from "@/lib/utils";
import { ArrowLeft, ChevronLeft } from "lucide-react";

interface Message {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  notifications: number;
  content?: string;
  orderId?: string;
}

const mockMessages: Message[] = [
  {
    id: "1",
    title: "ZECOND",
    subtitle: "Closet Sale",
    date: "02 Febrero",
    notifications: 1,
    content: "¡Felicitaciones! Tienes una venta. Porfavor envia el pedido",
    orderId: "000027",
  },
  {
    id: "2",
    title: "ZECOND",
    subtitle: "Closet Sale",
    date: "02 Febrero",
    notifications: 1,
  },
  {
    id: "3",
    title: "ZECOND",
    subtitle: "Closet Sale",
    date: "02 Febrero",
    notifications: 1,
  },
  {
    id: "4",
    title: "ZECOND",
    subtitle: "Closet Sale",
    date: "02 Febrero",
    notifications: 1,
  },
];

export default function MessagesPage() {
  const t = useTranslations();
  const [selectedMessage, setSelectedMessage] = useState<Message>(
    mockMessages[0],
  );

  const isSingleTab = useMediaQuery("(max-width: 1024px)");
  const [selectedTab, setSelectedTab] = useState<"messages" | "message">(
    "messages",
  );

  function openMessage(message: Message) {
    setSelectedMessage(message);
    setSelectedTab("message");
  }

  return (
    <div className="">
      <h1
        className="text-center sm:text-left text-2xl font-bold mb-8"
        onClick={() => setSelectedTab("messages")}
      >
        {t("navigation.dashboard.messages")}
      </h1>
      <div className="flex-1 flex gap-6 h-full">
        {/* Message List */}

        <div
          className={cn(
            "space-y-4 flex-1 max-w-[400px]",
            isSingleTab && selectedTab === "message" ? "hidden" : "",
          )}
        >
          {mockMessages.map((message) => (
            <button
              key={message.id}
              onClick={() => openMessage(message)}
              className="w-full p-4 flex items-center gap-4 border border-[#D7D7D7] rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow relative"
            >
              <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white text-xl font-bold">
                T
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-bold">{message.title}</h3>
                <p className="text-[#898989]">{message.subtitle}</p>
              </div>
              <div className="flex flex-col justify-center items-end">
                <p className="text-sm text-[#898989] mb-2">{message.date}</p>
                <span className="bg-[#ff5858] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {message.notifications}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Message Content */}
        <div
          className={cn(
            "flex-1 bg-white border border-[#D7D7D7] shadow-md rounded-xl flex flex-col h-full",
            isSingleTab && selectedTab === "messages" ? "hidden" : "",
          )}
        >
          <div className="flex items-center gap-2 sm:gap-4 p-6 flex-shrink-0">
            <div
              className={cn(
                "cursor-pointer",
                isSingleTab && selectedTab === "messages" ? "hidden" : "",
              )}
              onClick={() => setSelectedTab("messages")}
            >
              <ChevronLeft className="text-3xl stroke-[3px] text-neutral-400" />
            </div>
            <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white text-xl font-bold">
              T
            </div>
            <div>
              <h2 className="font-bold">ZECOND CLOSET SALE</h2>
              <p className="text-[#898989]">Notificaciones</p>
            </div>
          </div>

          <hr className="w-full h-[1px] bg-[#D7D7D7]" />

          <div className="flex-1 p-6 overflow-y-auto">
            {selectedMessage && (
              <div className="space-y-4">
                <p className="text-sm mb-1">{selectedMessage.date}</p>
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white text-sm font-bold shrink-0">
                    T
                  </div>
                  <div className="bg-[#f2f2f2] rounded-2xl rounded-tl-none p-4 max-w-[80%]">
                    <p>
                      {selectedMessage.content}{" "}
                      {selectedMessage.orderId && (
                        <a href="#" className="text-[#1374AA]">
                          #{selectedMessage.orderId}
                        </a>
                      )}{" "}
                      lo mas pronto posible.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2Icon, SendHorizonal } from "lucide-react";
import { sendChat } from "@/lib/utils";
import { toast } from "sonner";
import { io, Socket } from "socket.io-client";

let socket: Socket;
interface ApiMessage {
  id: string;
  chatId: string;
  senderId: string | null;
  content: string | null;
  attachment: string | null;
  type: "SYSTEM" | "USER";
  createdAt: string;
  updatedAt: string;
}

interface ChatMessage {
  id: string;
  sender: "buyer" | "seller" | "admin";
  content?: string;
  imageUrl?: string;
  timestamp: string;
}

export default function ChatDialog({
  open,
  onOpenChange,
  chat,
  buyerId,
  sellerId,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  chat: any;
  sellerId: string;
  buyerId: string;
}) {
  // ✅ Transform backend API messages → UI messages
  const [messages, setMessages] = useState<ChatMessage[]>(
    chat?.messages?.map((msg: any) => ({
      id: msg.id,
      sender:
        msg.type === "SYSTEM"
          ? "admin" // 🔥 System messages show as Admin
          : msg.senderId === buyerId
          ? "buyer"
          : msg.senderId === sellerId
          ? "seller"
          : "admin",
      content: msg.content ?? undefined,
      imageUrl: msg.attachment ?? undefined,
      timestamp: new Date(msg.createdAt).toLocaleTimeString(),
    }))
  );

  const [newMessage, setNewMessage] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket = io("https://evolve2p-backend.onrender.com", {
      transports: ["websocket"], // ensure websocket transport
    });

    socket.on("connect", () => {
      console.log("🔌 Connected:", socket.id);
      socket.emit("join_chat", chat?.id);
    });

    socket.on("new_message", (msg) => {
      const formattedMsg: ChatMessage = {
        id: msg?.id,
        sender: "admin",
        content: msg?.content ?? undefined,
        imageUrl: msg?.attachment ?? undefined,
        timestamp: new Date(msg?.createdAt).toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, formattedMsg]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSend = async () => {
    setSending(true);
    const res = await sendChat(chat?.id, newMessage);
    if (res?.error) {
      setSending(false);
      toast.error(res?.message || "Failed to send message");
      return;
    }

    if (res?.success) {
      setSending(false);
      toast.success("Message sent");
      setNewMessage("");
    }
  };

  // ✅ Always scroll to bottom
  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
    const timeout = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeout);
  }, [messages, open]);

  // --- Styling helpers ---
  const getBubbleStyle = (sender: ChatMessage["sender"]) => {
    switch (sender) {
      case "buyer":
        return "bg-green-600 text-white rounded-bl-none";
      case "seller":
        return "bg-purple-600 text-white rounded-bl-none";
      case "admin":
        return "bg-blue-600 text-white rounded-br-none";
    }
  };

  const getAlignment = (sender: ChatMessage["sender"]) =>
    sender === "admin" ? "justify-end" : "justify-start";

  const getAvatarFallback = (sender: ChatMessage["sender"]) => {
    switch (sender) {
      case "buyer":
        return "B";
      case "seller":
        return "S";
      case "admin":
        return "A";
    }
  };

  const getRoleLabel = (sender: ChatMessage["sender"]) => {
    switch (sender) {
      case "buyer":
        return "Buyer";
      case "seller":
        return "Seller";
      case "admin":
        return "Admin";
    }
  };

  return (
    <>
      {/* Chat Dialog */}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl w-full h-[90vh] flex flex-col p-0 overflow-hidden dark:bg-neutral-900">
          {/* Header */}
          <DialogHeader className="flex flex-row items-center justify-between px-6 py-4 border-b dark:border-neutral-800">
            <DialogTitle className="text-lg font-semibold">
              Dispute Chat
            </DialogTitle>
          </DialogHeader>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-6 py-4 bg-neutral-950"
          >
            <div className="space-y-6">
              {messages?.map((msg, i) => {
                const prevSender = messages[i - 1]?.sender;
                const showRole = prevSender !== msg.sender;

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${getAlignment(msg.sender)}`}
                  >
                    {showRole && (
                      <span className="text-xs mb-1 text-neutral-400">
                        {getRoleLabel(msg.sender)}
                      </span>
                    )}

                    <div className="flex items-start gap-3">
                      {msg.sender !== "admin" && (
                        <Avatar className="h-8 w-8">
                          {/* <AvatarImage src={`/${msg.sender}-avatar.png`} /> */}
                          <AvatarFallback>
                            {getAvatarFallback(msg.sender)}
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <div
                        className={`max-w-xs rounded-2xl px-4 py-2 text-sm shadow-md space-y-2 ${getBubbleStyle(
                          msg.sender
                        )}`}
                      >
                        {msg.content && <p>{msg.content}</p>}

                        {msg.imageUrl && (
                          <div>
                            <img
                              src={msg.imageUrl}
                              alt="Proof"
                              width={200}
                              height={150}
                              className="rounded-lg cursor-pointer hover:opacity-90"
                              onClick={() => setPreviewImage(msg.imageUrl!)}
                            />
                          </div>
                        )}

                        <span className="text-xs opacity-70 block">
                          {msg.timestamp}
                        </span>
                      </div>

                      {msg.sender === "admin" && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/admin-avatar.png" />
                          <AvatarFallback>A</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 p-4 border-t dark:border-neutral-800 bg-neutral-950">
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 bg-neutral-800 border-none focus-visible:ring-1 focus-visible:ring-blue-500"
            />
            <Button
              disabled={sending || newMessage.trim() === ""}
              onClick={handleSend}
              className="bg-blue-600 hover:bg-blue-700 text-white disabled:cursor-not-allowed"
            >
              {sending ? (
                <Loader2Icon className="w-5 h-5 animate-spin" />
              ) : (
                <SendHorizonal className="h-5 w-5" />
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Preview Dialog */}
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogTitle></DialogTitle>
        <DialogContent className="max-w-4xl w-full p-0 overflow-hidden dark:bg-neutral-950">
          {previewImage && (
            <img
              src={previewImage}
              alt="Full Proof"
              width={1200}
              height={800}
              className="w-full h-auto object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

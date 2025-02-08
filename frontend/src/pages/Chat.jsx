import React, { useEffect, useRef, useState } from "react";
import MessageComponent from "@/components/chat/MessageComponent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { File, Send } from "lucide-react";
import userAvatar from "../assets/avatar.png"; // User's avatar
import botAvatar from "../assets/avatar.png"; // Bot's avatar

function Chat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi, I am AssistantX! How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: inputMessage,
        sender: "user",
        timestamp: new Date(),
      },
    ]);
    setInputMessage("");
  };

  const mockUser = {
    id: "1",
    name: "John Doe",
    avatar: userAvatar,
  };

  const mockBot = {
    id: "bot",
    name: "AssistantX",
    avatar: botAvatar,
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-6 py-4">
          {messages.map((message) => (
            <MessageComponent
              key={message.id}
              message={message}
              user={message.sender === "bot" ? mockBot : mockUser}
            />
          ))}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      <div className="border-t bg-background p-4">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-10 w-10 rotate-45"
          >
            <File className="h-5 w-5" />
          </Button>
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1 rounded-full"
          />
          <Button
            type="submit"
            size="icon"
            className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90"
          >
            <Send className="h-5 w-5 rotate-45" />
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Chat;

// import React, { useEffect, useRef, useState } from "react";
// import MessageComponent from "@/components/chat/MessageComponent";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { File, Send } from "lucide-react";
// import userAvatar from "../assets/avatar.png"; // User's avatar
// import botAvatar from "../assets/avatar.png"; // Bot's avatar
// import { useQuery } from "@tanstack/react-query";

// function Chat() {
//   const { data: authUser } = useQuery({ queryKey: ["authUser"] });
//   console.log(authUser);
//   console.log();
//   const [messages, setMessages] = useState([
//     {
//       id: 1,
//       text: "Hi, I am AssistantX! How can I help you today?",
//       sender: "bot",
//       timestamp: new Date(),
//     },
//   ]);

//   const [inputMessage, setInputMessage] = useState("");
//   const bottomRef = useRef(null);

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (!inputMessage.trim()) return;

//     fetch(
//       "https://southern-filme-attempts-peak.trycloudflare.com/route_request",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           question: inputMessage,
//         }),
//       }
//     )
//       .then((response) => response.json())
//       .then((data) => console.log("Success:", data))
//       .catch((error) => console.error("Error:", error));

//     setMessages((prev) => [
//       ...prev,
//       {
//         id: Date.now(),
//         text: inputMessage,
//         sender: "user",
//         timestamp: new Date(),
//       },
//     ]);
//     setInputMessage("");
//   };

//   const mockUser = {
//     id: "1",
//     name: "John Doe",
//     avatar: userAvatar,
//   };

//   const mockBot = {
//     id: "bot",
//     name: "AssistantX",
//     avatar: botAvatar,
//   };

//   return (
//     <div className="flex flex-col h-full bg-background">
//       <ScrollArea className="flex-1 px-4">
//         <div className="space-y-6 py-4">
//           {messages.map((message) => (
//             <MessageComponent
//               key={message.id}
//               message={message}
//               user={message.sender === "bot" ? mockBot : mockUser}
//             />
//           ))}
//           <div ref={bottomRef} />
//         </div>
//       </ScrollArea>

//       <div className="border-t bg-background p-4">
//         <form onSubmit={handleSendMessage} className="flex items-center gap-2">
//           <Button
//             type="button"
//             variant="ghost"
//             size="icon"
//             className="h-10 w-10 rotate-45"
//           >
//             <File className="h-5 w-5" />
//           </Button>
//           <Input
//             value={inputMessage}
//             onChange={(e) => setInputMessage(e.target.value)}
//             placeholder="Type your message here..."
//             className="flex-1 rounded-full"
//           />
//           <Button
//             type="submit"
//             size="icon"
//             className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90"
//           >
//             <Send className="h-5 w-5 rotate-45" />
//           </Button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Chat;

import React, { useEffect, useRef, useState } from "react";
import MessageComponent from "@/components/chat/MessageComponent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { File, Send, Loader2 } from "lucide-react";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import userAvatar from "../assets/avatar.png";
import botAvatar from "../assets/avatar.png";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { api } from "@/App";

function Chat() {
  // States
  const queryClient = new QueryClient();
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi, I am AssistantX! How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Refs
  const bottomRef = useRef(null);

  // Queries
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  // Default user data
  const defaultUser = {
    id: "1",
    name: "User",
    avatar: userAvatar,
  };

  const botUser = {
    id: "bot",
    name: "AssistantX",
    avatar: botAvatar,
  };

  // Get current user data
  const currentUser = authUser
    ? {
        id: authUser.id || defaultUser.id,
        name: authUser.name || defaultUser.name,
        avatar: authUser.avatar || defaultUser.avatar,
      }
    : defaultUser;

  // Auto-scroll effect
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle message submission
  const handleSendMessage = async (e) => {
    e.preventDefault();
    const trimmedMessage = inputMessage.trim();
    if (!trimmedMessage) return;

    // Clear any previous errors
    setError(null);

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: trimmedMessage,
      sender: "user",
      timestamp: new Date(),
      userName: currentUser.name,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://southern-filme-attempts-peak.trycloudflare.com/route_request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: trimmedMessage,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get response from the bot");
      }

      const data = await response.json();

      // Add bot message
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: data.response,
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Render message content based on sender and loading state
  const renderMessageContent = (message) => {
    if (message.sender === "bot") {
      return (
        <TextGenerateEffect
          words={message.text}
          duration={1}
          className="text-base font-normal"
        />
      );
    }
    return message.text;
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-6 py-4">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Messages */}
          {messages.map((message) => (
            <MessageComponent
              key={message.id}
              message={{
                ...message,
                text: renderMessageContent(message),
              }}
              user={message.sender === "bot" ? botUser : currentUser}
            />
          ))}

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>AssistantX is typing...</span>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* Message Input Form */}
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
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
          />
          <Button
            type="submit"
            size="icon"
            className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5 rotate-45" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Chat;

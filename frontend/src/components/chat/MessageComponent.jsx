import React, { memo } from "react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const MessageComponent = ({ message, user }) => {
  const isUser = message.sender === "user";

  return (
    <div
      className={cn(
        "flex items-start gap-2 group animate-in fade-in-0 slide-in-from-bottom-4 w-full",
        isUser && "flex-row-reverse"
      )}
    >
      <Avatar className="w-8 h-8 mt-0.5 flex-shrink-0">
        <AvatarImage src={isUser ? user?.avatar : "/bot-avatar.png"} />
        <AvatarFallback>{isUser ? user?.name?.[0] : "AI"}</AvatarFallback>
      </Avatar>

      <div className={cn("flex flex-col max-w-[75%]", isUser && "items-end")}>
        <div
          className={cn(
            "relative flex flex-col gap-1 w-full",
            isUser && "items-end"
          )}
        >
          {!isUser && (
            <span className="text-sm font-medium text-muted-foreground">
             AI name
            </span>
          )}
          <div
            className={cn(
              "px-4 py-2.5 rounded-2xl text-sm break-words whitespace-pre-wrap",
              isUser
                ? "bg-primary text-primary-foreground rounded-br-none"
                : "bg-muted rounded-bl-none"
            )}
          >
            {message.text}
          </div>
          <span className="text-[11px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
            {formatDistanceToNow(message.timestamp, { addSuffix: true })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default memo(MessageComponent);

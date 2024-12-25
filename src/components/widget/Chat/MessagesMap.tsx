import { FileMessageCard } from "@/components/widget/Chat/FileMessageCard";
import { MessageCard } from "@/components/widget/Chat/MessageCard";
import { Message } from "@/hooks/use-message";
import { strDateToEpoch } from "@/lib/utils";
import { Session } from "next-auth";
import React from "react";
import { DateSeparator } from "./DateSpearator";
import { ChatUser } from "@/types/entityRelations";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const MessagesMap = ({
  messages,
  session,
  participants,
}: {
  messages: Message[];
  session: Session;
  participants?: ChatUser[];
}) => {
  const renderMessage = (message: Message, isUser: boolean) => {
    const baseClasses = "flex w-full gap-2 px-2 py-1";
    const messageWrapperClasses = cn(
      baseClasses,
      isUser ? "flex-row-reverse" : "flex-row",
    );

    return (
      <div className={messageWrapperClasses}>
        {/* Avatar */}
        <Avatar className="h-8 w-8">
          {isUser ? (
            <AvatarFallback className="bg-primary-100 text-primary-600">
              {session.user?.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          ) : (
            <AvatarFallback className="bg-secondary-100 text-secondary-600">
              A
            </AvatarFallback>
          )}
        </Avatar>

        {/* Message Content */}
        <div
          className={cn("max-w-[80%]", isUser ? "items-end" : "items-start")}
        >
          {message.file_url ? (
            <FileMessageCard
              message={message}
              participants={participants}
              isUser={isUser}
              className={cn(
                "rounded-xl p-3",
                isUser
                  ? "bg-primary-600 text-white"
                  : "bg-secondary-100 text-gray-900",
              )}
            />
          ) : (
            <MessageCard
              message={message}
              participants={participants}
              isUser={isUser}
            />
          )}
          <div
            className={cn(
              "mt-1 text-xs text-gray-500",
              isUser ? "text-right" : "text-left",
            )}
          >
            {new Date(message.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderDateSeparator = (date: string) => (
    <div className="relative py-4">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-200" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-white px-3 text-sm text-gray-500">
          <DateSeparator messageDate={date} />
        </span>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col-reverse gap-2">
      {messages.map((message, idx) => {
        const isUser = session?.user?.id === message.sender_id;
        const nextMessage = messages[idx + 1];
        const showDateSeparator =
          !nextMessage ||
          strDateToEpoch(nextMessage.created_at) !==
            strDateToEpoch(message.created_at);

        return (
          <React.Fragment key={message.id}>
            {renderMessage(message, isUser)}
            {showDateSeparator && renderDateSeparator(message.created_at)}
          </React.Fragment>
        );
      })}
    </div>
  );
};

"use client"

import PageTitle from "@/components/page-title"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { api } from "@/convex/_generated/api"
import { useQuery } from "convex/react"
import { TrashIcon } from "lucide-react"

import { useChat } from "./_hooks/use-chat"
import { PredefinedMessages } from "./_components/predefined-messages"
import { MessageList } from "./_components/message-list"
import { ChatInput } from "./_components/chat-input"
import { ModelSelector } from "./_components/model-selector"

export default function AIHelperPage() {
  const getStudyStats = useQuery(api.study.getFullStats)
  const listMyGroups = useQuery(api.groups.listMyGroups)
  const user = useQuery(api.users.viewer)

  const {
    messages,
    input,
    setInput,
    isLoading,
    error,
    messagesEndRef,
    selectedModel,
    resolvedModel,
    setSelectedModel,
    handleSubmit,
    append,
    stop,
    reload,
    clearChat,
    clearError,
  } = useChat({
    studyStats: getStudyStats,
    groupInfo: listMyGroups,
    userName: user?.name,
  })

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden">
      {/* Header section - responsive layout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 p-4 pb-2 sm:pb-4 shrink-0 border-b">
        <PageTitle title="MentorMind" />
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <ModelSelector
            selectedModel={selectedModel}
            resolvedModel={resolvedModel}
            onModelChange={setSelectedModel}
            disabled={isLoading}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={clearChat}
            className="gap-2 w-full sm:w-auto bg-white text-gray-700 border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-500"
          >
            <TrashIcon className="h-4 w-4" />
            <span className="sm:inline">Clear Chat</span>
          </Button>
        </div>
      </div>
      
      {/* Chat container - full height minus header */}
      <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
        <div className="flex-1 min-h-0 overflow-hidden">
          <ScrollArea className="h-full p-2 sm:p-4">
            {messages.length === 0 ? (
              <PredefinedMessages 
                onMessageSelect={(message) => append({ role: "user", content: message })}
                isLoading={isLoading}
              />
            ) : (
              <>
                <MessageList
                  messages={messages}
                  user={user}
                  error={error}
                  isLoading={isLoading}
                  onRetry={reload}
                  onClearError={clearError}
                />
                <div ref={messagesEndRef} />
              </>
            )}
          </ScrollArea>
        </div>
        <div className="shrink-0 border-t bg-background">
          <ChatInput
            input={input}
            setInput={setInput}
            onSubmit={handleSubmit}
            onStop={stop}
            onReload={reload}
            isLoading={isLoading}
            error={error}
            hasMessages={messages.length > 0}
            activeModel={resolvedModel}
          />
        </div>
      </div>
    </div>
  )
}

"use client"
/**
 * Chat input component with send/stop/reload functionality
 * Handles user input and control actions for the chat interface
 */

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RefreshCw, Send, StopCircle } from "lucide-react"
import { useCallback, useMemo } from "react"

import { AUTO_MODEL_ID, MODEL_LABELS } from "../_constants"

interface ChatInputProps {
  input: string
  setInput: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  onStop: () => void
  onReload: () => void
  isLoading: boolean
  error: string | null
  hasMessages: boolean
  activeModel: string
}

export function ChatInput({
  input,
  setInput,
  onSubmit,
  onStop,
  onReload,
  isLoading,
  error,
  hasMessages,
  activeModel,
}: ChatInputProps) {
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }, [setInput])

  const modelLabel = useMemo(() => {
    const fallback = MODEL_LABELS[AUTO_MODEL_ID]
    return MODEL_LABELS[activeModel] ?? activeModel ?? fallback
  }, [activeModel])

  return (
    <div className="">
      <div className="p-2 sm:p-4">
        <form onSubmit={onSubmit} className="flex items-center gap-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask anything about studying..."
            disabled={isLoading || error != null}
            className="flex-1 text-sm sm:text-base"
            autoFocus
          />
          <div className="flex gap-1 sm:gap-2 shrink-0">
            {isLoading ? (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={onStop}
                className="h-9 w-9 sm:h-10 sm:w-10"
              >
                <StopCircle className="h-4 w-4" />
              </Button>
            ) : (
              hasMessages && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.preventDefault()
                    onReload()
                  }}
                  className="h-9 w-9 sm:h-10 sm:w-10 bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-500"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              )
            )}
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !input.trim()}
              variant="ghost"
              className="h-9 w-9 sm:h-10 sm:w-10 bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-500"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
      
      {/* Powered by footer - responsive */}
      <div className="border-t bg-muted/30 px-2 sm:px-4 py-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              <span>AI Assistant Active</span>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 text-xs overflow-hidden">
            <span className="hidden sm:inline">Powered by</span>
            <span className="font-semibold text-primary truncate">{modelLabel}</span>
            <span className="hidden sm:inline">|</span>
            <span className="text-muted-foreground/70 hidden lg:inline">Secure & Private</span>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"
/**
 * Predefined message suggestions for users
 * Provides quick-start options for common queries
 */

import { Button } from "@/components/ui/button"
import { Bot, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

export const PREDEFINED_MESSAGES = [
  // Focus & Concentration
  "How can I improve my study focus and avoid distractions?",
  "What techniques can help me concentrate better during long study sessions?",
  "How do I deal with mental fatigue while studying?",
  
  // Study Techniques & Methods
  "What's the best study technique for me based on my study patterns?",
  "Should I use active recall or spaced repetition for better retention?",
  "How can I make my study sessions more effective and productive?",
  "What's the optimal study session length for maximum learning?",
  
  // Time Management & Planning
  "Help me create a personalized study schedule based on my habits",
  "How can I better manage my time between different subjects?",
  "What's the best way to prioritize my study topics?",
  "How do I balance study time with breaks for optimal performance?",
  
  // Performance Analysis
  "Analyze my study completion rate and suggest improvements",
  "What patterns in my study data should I be concerned about?",
  "How does my study performance compare to optimal practices?",
  "What are my biggest study challenges based on my statistics?",
  
  // Motivation & Habits
  "How can I stay motivated when my completion rate is low?",
  "What strategies help build consistent daily study habits?",
  "How do I overcome procrastination and study resistance?",
  "What rewards system would work best for my study goals?",
  
  // Health & Wellness
  "How can I prevent burnout while maintaining good study habits?",
  "What's the ideal balance between study time and rest?",
  "How does my current study schedule affect my well-being?",
  "Tips for maintaining energy levels throughout study sessions",
] as const

interface PredefinedMessagesProps {
  onMessageSelect: (message: string) => void
  isLoading: boolean
}

// Organize messages by category for better UX
const MESSAGE_CATEGORIES = [
  {
    title: "🎯 Focus & Concentration",
    messages: PREDEFINED_MESSAGES.slice(0, 3),
    color: "bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-700",
  },
  {
    title: "📚 Study Techniques",
    messages: PREDEFINED_MESSAGES.slice(3, 7),
    color: "bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-700",
  },
  {
    title: "⏰ Time Management",
    messages: PREDEFINED_MESSAGES.slice(7, 11),
    color: "bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-700",
  },
  {
    title: "📊 Performance Analysis",
    messages: PREDEFINED_MESSAGES.slice(11, 15),
    color: "bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-700",
  },
  {
    title: "💪 Motivation & Habits",
    messages: PREDEFINED_MESSAGES.slice(15, 19),
    color: "bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-700",
  },
  {
    title: "🌱 Health & Wellness",
    messages: PREDEFINED_MESSAGES.slice(19),
    color: "bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-700",
  },
] as const

export function PredefinedMessages({ onMessageSelect, isLoading }: PredefinedMessagesProps) {
  const [showMore, setShowMore] = useState(false)
  
  // Primary categories to show by default
  const primaryCategories = MESSAGE_CATEGORIES.filter(cat => 
    cat.title.includes("Study Techniques") || cat.title.includes("Time Management")
  )
  
  // Additional categories to show in "View More"
  const additionalCategories = MESSAGE_CATEGORIES.filter(cat => 
    !cat.title.includes("Study Techniques") && !cat.title.includes("Time Management")
  )

  return (
    <div className="flex h-full flex-col items-center justify-start py-4 sm:py-8 text-center px-3 sm:px-6 overflow-y-auto">
      <div className="mb-8 sm:mb-10">
        <Bot className="mx-auto mb-4 sm:mb-6 h-12 w-12 sm:h-16 sm:w-16 text-gray-600 dark:text-gray-400" />
        <h3 className="mb-4 text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
          MentorMind
        </h3>
        <p className="max-w-lg text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
          Get personalized study advice, techniques, and insights based on your learning patterns. 
          Choose a topic below or ask me anything!
        </p>
      </div>
      
      <div className="w-full max-w-5xl space-y-6 sm:space-y-8">
        {/* Primary Categories */}
        {primaryCategories.map((category) => (
          <div key={category.title} className="space-y-3 sm:space-y-4">
            <h4 className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200 text-left px-1">
              {category.title}
            </h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {category.messages.map((message) => (
                <Button
                  key={message}
                  variant="ghost"
                  className={`h-auto whitespace-normal text-left text-sm sm:text-base p-4 transition-all duration-200 hover:shadow-md ${category.color} leading-relaxed min-h-[3.5rem] font-medium text-gray-700 dark:text-gray-200`}
                  onClick={() => onMessageSelect(message)}
                  disabled={isLoading}
                >
                  {message}
                </Button>
              ))}
            </div>
          </div>
        ))}
        
        {/* View More Button */}
        <div className="flex justify-center pt-2">
          <Button
            variant="ghost"
            onClick={() => setShowMore(!showMore)}
            className="text-sm sm:text-base font-medium text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 gap-2 bg-gray-100 border border-gray-200 hover:bg-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600 px-6 py-2.5 transition-all duration-200"
            disabled={isLoading}
          >
            {showMore ? (
              <>
                <ChevronUp className="h-4 w-4" />
                View Less
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                View More Topics
              </>
            )}
          </Button>
        </div>
        
        {/* Additional Categories */}
        {showMore && (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
            {additionalCategories.map((category) => (
              <div key={category.title} className="space-y-3 sm:space-y-4">
                <h4 className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200 text-left px-1">
                  {category.title}
                </h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {category.messages.map((message) => (
                    <Button
                      key={message}
                      variant="ghost"
                      className={`h-auto whitespace-normal text-left text-sm sm:text-base p-4 transition-all duration-200 hover:shadow-md ${category.color} leading-relaxed min-h-[3.5rem] font-medium text-gray-700 dark:text-gray-200`}
                      onClick={() => onMessageSelect(message)}
                      disabled={isLoading}
                    >
                      {message}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="mt-8 sm:mt-10 space-y-4 text-center">
        <div className="text-sm text-gray-600 dark:text-gray-400 px-2 font-medium">
          💡 Pro Tip: Ask specific questions for personalized recommendations
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-xs text-gray-500 dark:text-gray-500 px-2">
          <div className="flex items-center gap-1">
            <span>Powered by</span>
            <span className="font-semibold text-gray-700 dark:text-gray-300">Heroku Inference and Agents</span>
          </div>
          <span className="hidden sm:inline">•</span>
          <span>Personalized Study Intelligence</span>
        </div>
      </div>
    </div>
  )
}
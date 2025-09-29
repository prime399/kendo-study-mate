"use client"

import ThemeToggle from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuthActions } from "@convex-dev/auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

export function UserMenu({
  name,
  avatar,
  email,
  state,
}: {
  name: string
  avatar: string
  email: string
  state: "expanded" | "collapsed"
}) {
  return (
    <div className="flex w-full items-center gap-3 text-sm font-medium">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="w-full gap-3 h-12 px-3 py-2 bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:border-gray-500"
          >
            <Avatar className="size-8 ring-2 ring-gray-200 dark:ring-gray-600">
              <AvatarImage src={avatar} />
              <AvatarFallback className="bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 text-sm font-medium">
                {name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {state === "expanded" && (
              <div className="flex-1 text-left">
                <span className="truncate block font-medium">{name}</span>
              </div>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64 p-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 shadow-lg">
          {/* User Info Section */}
          <div className="px-3 py-4 border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center gap-3 mb-2">
              <Avatar className="size-10 ring-2 ring-gray-200 dark:ring-gray-600">
                <AvatarImage src={avatar} />
                <AvatarFallback className="bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 font-medium">
                  {name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">{name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{email}</p>
              </div>
            </div>
          </div>

          {/* Theme Section */}
          <div className="px-3 py-4 border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</span>
              <ThemeToggle />
            </div>
          </div>

          {/* Logout Section */}
          <div className="px-1 py-2">
            <SignOutButton />
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

function SignOutButton() {
  const { signOut } = useAuthActions()
  return (
    <DropdownMenuItem 
      onClick={() => void signOut()}
      className="w-full px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300 cursor-pointer rounded-md transition-colors duration-200"
    >
      <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
      Sign out
    </DropdownMenuItem>
  )
}

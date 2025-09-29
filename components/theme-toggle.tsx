"use client"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { DesktopIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { useTheme } from "next-themes"

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  return (
    <ToggleGroup 
      type="single" 
      size="sm" 
      onValueChange={setTheme} 
      value={theme}
      className="bg-gray-100 dark:bg-gray-700 p-1 rounded-lg border border-gray-200 dark:border-gray-600"
    >
      <ToggleGroupItem 
        value="light" 
        aria-label="Light"
        className="h-8 w-8 p-0 text-gray-600 hover:text-gray-900 hover:bg-white dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-600 data-[state=on]:bg-white data-[state=on]:text-gray-900 data-[state=on]:shadow-sm dark:data-[state=on]:bg-gray-600 dark:data-[state=on]:text-gray-100 transition-all duration-200"
      >
        <SunIcon className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem 
        value="dark" 
        aria-label="Dark"
        className="h-8 w-8 p-0 text-gray-600 hover:text-gray-900 hover:bg-white dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-600 data-[state=on]:bg-white data-[state=on]:text-gray-900 data-[state=on]:shadow-sm dark:data-[state=on]:bg-gray-600 dark:data-[state=on]:text-gray-100 transition-all duration-200"
      >
        <MoonIcon className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem 
        value="system" 
        aria-label="System"
        className="h-8 w-8 p-0 text-gray-600 hover:text-gray-900 hover:bg-white dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-600 data-[state=on]:bg-white data-[state=on]:text-gray-900 data-[state=on]:shadow-sm dark:data-[state=on]:bg-gray-600 dark:data-[state=on]:text-gray-100 transition-all duration-200"
      >
        <DesktopIcon className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}

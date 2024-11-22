"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image";
export default function SettingsComponent() {
  const { setTheme,theme } = useTheme()

  return (
    <div className="px-4">
    <DropdownMenu >
      <DropdownMenuTrigger className="cursor-pointer" asChild>
        <Image src={"/assets/settings.svg"} alt={"settings"} width={20} height={20} />
      </DropdownMenuTrigger>
      <DropdownMenuContent  align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    </div>
  )
}

"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Command, Users, Apple } from "lucide-react"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { obterDadosNutri } from "@/app/actions/nutricionista"

let cachedUser: { 
  name: string
  email: string
  avatar: string
  isAdmin: boolean 
  isDarkTema: boolean
} | null = null

export function clearCachedUser() {
  cachedUser = null
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { setTheme } = useTheme()

  const [user, setUser] = React.useState({
    name: cachedUser?.name || "Carregando...",
    email: cachedUser?.email || "",
    avatar: cachedUser?.avatar || "",
    isAdmin: cachedUser?.isAdmin || false,
    isDarkTema: cachedUser?.isDarkTema || false,
  })

  const [loading, setLoading] = React.useState(!cachedUser)

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        if (cachedUser) {
          return
        }

        const res = await obterDadosNutri()

        if (res.success && res.data) {
          const userData = {
            name: res.data.nome,
            email: res.data.email,
            isAdmin: res.data.isAdmin,
            isDarkTema: res.data.isTemaDark,
            avatar: "",
          }

          cachedUser = userData
          setUser(userData)

          setTheme(userData.isDarkTema ? "dark" : "light")

          if (userData.isDarkTema) {
            document.documentElement.classList.add("dark")
          } else {
            document.documentElement.classList.remove("dark")
          }
        }
      } catch (err) {
        console.error("Erro ao carregar usuário/tema:", err)
      } finally { 
        setLoading(false)
      }
    }

    fetchUser()
  }, [setTheme])

  const navMain = [
    {
      title: "Paciente",
      url: "/paciente",
      icon: Users,
      isActive: true,
    },
  ]

  if (user.isAdmin) {
    navMain.push({
      title: "Nutricionista",
      url: "/nutricionista",
      icon: Apple,
      isActive: true,
    })
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/home">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Mexa-se</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}

"use client"

import * as React from "react"
import { Command, Users } from "lucide-react"
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


let cachedUser: { name: string; email: string; avatar: string } | null = null

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState<{ name: string; email: string; avatar: string }>(
    cachedUser || { name: "Carregando...", email: "", avatar: "" }
  )

  const [loading, setLoading] = React.useState(!cachedUser)

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        if (cachedUser) return

        const res = await obterDadosNutri()

        if (res.success && res.data) {
          const userData = {
            name: res.data.nome,
            email: res.data.email,
            avatar: "",
          }

          cachedUser = userData
          setUser(userData)
        } else {
          setUser({ name: "Usuário", email: "email@exemplo.com", avatar: "" })
        }
      } catch (err) {
        console.error("Erro ao carregar usuário:", err)
        setUser({ name: "Erro ao carregar", email: "", avatar: "" })
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  const data = {
  user,
  navMain: [
    {
      title: "Paciente",
      url: "/paciente",
      icon: Users,
      isActive: true,
    },
  ],
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
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}

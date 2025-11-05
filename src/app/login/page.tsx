"use client"

import { GalleryVerticalEnd } from "lucide-react"
import { LoginForm } from "@/components/login-form"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { toast, Toaster } from "sonner"

export default function LoginPage() {
  const searchParams = useSearchParams()

  if (typeof window !== "undefined") {
    const session = searchParams.get("session")
    if (session === "expired") {
      toast.error("Sessão expirada, faça o login novamente.")
    }
  }

  return (
    <>
      <Toaster position="top-center" />

      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex justify-center gap-2 md:justify-start">
            <a href="#" className="flex items-center gap-2 font-medium">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <GalleryVerticalEnd className="size-4" />
              </div>
              Mexa-se
            </a>
          </div>

          <div  className="flex flex-1 items-center justify-center">
            <div  className="w-full max-w-xs">
              <LoginForm />
            </div>
          </div>
        </div>

        <div className="relative hidden lg:block bg-muted">
          <Image
            src="/images/login-mobile.png"
            alt="placeholder"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </div>
      </div>
    </> 
  )
}

"use client"

import { useSearchParams } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { useEffect, useState } from "react"

export function LoginAlert() {
  const searchParams = useSearchParams()
  const [sessionExpired, setSessionExpired] = useState(false)

  useEffect(() => {
    const session = searchParams.get("session")
    if (session === "expired") {
      setSessionExpired(true)
      // auto-hide depois de 3s
      const timer = setTimeout(() => setSessionExpired(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [searchParams])

  if (!sessionExpired) return null

  return (
    <Alert
      variant="destructive"
      className="mb-4 w-full max-w-xs animate-in fade-in duration-300 animate-out fade-out duration-300"
    >
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Sessão expirada</AlertTitle>
      <AlertDescription>
        Sua sessão expirou. Faça login novamente.
      </AlertDescription>
    </Alert>
  )
}

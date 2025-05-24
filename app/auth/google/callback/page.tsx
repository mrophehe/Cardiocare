"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { apiService } from "@/lib/api"

export default function GoogleCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code")
      const state = searchParams.get("state")

      if (code) {
        try {
          // Call Django backend to complete OAuth
          const data = await apiService.completeGoogleFitAuth(code, state || "")

          if (data.access_token) {
            localStorage.setItem("access_token", data.access_token)
            localStorage.setItem(
              "user_data",
              JSON.stringify({
                id: data.user_id,
                email: data.email,
                name: data.name,
                provider: data.provider,
              }),
            )

            router.push("/")
          } else {
            console.error("Authentication failed:", data)
            router.push("/?error=auth_failed")
          }
        } catch (error) {
          console.error("Callback error:", error)

          // Fallback to demo mode if Django backend is not available
          const userData = {
            id: 1,
            email: "john.doe@example.com",
            name: "John Doe",
            provider: "google_fit",
          }
          const token = "demo_access_token_google_fit"

          localStorage.setItem("access_token", token)
          localStorage.setItem("user_data", JSON.stringify(userData))

          router.push("/?demo=true")
        }
      }
    }

    handleCallback()
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing authentication...</p>
        <p className="text-sm text-gray-500 mt-2">Connecting to Django backend...</p>
      </div>
    </div>
  )
}

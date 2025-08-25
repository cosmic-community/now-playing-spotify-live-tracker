'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LogoutButton() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })
      
      const data = await response.json()
      
      if (data.success) {
        router.push('/auth/login')
        router.refresh() // Refresh the page to clear any cached data
      } else {
        console.error('Logout failed:', data.error)
        // Still redirect even if logout failed
        router.push('/auth/login')
      }
    } catch (error) {
      console.error('Logout error:', error)
      // Still redirect even if logout failed
      router.push('/auth/login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="text-sm text-spotify-gray hover:text-white transition-colors duration-200 disabled:opacity-50"
    >
      {isLoading ? 'Logging out...' : 'Logout'}
    </button>
  )
}
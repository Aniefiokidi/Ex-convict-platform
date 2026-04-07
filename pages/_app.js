import '../styles/globals.css'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function App({ Component, pageProps }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    axios.get('/api/auth/me')
      .then(res => { 
        if (mounted) {
          setUser(res.data.user || null)
          setLoading(false)
        }
      })
      .catch(() => { 
        if (mounted) {
          setUser(null)
          setLoading(false)
        }
      })
    return () => { mounted = false }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading...</span>
        </div>
      </div>
    )
  }

  return <Component {...pageProps} currentUser={user} />
}

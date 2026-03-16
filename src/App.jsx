import { useState, useEffect } from 'react'
import LandingPage from './components/LandingPage'
import ThankYouPage from './components/ThankYouPage'
import { THEMES } from './themes/themes'

export default function App() {
  const [themeIndex, setThemeIndex] = useState(0)
  const [page, setPage] = useState('landing')
  const [waitlistData, setWaitlistData] = useState(null)
  const theme = THEMES[themeIndex]

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('success') === 'true') {
      setWaitlistData({
        position: params.get('position') || '42',
        email: params.get('email') || '',
        name: params.get('name') || '',
      })
      setPage('thankyou')
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [])

  const cycleTheme = () => setThemeIndex((p) => (p + 1) % THEMES.length)

  return page === 'thankyou' ? (
    <ThankYouPage
      theme={theme}
      themeIndex={themeIndex}
      cycleTheme={cycleTheme}
      data={waitlistData}
      onBack={() => setPage('landing')}
    />
  ) : (
    <LandingPage
      theme={theme}
      themeIndex={themeIndex}
      cycleTheme={cycleTheme}
      onSuccess={(data) => { setWaitlistData(data); setPage('thankyou') }}
    />
  )
}

import { useState, useEffect, useRef } from 'react'
import styles from './WaitlistPage.module.css'

const TOTAL_SPOTS = 100
const TAKEN_SPOTS = 67 // update this from your backend

const PLATFORMS = [
  'Meta Ads', 'Google Ads', 'Instagram', 'TikTok', 'Snapchat',
  'YouTube', 'Pinterest', 'LinkedIn', 'Twitter/X', 'Amazon Ads',
  'Shopify', 'Flipkart Ads',
]

const FEATURES = [
  { icon: '◈', label: 'UI-first workflow', desc: 'No prompts needed — build campaigns visually' },
  { icon: '⬡', label: '12+ platforms', desc: 'One dashboard to rule all your ad channels' },
  { icon: '◉', label: 'Live analytics', desc: 'Real-time performance across every platform' },
  { icon: '⟐', label: 'Founding member', desc: 'Priority access + locked-in early pricing' },
]

export default function WaitlistPage({ theme, themeIndex, cycleTheme, onSuccess }) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [spotsLeft, setSpotsLeft] = useState(TOTAL_SPOTS - TAKEN_SPOTS)
  const [emailFocused, setEmailFocused] = useState(false)
  const [nameFocused, setNameFocused] = useState(false)
  const [ticker, setTicker] = useState(0)
  const containerRef = useRef(null)

  // Apply theme CSS vars
  useEffect(() => {
    const root = document.documentElement
    Object.entries(theme.vars).forEach(([key, val]) => {
      root.style.setProperty(key, val)
    })
    document.body.style.background = theme.vars['--bg']
  }, [theme])

  // Animated ticker for social proof
  useEffect(() => {
    const t = setInterval(() => setTicker(p => p + 1), 3000)
    return () => clearInterval(t)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !name) { setError('Please fill in both fields'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Please enter a valid email'); return }

    setLoading(true)
    setError('')

    try {
      // Call your NestJS backend
      const res = await fetch('/api/waitlist/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Something went wrong. Please try again.')
        setLoading(false)
        return
      }

      // Redirect to Razorpay checkout
      if (data.razorpayOrderId) {
        initiateRazorpay(data)
      }
    } catch (err) {
      setError('Connection error. Please try again.')
      setLoading(false)
    }
  }

  const initiateRazorpay = (data) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: 50000, // ₹500 in paise
      currency: 'INR',
      name: 'Peculiar',
      description: 'Founding Member Access — Waitlist Spot',
      order_id: data.razorpayOrderId,
      image: '/favicon.svg',
      prefill: { name, email },
      theme: { color: theme.vars['--accent'] },
      handler: async (response) => {
        try {
          const verify = await fetch('/api/waitlist/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              email,
              name,
            }),
          })
          const result = await verify.json()
          if (result.success) {
            onSuccess({ position: result.position, email, name })
          } else {
            setError('Payment verification failed. Contact support.')
          }
        } catch {
          setError('Verification error. Please contact support@try-peculiar.com')
        }
        setLoading(false)
      },
      modal: { ondismiss: () => setLoading(false) },
    }

    if (window.Razorpay) {
      const rzp = new window.Razorpay(options)
      rzp.open()
    } else {
      // Load Razorpay script dynamically
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => {
        const rzp = new window.Razorpay(options)
        rzp.open()
      }
      document.body.appendChild(script)
    }
  }

  const isDark = themeIndex === 0 || themeIndex === 3
  const isBold = themeIndex === 1
  const isMinimal = themeIndex === 2
  const isLuxe = themeIndex === 3

  const socialProofMessages = [
    '🇮🇳 Rahul from Mumbai just joined',
    '🔥 3 spots taken in the last hour',
    '🇮🇳 Priya from Bengaluru just joined',
    '⚡ Agency founder from Delhi secured a spot',
    '🎯 D2C brand from Hyderabad just joined',
  ]

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${styles[`theme-${theme.id}`]}`}
      style={{ background: theme.gradient }}
    >
      {/* Noise texture overlay */}
      {theme.noise && <div className={styles.noise} />}

      {/* Grid lines for dark-futuristic */}
      {theme.gridLines && <div className={styles.gridLines} />}

      {/* Floating orbs / ambient glow */}
      <div className={styles.orb1} />
      <div className={styles.orb2} />
      {isBold && <div className={styles.orb3} />}

      {/* Theme switcher */}
      <button className={styles.themeSwitcher} onClick={cycleTheme} title="Change theme">
        <span className={styles.themeSwitcherIcon}>{theme.emoji}</span>
        <span className={styles.themeSwitcherLabel}>{theme.label}</span>
        <span className={styles.themeSwitcherArrow}>→</span>
      </button>

      {/* Main layout */}
      <main className={styles.main}>

        {/* ——— LEFT / TOP ——— */}
        <section className={styles.hero}>

          {/* Badge */}
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            <span>Early Access — Founding 100</span>
          </div>

          {/* Heading */}
          {isMinimal ? (
            <h1 className={styles.heading}>
              Marketing tools<br />
              <em>reimagined.</em>
            </h1>
          ) : isLuxe ? (
            <h1 className={styles.heading}>
              Where great<br />
              <em>campaigns</em><br />
              are born.
            </h1>
          ) : isBold ? (
            <h1 className={styles.heading}>
              Stop<br />
              <span className={styles.accentText}>prompting.</span><br />
              Start doing.
            </h1>
          ) : (
            <h1 className={styles.heading}>
              The future of<br />
              <span className={styles.accentText}>performance</span><br />
              marketing.
            </h1>
          )}

          {/* Sub */}
          <p className={styles.subheading}>
            {isMinimal
              ? 'Peculiar replaces the prompt-and-pray approach with a proper visual workflow. Manage 12+ ad platforms from one elegant interface.'
              : isLuxe
              ? 'Peculiar is built for marketers who demand precision. A complete command centre for 12+ platforms — no prompts, no guesswork.'
              : isBold
              ? "Forget AI chatbots that generate ad copy. Peculiar gives you a real UI to build, launch & optimise campaigns across 12+ platforms — all in one place."
              : 'Peculiar is the UI-first marketing command centre. Run campaigns across 12+ platforms without writing a single prompt.'}
          </p>

          {/* Platform tags */}
          <div className={styles.platforms}>
            {PLATFORMS.map((p) => (
              <span key={p} className={styles.platformTag}>{p}</span>
            ))}
          </div>

          {/* Features */}
          <div className={styles.features}>
            {FEATURES.map((f) => (
              <div key={f.label} className={styles.feature}>
                <span className={styles.featureIcon}>{f.icon}</span>
                <div>
                  <div className={styles.featureLabel}>{f.label}</div>
                  <div className={styles.featureDesc}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ——— RIGHT / BOTTOM — FORM CARD ——— */}
        <aside className={styles.formSection}>
          <div className={styles.card}>

            {/* Spots counter */}
            <div className={styles.spotsHeader}>
              <div className={styles.spotsLeft}>
                <span className={styles.spotsNumber}>{spotsLeft}</span>
                <span className={styles.spotsLabel}>spots left</span>
              </div>
              <div className={styles.spotsTotal}>of {TOTAL_SPOTS} total</div>
            </div>

            {/* Progress bar */}
            <div className={styles.progressTrack}>
              <div
                className={styles.progressFill}
                style={{ width: `${((TOTAL_SPOTS - spotsLeft) / TOTAL_SPOTS) * 100}%` }}
              />
            </div>

            <div className={styles.progressLabels}>
              <span>{TOTAL_SPOTS - spotsLeft} founding members secured</span>
              <span>{spotsLeft} remaining</span>
            </div>

            {/* Card heading */}
            <div className={styles.cardHeading}>
              <h2>Secure your spot</h2>
              <p>
                Pay <strong>₹500</strong> to lock in founding member access.
                Fully credited when we launch.
              </p>
            </div>

            {/* Form */}
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={`${styles.inputGroup} ${nameFocused ? styles.focused : ''}`}>
                <label className={styles.inputLabel}>Your name</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setNameFocused(true)}
                  onBlur={() => setNameFocused(false)}
                  required
                />
              </div>

              <div className={`${styles.inputGroup} ${emailFocused ? styles.focused : ''}`}>
                <label className={styles.inputLabel}>Work email</label>
                <input
                  className={styles.input}
                  type="email"
                  placeholder="rahul@yourbrand.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  required
                />
              </div>

              {error && <div className={styles.error}>{error}</div>}

              <button
                type="submit"
                className={styles.btn}
                disabled={loading}
                style={{ background: theme.btnGradient }}
              >
                {loading ? (
                  <span className={styles.spinner} />
                ) : (
                  <>
                    <span>Join Waitlist — ₹500</span>
                    <span className={styles.btnArrow}>→</span>
                  </>
                )}
              </button>

              <p className={styles.disclaimer}>
                ₹500 fully credited on launch · Cancel anytime before launch
              </p>
            </form>

            {/* Social proof ticker */}
            <div className={styles.ticker}>
              <span className={styles.tickerDot} />
              <span key={ticker} className={styles.tickerText}>
                {socialProofMessages[ticker % socialProofMessages.length]}
              </span>
            </div>
          </div>

          {/* Trust badges */}
          <div className={styles.trustRow}>
            <div className={styles.trustBadge}>
              <span>🔒</span> Secure payment
            </div>
            <div className={styles.trustBadge}>
              <span>⚡</span> Instant confirmation
            </div>
            <div className={styles.trustBadge}>
              <span>✦</span> Priority access
            </div>
          </div>
        </aside>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <span>© 2025 Peculiar · </span>
        <a href="mailto:hello@try-peculiar.com">hello@try-peculiar.com</a>
        <span> · </span>
        <a href="https://try-peculiar.com">try-peculiar.com</a>
      </footer>
    </div>
  )
}

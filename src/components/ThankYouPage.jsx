import { useEffect, useState } from 'react'
import styles from './ThankYouPage.module.css'

export default function ThankYouPage({ theme, themeIndex, cycleTheme, data, onBack }) {
  const [confetti, setConfetti] = useState([])

  useEffect(() => {
    // Apply theme
    const root = document.documentElement
    Object.entries(theme.vars).forEach(([key, val]) => {
      root.style.setProperty(key, val)
    })
    document.body.style.background = theme.vars['--bg']

    // Generate confetti particles
    const particles = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 2,
      size: 4 + Math.random() * 6,
      color: ['#6366f1', '#f97316', '#d4af37', '#22c55e', '#ec4899', '#06b6d4'][
        Math.floor(Math.random() * 6)
      ],
    }))
    setConfetti(particles)
  }, [theme])

  const position = data?.position || '42'
  const name = data?.name || 'there'
  const firstName = name.split(' ')[0]

  const NEXT_STEPS = [
    {
      num: '01',
      title: 'Check your email',
      desc: `We've sent a confirmation to ${data?.email || 'your inbox'}. Keep it safe.`,
    },
    {
      num: '02',
      title: 'We notify you first',
      desc: 'When launch day arrives, founding members get 48h early access before anyone else.',
    },
    {
      num: '03',
      title: '₹500 gets credited',
      desc: 'Your deposit is fully applied to your first subscription. Zero extra cost.',
    },
  ]

  return (
    <div
      className={styles.container}
      style={{ background: theme.gradient }}
    >
      {theme.noise && <div className={styles.noise} />}

      {/* Confetti */}
      <div className={styles.confettiContainer} aria-hidden>
        {confetti.map((p) => (
          <div
            key={p.id}
            className={styles.confettiPiece}
            style={{
              left: `${p.x}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              width: p.size,
              height: p.size,
              background: p.color,
              borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            }}
          />
        ))}
      </div>

      {/* Theme switcher */}
      <button className={styles.themeSwitcher} onClick={cycleTheme} title="Change theme">
        <span>{theme.emoji}</span>
        <span>{theme.label}</span>
        <span style={{ opacity: 0.5 }}>→</span>
      </button>

      <main className={styles.main}>
        {/* Spot badge */}
        <div className={styles.spotBadge}>
          <div className={styles.spotNumber}>#{position}</div>
          <div className={styles.spotLabel}>Your spot</div>
        </div>

        {/* Heading */}
        <h1 className={styles.heading}>
          You're in,<br />
          <em className={styles.nameAccent}>{firstName}.</em>
        </h1>

        <p className={styles.subtext}>
          You've secured founding member access to Peculiar. You're one of {position} people who believe
          marketing tools can be better — and we're going to prove it.
        </p>

        {/* Stats row */}
        <div className={styles.statsRow}>
          <div className={styles.stat}>
            <div className={styles.statNum}>{position}</div>
            <div className={styles.statLabel}>Your position</div>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <div className={styles.statNum}>12+</div>
            <div className={styles.statLabel}>Platforms at launch</div>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <div className={styles.statNum}>₹500</div>
            <div className={styles.statLabel}>Fully credited</div>
          </div>
        </div>

        {/* Next steps */}
        <div className={styles.stepsContainer}>
          <h2 className={styles.stepsHeading}>What happens next</h2>
          <div className={styles.steps}>
            {NEXT_STEPS.map((step) => (
              <div key={step.num} className={styles.step}>
                <div className={styles.stepNum}>{step.num}</div>
                <div>
                  <div className={styles.stepTitle}>{step.title}</div>
                  <div className={styles.stepDesc}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Share section */}
        <div className={styles.shareSection}>
          <p className={styles.shareText}>Share Peculiar and help build the founding community</p>
          <div className={styles.shareButtons}>
            <a
              href={`https://twitter.com/intent/tweet?text=Just secured my spot on @peculiar_hq waitlist — a UI-first marketing tool for 12+ platforms. No prompts needed. Join the founding 100 👉 https://try-peculiar.com`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.shareBtn}
              style={{ background: theme.btnGradient }}
            >
              Share on X / Twitter →
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=https://try-peculiar.com`}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.shareBtn} ${styles.shareBtnOutline}`}
            >
              Share on LinkedIn →
            </a>
          </div>
        </div>

        <button className={styles.backBtn} onClick={onBack}>
          ← Back to home
        </button>
      </main>

      <footer className={styles.footer}>
        <span>© 2025 Peculiar · </span>
        <a href="mailto:hello@try-peculiar.com">hello@try-peculiar.com</a>
      </footer>
    </div>
  )
}

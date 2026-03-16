import { useState, useEffect, useRef } from 'react'
import s from './LandingPage.module.css'

const TOTAL_SPOTS = 100
const TAKEN = 67

const PLATFORMS = [
  { name: 'Meta Ads', icon: '⬡', color: '#1877f2' },
  { name: 'Google Ads', icon: '◉', color: '#ea4335' },
  { name: 'Instagram', icon: '◈', color: '#e1306c' },
  { name: 'TikTok', icon: '▲', color: '#010101' },
  { name: 'YouTube', icon: '▶', color: '#ff0000' },
  { name: 'Snapchat', icon: '◆', color: '#fffc00' },
  { name: 'Pinterest', icon: '✦', color: '#e60023' },
  { name: 'LinkedIn', icon: '⬛', color: '#0a66c2' },
  { name: 'Twitter / X', icon: '✕', color: '#000000' },
  { name: 'Amazon Ads', icon: '◎', color: '#ff9900' },
  { name: 'Shopify', icon: '⬟', color: '#96bf48' },
  { name: 'Flipkart', icon: '◇', color: '#2874f0' },
]

const FEATURES = [
  {
    tag: 'No prompts',
    headline: 'Build campaigns visually',
    body: 'Every other "AI marketing tool" makes you write prompts. Peculiar gives you a real interface — drag, drop, configure. Your workflow stays yours.',
    icon: '◈',
  },
  {
    tag: '12+ platforms',
    headline: 'One dashboard, every channel',
    body: 'Meta, Google, TikTok, YouTube, Snapchat, Amazon — all connected. Launch once, publish everywhere. No more tab-switching between ad managers.',
    icon: '⬡',
  },
  {
    tag: 'Live analytics',
    headline: 'Real-time performance data',
    body: 'See spend, ROAS, CPM and CTR across all platforms on a single screen. Know what\'s working the moment it happens, not the next morning.',
    icon: '◉',
  },
  {
    tag: 'Build in public',
    headline: 'You shape what we build',
    body: 'We\'re building Peculiar in public. Founding members get a direct line to the team. Your feedback isn\'t a ticket — it\'s a feature.',
    icon: '⟐',
  },
]

const HOW_IT_WORKS = [
  {
    num: '01',
    title: 'Connect your accounts',
    desc: 'Link all your ad accounts in one place. OAuth-powered, read/write access, zero CSV uploads.',
  },
  {
    num: '02',
    title: 'Design your campaign',
    desc: 'Use the visual campaign builder to set audiences, budgets, creatives and schedules — across all platforms at once.',
  },
  {
    num: '03',
    title: 'Launch & monitor',
    desc: 'Hit publish. Peculiar distributes your campaign across every connected platform and starts streaming live data back to your dashboard.',
  },
  {
    num: '04',
    title: 'Optimise with data',
    desc: 'Compare platform performance side-by-side. Pause underperformers, scale winners — all without leaving Peculiar.',
  },
]

const FAQS = [
  {
    q: 'What is the ₹500 for?',
    a: 'It\'s a commitment deposit that confirms you\'re serious about using Peculiar. The full ₹500 is credited to your first subscription — you pay nothing extra at launch. If we don\'t launch, you get a full refund.',
  },
  {
    q: 'When does Peculiar launch?',
    a: 'We\'re in active testing right now across all 12+ platform integrations. We\'re targeting a launch in a few weeks. Founding members are notified 48 hours before public access opens.',
  },
  {
    q: 'What does "UI-first" mean exactly?',
    a: 'Every other AI marketing tool makes you describe what you want in a chat box. Peculiar gives you actual UI controls — visual campaign builders, audience selectors, budget sliders. No prompts, no guesswork.',
  },
  {
    q: 'Can I cancel before launch?',
    a: 'Yes. If you change your mind before we go live, contact hello@try-peculiar.com and we\'ll refund your ₹500 in full, no questions asked.',
  },
  {
    q: 'What platforms are supported at launch?',
    a: 'Meta Ads, Google Ads, Instagram, TikTok, YouTube, Snapchat, Pinterest, LinkedIn, Twitter/X, Amazon Ads, Shopify and Flipkart Ads. We\'re adding more post-launch.',
  },
  {
    q: 'Is this built in India?',
    a: 'Yes. Peculiar is built by an Indian team, priced for Indian businesses, and deeply integrated with platforms like Flipkart and UPI-native payment flows.',
  },
]

const TESTIMONIALS = [
  {
    name: 'Arjun Mehta',
    role: 'D2C Brand founder',
    company: 'Delhi',
    quote: 'Managing Meta and Google separately was killing us. The idea of one dashboard with real UI — not a chatbot — is exactly what we\'ve been waiting for.',
    avatar: 'AM',
  },
  {
    name: 'Priya Iyer',
    role: 'Performance Marketing Lead',
    company: 'Bengaluru',
    quote: 'Most AI tools just generate copy. Peculiar is actually thinking about the workflow problem. That\'s rare.',
    avatar: 'PI',
  },
  {
    name: 'Rahul Singhania',
    role: 'Agency Owner',
    company: 'Mumbai',
    quote: 'We manage 20+ clients across platforms. Even a 30% reduction in tab-switching is worth paying for. Signed up immediately.',
    avatar: 'RS',
  },
]

function useInView(ref) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return visible
}

function Section({ children, className = '' }) {
  const ref = useRef(null)
  const visible = useInView(ref)
  return (
    <div ref={ref} className={`${s.section} ${visible ? s.visible : ''} ${className}`}>
      {children}
    </div>
  )
}

export default function LandingPage({ theme, themeIndex, cycleTheme, onSuccess }) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [openFaq, setOpenFaq] = useState(null)
  const [spotsLeft] = useState(TOTAL_SPOTS - TAKEN)
  const waitlistRef = useRef(null)

  useEffect(() => {
    const root = document.documentElement
    Object.entries(theme.vars).forEach(([k, v]) => root.style.setProperty(k, v))
    document.body.style.background = theme.vars['--bg']
    document.body.style.transition = 'background 0.5s ease'
  }, [theme])

  const scrollToWaitlist = () => waitlistRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !name) { setError('Please fill in both fields'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Enter a valid email'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/waitlist/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message || 'Something went wrong'); setLoading(false); return }
      if (data.razorpayOrderId) initiateRazorpay(data)
    } catch { setError('Connection error. Please try again.'); setLoading(false) }
  }

  const initiateRazorpay = (data) => {
    const opts = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: 50000,
      currency: 'INR',
      name: 'Peculiar',
      description: 'Founding Member — Waitlist Spot',
      order_id: data.razorpayOrderId,
      prefill: { name, email },
      theme: { color: theme.vars['--accent'] },
      handler: async (response) => {
        const verify = await fetch('/api/waitlist/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...response, email, name }),
        })
        const result = await verify.json()
        if (result.success) onSuccess({ position: result.position, email, name })
        else setError('Verification failed. Contact support.')
        setLoading(false)
      },
      modal: { ondismiss: () => setLoading(false) },
    }
    const load = () => { const rzp = new window.Razorpay(opts); rzp.open() }
    if (window.Razorpay) { load() } else {
      const sc = document.createElement('script')
      sc.src = 'https://checkout.razorpay.com/v1/checkout.js'
      sc.onload = load
      document.body.appendChild(sc)
    }
  }

  const isDark = themeIndex === 0 || themeIndex === 3

  return (
    <div className={`${s.page} ${s[`t${themeIndex}`]}`} style={{ background: theme.gradient }}>
      {theme.noise && <div className={s.noise} />}
      {theme.gridLines && <div className={s.grid} />}
      <div className={s.orb1} /><div className={s.orb2} />

      {/* ── NAV ── */}
      <nav className={s.nav}>
        <div className={s.navInner}>
          <div className={s.logo}>peculiar</div>
          <div className={s.navLinks}>
            <a href="#features">Features</a>
            <a href="#platforms">Platforms</a>
            <a href="#how">How it works</a>
            <a href="#pricing">Pricing</a>
          </div>
          <div className={s.navRight}>
            <button className={s.themeBtn} onClick={cycleTheme} title="Switch theme">
              {theme.emoji} {theme.label} →
            </button>
            <button className={s.navCta} onClick={scrollToWaitlist}>
              Join waitlist
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className={s.hero}>
        <div className={s.heroBip}>
          <span className={s.bipDot} />
          Building in public · {TAKEN} founding members secured
        </div>

        <h1 className={s.heroH1}>
          {themeIndex === 0 && <><span className={s.acc}>Stop prompting.</span><br />Start marketing.</>}
          {themeIndex === 1 && <>Marketing tools<br /><span className={s.acc}>with actual UI.</span></>}
          {themeIndex === 2 && <>Marketing,<br /><em>reimagined.</em></>}
          {themeIndex === 3 && <>Where great<br /><em>campaigns</em><br />are crafted.</>}
        </h1>

        <p className={s.heroSub}>
          Peculiar is the UI-first performance marketing platform for 12+ ad channels.
          No chatbots. No prompts. Just a fast, visual workflow that actually makes sense.
        </p>

        <div className={s.heroCtas}>
          <button className={s.primaryBtn} onClick={scrollToWaitlist}
            style={{ background: theme.btnGradient, color: theme.vars['--btn-text'] }}>
            Secure your spot — ₹500 →
          </button>
          <a href="#how" className={s.ghostBtn}>See how it works</a>
        </div>

        <div className={s.heroMeta}>
          <div className={s.heroMetaItem}><strong>{spotsLeft}</strong> spots left</div>
          <div className={s.heroMetaDot} />
          <div className={s.heroMetaItem}><strong>₹500</strong> fully credited at launch</div>
          <div className={s.heroMetaDot} />
          <div className={s.heroMetaItem}><strong>12+</strong> platforms at launch</div>
        </div>

        {/* Mock dashboard preview */}
        <div className={s.mockWrap}>
          <div className={s.mockBar}>
            <span className={s.mockDot} style={{ background: '#ff5f57' }} />
            <span className={s.mockDot} style={{ background: '#ffbd2e' }} />
            <span className={s.mockDot} style={{ background: '#28ca41' }} />
            <span className={s.mockUrl}>app.try-peculiar.com</span>
          </div>
          <div className={s.mockBody}>
            {/* Sidebar */}
            <div className={s.mockSidebar}>
              <div className={s.mockSideItem} style={{ background: 'var(--accent)', opacity: 0.15, borderRadius: 6, height: 32 }} />
              {[...Array(5)].map((_, i) => (
                <div key={i} className={s.mockSideItem} />
              ))}
            </div>
            {/* Main content */}
            <div className={s.mockMain}>
              {/* Stats row */}
              <div className={s.mockStats}>
                {['ROAS', 'Spend', 'Impressions', 'CTR'].map((label, i) => (
                  <div key={label} className={s.mockStat}>
                    <div className={s.mockStatLabel}>{label}</div>
                    <div className={s.mockStatVal} style={{ width: `${40 + i * 12}%` }} />
                  </div>
                ))}
              </div>
              {/* Chart placeholder */}
              <div className={s.mockChart}>
                <svg viewBox="0 0 300 80" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
                  <polyline
                    points="0,60 40,45 80,55 120,30 160,38 200,20 240,28 300,15"
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.8"
                  />
                  <polyline
                    points="0,70 40,65 80,68 120,55 160,60 200,48 240,52 300,42"
                    fill="none"
                    stroke="var(--accent2)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.4"
                  />
                </svg>
              </div>
              {/* Platform rows */}
              <div className={s.mockRows}>
                {['Meta Ads', 'Google', 'TikTok'].map((p, i) => (
                  <div key={p} className={s.mockRow}>
                    <div className={s.mockRowLabel} />
                    <div className={s.mockRowBar}>
                      <div className={s.mockRowFill} style={{ width: `${75 - i * 18}%`, background: 'var(--accent)', opacity: 0.6 + i * 0.1 }} />
                    </div>
                    <div className={s.mockRowNum} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BUILD IN PUBLIC BANNER ── */}
      <Section>
        <div className={s.bipBanner} id="bip">
          <div className={s.bipBannerInner}>
            <div className={s.bipBannerLeft}>
              <span className={s.bipTag}>Building in public</span>
              <h2>You're not a user. You're a co-founder.</h2>
              <p>
                We're building Peculiar with our founding members — not for them. Every feature request
                gets read. Every bug gets fixed publicly. Our changelog is our roadmap, and you help write it.
              </p>
              <div className={s.bipLinks}>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={s.bipLink}>
                  Follow @peculiar_hq →
                </a>
              </div>
            </div>
            <div className={s.bipRight}>
              {[
                { label: 'Week 1', note: 'Meta + Google live ✓', done: true },
                { label: 'Week 2', note: 'TikTok + YouTube ✓', done: true },
                { label: 'Week 3', note: 'Analytics dashboard ✓', done: true },
                { label: 'Now', note: 'Final testing 🔥', done: false, active: true },
                { label: 'Launch', note: 'Founding member access', done: false },
              ].map((item) => (
                <div key={item.label} className={`${s.bipItem} ${item.done ? s.bipDone : ''} ${item.active ? s.bipActive : ''}`}>
                  <div className={s.bipItemDot} />
                  <div>
                    <div className={s.bipItemLabel}>{item.label}</div>
                    <div className={s.bipItemNote}>{item.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ── FEATURES ── */}
      <section className={s.featuresSection} id="features">
        <Section>
          <div className={s.sectionLabel}>Features</div>
          <h2 className={s.sectionH2}>Built different, by design</h2>
          <p className={s.sectionSub}>
            Every marketing tool promises AI. Peculiar delivers a workflow.
          </p>
        </Section>
        <div className={s.featureGrid}>
          {FEATURES.map((f, i) => (
            <Section key={f.tag}>
              <div className={`${s.featureCard} ${i === 0 ? s.featureCardWide : ''}`}>
                <div className={s.featureCardTop}>
                  <span className={s.featureIcon} style={{ color: 'var(--accent)' }}>{f.icon}</span>
                  <span className={s.featureTag}>{f.tag}</span>
                </div>
                <h3 className={s.featureH3}>{f.headline}</h3>
                <p className={s.featureBody}>{f.body}</p>
              </div>
            </Section>
          ))}
        </div>
      </section>

      {/* ── PLATFORMS ── */}
      <section className={s.platformsSection} id="platforms">
        <Section>
          <div className={s.sectionLabel}>Integrations</div>
          <h2 className={s.sectionH2}>12+ platforms. One window.</h2>
          <p className={s.sectionSub}>
            Every major ad platform, connected. Launch once, publish everywhere.
          </p>
        </Section>
        <Section>
          <div className={s.platformGrid}>
            {PLATFORMS.map((p) => (
              <div key={p.name} className={s.platformCard}>
                <div className={s.platformIcon}>{p.icon}</div>
                <div className={s.platformName}>{p.name}</div>
              </div>
            ))}
          </div>
        </Section>
        <Section>
          <div className={s.platformNote}>
            + More platforms added monthly. Founding members vote on what comes next.
          </div>
        </Section>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className={s.howSection} id="how">
        <Section>
          <div className={s.sectionLabel}>Process</div>
          <h2 className={s.sectionH2}>From signup to live campaign in minutes</h2>
        </Section>
        <div className={s.howGrid}>
          {HOW_IT_WORKS.map((step, i) => (
            <Section key={step.num}>
              <div className={s.howCard}>
                <div className={s.howNum} style={{ color: 'var(--accent)' }}>{step.num}</div>
                {i < HOW_IT_WORKS.length - 1 && <div className={s.howLine} />}
                <h3 className={s.howTitle}>{step.title}</h3>
                <p className={s.howDesc}>{step.desc}</p>
              </div>
            </Section>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className={s.testimonialsSection} id="testimonials">
        <Section>
          <div className={s.sectionLabel}>Early feedback</div>
          <h2 className={s.sectionH2}>What founding members are saying</h2>
        </Section>
        <div className={s.testimonialGrid}>
          {TESTIMONIALS.map((t) => (
            <Section key={t.name}>
              <div className={s.testimonialCard}>
                <p className={s.testimonialQuote}>"{t.quote}"</p>
                <div className={s.testimonialAuthor}>
                  <div className={s.testimonialAvatar} style={{ background: theme.btnGradient, color: theme.vars['--btn-text'] }}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className={s.testimonialName}>{t.name}</div>
                    <div className={s.testimonialRole}>{t.role} · {t.company}</div>
                  </div>
                </div>
              </div>
            </Section>
          ))}
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className={s.pricingSection} id="pricing">
        <Section>
          <div className={s.sectionLabel}>Founding offer</div>
          <h2 className={s.sectionH2}>100 spots. ₹500 to lock yours.</h2>
          <p className={s.sectionSub}>Not a subscription fee. A commitment deposit — fully credited at launch.</p>
        </Section>
        <Section>
          <div className={s.pricingCard}>
            <div className={s.pricingLeft}>
              <div className={s.pricingBadge}>Founding Member</div>
              <div className={s.pricingAmount}>
                <span className={s.pricingCurrency}>₹</span>500
                <span className={s.pricingPer}> one-time deposit</span>
              </div>
              <p className={s.pricingNote}>Credited to your first month. Cancel before launch for full refund.</p>
              <ul className={s.pricingPerks}>
                {[
                  'Priority access — 48h before public launch',
                  'Founding member badge on your account',
                  'Locked-in early pricing forever',
                  'Direct line to the Peculiar team',
                  '₹500 fully credited to subscription',
                  'Vote on which platforms we add next',
                ].map((perk) => (
                  <li key={perk} className={s.pricingPerk}>
                    <span className={s.perkCheck} style={{ color: 'var(--accent)' }}>✓</span>
                    {perk}
                  </li>
                ))}
              </ul>
            </div>
            <div className={s.pricingRight}>
              <div className={s.pricingSpotsLeft}>
                <div className={s.pricingSpotNum}>{spotsLeft}</div>
                <div className={s.pricingSpotLabel}>spots remaining</div>
              </div>
              <div className={s.pricingProgress}>
                <div className={s.pricingProgressFill} style={{ width: `${(TAKEN / TOTAL_SPOTS) * 100}%`, background: theme.btnGradient }} />
              </div>
              <div className={s.pricingProgressMeta}>{TAKEN} of {TOTAL_SPOTS} taken</div>
              <button
                className={s.pricingCta}
                onClick={scrollToWaitlist}
                style={{ background: theme.btnGradient, color: theme.vars['--btn-text'] }}
              >
                Secure my spot →
              </button>
            </div>
          </div>
        </Section>
      </section>

      {/* ── FAQ ── */}
      <section className={s.faqSection} id="faq">
        <Section>
          <div className={s.sectionLabel}>FAQ</div>
          <h2 className={s.sectionH2}>Questions answered</h2>
        </Section>
        <div className={s.faqList}>
          {FAQS.map((faq, i) => (
            <Section key={i}>
              <div
                className={`${s.faqItem} ${openFaq === i ? s.faqOpen : ''}`}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div className={s.faqQ}>
                  <span>{faq.q}</span>
                  <span className={s.faqArrow} style={{ color: 'var(--accent)' }}>{openFaq === i ? '−' : '+'}</span>
                </div>
                {openFaq === i && <div className={s.faqA}>{faq.a}</div>}
              </div>
            </Section>
          ))}
        </div>
      </section>

      {/* ── WAITLIST FORM ── */}
      <section className={s.waitlistSection} id="waitlist" ref={waitlistRef}>
        <Section>
          <div className={s.waitlistInner}>
            <div className={s.waitlistLeft}>
              <div className={s.sectionLabel}>Join the waitlist</div>
              <h2 className={s.waitlistH2}>
                {themeIndex === 3 ? <>One of a<br /><em>hundred.</em></> : <>Get in<br />before it fills.</>}
              </h2>
              <p className={s.waitlistSub}>
                {spotsLeft} spots left. Pay ₹500 to secure your founding member access.
                It's credited in full when we launch.
              </p>
              <div className={s.waitlistTrust}>
                {['🔒 Secure payment via Razorpay', '⚡ Instant confirmation email', '↩ Full refund if we don\'t launch'].map(t => (
                  <div key={t} className={s.trustLine}>{t}</div>
                ))}
              </div>
            </div>

            <div className={s.waitlistRight}>
              {/* Spots counter */}
              <div className={s.counterRow}>
                <span className={s.counterNum} style={{ color: 'var(--accent)' }}>{spotsLeft}</span>
                <span className={s.counterLabel}>spots left of {TOTAL_SPOTS}</span>
              </div>
              <div className={s.counterTrack}>
                <div className={s.counterFill} style={{
                  width: `${(TAKEN / TOTAL_SPOTS) * 100}%`,
                  background: theme.btnGradient,
                }} />
              </div>

              <form className={s.form} onSubmit={handleSubmit}>
                <div className={s.inputWrap}>
                  <label className={s.inputLabel}>Your name</label>
                  <input
                    className={s.input}
                    type="text"
                    placeholder="Rahul Sharma"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                  />
                </div>
                <div className={s.inputWrap}>
                  <label className={s.inputLabel}>Work email</label>
                  <input
                    className={s.input}
                    type="email"
                    placeholder="rahul@brand.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
                {error && <div className={s.formError}>{error}</div>}
                <button
                  type="submit"
                  className={s.formBtn}
                  disabled={loading}
                  style={{ background: theme.btnGradient, color: theme.vars['--btn-text'] }}
                >
                  {loading
                    ? <span className={s.spinner} />
                    : <><span>Join Waitlist — ₹500</span><span>→</span></>
                  }
                </button>
                <p className={s.formDisclaimer}>
                  ₹500 deposited via Razorpay · Fully credited on launch · Cancel anytime
                </p>
              </form>
            </div>
          </div>
        </Section>
      </section>

      {/* ── FOOTER ── */}
      <footer className={s.footer}>
        <div className={s.footerInner}>
          <div className={s.footerLogo}>peculiar</div>
          <div className={s.footerLinks}>
            <a href="mailto:hello@try-peculiar.com">hello@try-peculiar.com</a>
            <a href="https://try-peculiar.com">try-peculiar.com</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter / X</a>
          </div>
          <div className={s.footerCopy}>© 2025 Peculiar. Built in India 🇮🇳</div>
        </div>
      </footer>
    </div>
  )
}

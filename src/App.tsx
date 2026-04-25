import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react'
import emailjs from '@emailjs/browser'
import './App.css'
import { useTranslations, type Lang, type Translations } from './i18n'
import { PROJECTS } from './data/projects'
import { SKILLS } from './data/skills'

type T = Translations

const SECTIONS = ['home', 'about', 'projects', 'skills', 'contact'] as const
type Section = typeof SECTIONS[number]

/* ============ Icons ============ */
const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.4-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.7.4-1.3.7-1.5-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.4-2.3 1.2-3.2-.1-.3-.5-1.5.1-3 0 0 1-.3 3.3 1.2.9-.3 1.9-.4 2.9-.4s2 .1 2.9.4c2.3-1.6 3.3-1.2 3.3-1.2.7 1.6.2 2.7.1 3 .8.8 1.2 1.9 1.2 3.2 0 4.5-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.2c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z"/></svg>
)
const GitlabIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.7 9.5L22.6 9.4 19.5.7c-.2-.5-.7-.7-1.2-.6-.5.1-.9.5-.9 1L15.3 7.7H8.7L6.6 1c-.1-.5-.5-.9-.9-1-.5-.1-1 .2-1.2.6L1.4 9.3l-.1.2c-.5 1.2-.1 2.6.9 3.4l9.3 6.8c.3.2.7.2 1 0l9.3-6.8c1-.7 1.4-2.2.8-3.4z"/></svg>
)
const DownloadIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14"/></svg>
const ArrowL = () => <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
const ArrowR = () => <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 6l6 6-6 6"/></svg>

/* ============ Particles (Home only) ============ */
function Particles({ active }: { active: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (!active) return
    const cv = ref.current!
    const ctx = cv.getContext('2d')!
    let raf: number
    function resize() {
      const r = cv.getBoundingClientRect()
      const w = Math.max(1, r.width), h = Math.max(1, r.height)
      cv.width = w * devicePixelRatio
      cv.height = h * devicePixelRatio
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(devicePixelRatio, devicePixelRatio)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(cv)
    const N = 28
    const parts = Array.from({ length: N }, () => ({
      x: Math.random(), y: Math.random(),
      vx: (Math.random() - .5) * 0.0008,
      vy: (Math.random() - .5) * 0.0008,
      r: 0.5 + Math.random() * 1.6,
      a: 0.2 + Math.random() * 0.6
    }))
    function tick() {
      const w = cv.width / devicePixelRatio
      const h = cv.height / devicePixelRatio
      ctx.clearRect(0, 0, w, h)
      parts.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > 1) p.vx *= -1
        if (p.y < 0 || p.y > 1) p.vy *= -1
        const x = p.x * w, y = p.y * h
        const grd = ctx.createRadialGradient(x, y, 0, x, y, p.r * 6)
        grd.addColorStop(0, `rgba(0,255,209,${p.a})`)
        grd.addColorStop(1, 'rgba(0,255,209,0)')
        ctx.fillStyle = grd
        ctx.beginPath()
        ctx.arc(x, y, p.r * 6, 0, Math.PI * 2)
        ctx.fill()
      })
      raf = requestAnimationFrame(tick)
    }
    tick()
    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [active])
  return <canvas ref={ref} className="particles" style={{ background: 'transparent' }} />
}

/* ============ Project Card ============ */
function ProjectsView({ lang, t }: { lang: Lang; t: T }) {
  const [i, setI] = useState(0)
  const [phase, setPhase] = useState<'in' | 'out-left' | 'out-right'>('in')
  const move = (dir: number) => {
    setPhase(dir > 0 ? 'out-left' : 'out-right')
    setTimeout(() => {
      setI(prev => (prev + dir + PROJECTS.length) % PROJECTS.length)
      setPhase(dir > 0 ? 'out-right' : 'out-left')
      requestAnimationFrame(() => setTimeout(() => setPhase('in'), 20))
    }, 320)
  }
  const p = PROJECTS[i]
  return (
    <>
      <div className="eyebrow"><span>{t.projects.eyebrow}</span><span className="num">/ 03</span></div>
      <h2 className="title">{t.projects.title}</h2>
      <div className="pcard-stage">
        <div className={`project-card pcard ${phase}`}>
          {p.linkLabel === 'live' && (
            <span className="live-badge"><span className="ldot"></span>Live</span>
          )}
          <div className="pcard-head">
            <h3>{p.name}</h3>
            <span className="idx">{String(i + 1).padStart(2, '0')}</span>
          </div>
          <div className="tags">{p.tags.map(tg => <span key={tg} className="tag">{tg}</span>)}</div>
          <p>{p[lang]}</p>
          <div className="pcard-foot">
            <a href={p.link} target="_blank" rel="noopener noreferrer">
              {p.linkLabel === 'live' ? t.projects.live : t.projects.view}
            </a>
            <div className="pcard-nav">
              <button onClick={() => move(-1)} aria-label="prev"><ArrowL /></button>
              <button onClick={() => move(1)} aria-label="next"><ArrowR /></button>
            </div>
          </div>
        </div>
      </div>
      <div className="pcounter"><b>{String(i + 1).padStart(2, '0')}</b> {t.projects.counter} {String(PROJECTS.length).padStart(2, '0')}</div>
    </>
  )
}

/* ============ Sections ============ */
function HomeView({ t, active }: { t: T; active: boolean }) {
  return (
    <>
      <Particles active={active} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className="eyebrow"><span>{t.home.eyebrow}</span><span className="num">/ 01</span></div>
        <h1 className="title">Florian Hien</h1>
        <div className="subtitle">{t.home.subtitle}</div>
        <div className="tagline">— {t.home.tagline}</div>
        <div className="icon-row">
          <a className="icon-btn" href="https://github.com/yannuser" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><GithubIcon /></a>
          <a className="icon-btn" href="https://gitlab.com/hienpollo" target="_blank" rel="noopener noreferrer" aria-label="GitLab"><GitlabIcon /></a>
        </div>
        <a className="cv-btn" href="https://github.com/yannuser" target="_blank" rel="noopener noreferrer"><DownloadIcon />{t.home.cv}</a>
      </div>
    </>
  )
}

function AboutView({ t }: { t: T }) {
  return (
    <>
      <div className="eyebrow"><span>{t.about.eyebrow}</span><span className="num">/ 02</span></div>
      <h2 className="title" style={{ whiteSpace: 'pre-line' }}>{t.about.title}</h2>
      <p className="body">{t.about.body}</p>
      <span className="badge">{t.about.badge}</span>
    </>
  )
}

function SkillsView({ t, active }: { t: T; lang: Lang; active: boolean }) {
  const [shown, setShown] = useState(false)
  useEffect(() => {
    if (active) { const id = requestAnimationFrame(() => setShown(true)); return () => cancelAnimationFrame(id) }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    else { setShown(false) }
  }, [active])
  const renderPills = (arr: string[], baseIdx: number) => (
    <div className={`skill-pills ${shown ? 'in' : ''}`}>
      {arr.map((s, idx) => (
        <span key={s} className="pill" style={{ transitionDelay: `${(baseIdx + idx) * 40}ms` }}>{s}</span>
      ))}
    </div>
  )
  return (
    <>
      <div className="eyebrow"><span>{t.skills.eyebrow}</span><span className="num">/ 04</span></div>
      <h2 className="title">{t.skills.title}</h2>
      <div className="skill-group"><h4>{t.skills.langs}</h4>{renderPills(SKILLS.langs, 0)}</div>
      <div className="skill-group"><h4>{t.skills.libs}</h4>{renderPills(SKILLS.libs, SKILLS.langs.length)}</div>
      <div className="skill-group"><h4>{t.skills.tools}</h4>{renderPills(SKILLS.tools, SKILLS.langs.length + SKILLS.libs.length)}</div>
    </>
  )
}

function ContactView({ t }: { t: T }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const formRef = useRef<HTMLFormElement>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formRef.current) return
    setStatus('sending')
    try {
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current,
        { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY }
      )
      setStatus('sent')
      setTimeout(() => {
        setStatus('idle')
        formRef.current?.reset()
      }, 3500)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3500)
    }
  }

  const sent = status === 'sent'
  const sending = status === 'sending'
  const error = status === 'error'

  return (
    <>
      <div className="eyebrow"><span>{t.contact.eyebrow}</span><span className="num">/ 05</span></div>
      <h2 className="title">{t.contact.title}</h2>
      <a className="email-line" href="mailto:hienpollo@gmail.com">hienpollo@gmail.com</a>
      <div style={{ position: 'relative', width: '100%', maxWidth: 460 }}>
        <form ref={formRef} className={`contact-form ${sent || error ? 'fade' : ''}`} onSubmit={onSubmit}>
          <div className="row">
            <input name="from_name" type="text" placeholder={t.contact.name} required />
            <input name="from_email" type="email" placeholder={t.contact.email} required />
          </div>
          <textarea name="message" placeholder={t.contact.message} required />
          <button type="submit" className="send-btn" disabled={sending}>
            {sending ? t.contact.sending : t.contact.send}
          </button>
        </form>
        <div className={`contact-success ${sent || error ? 'on' : ''}`} style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <div className="success-icon" style={{ borderColor: error ? 'var(--accent-err)' : undefined, boxShadow: error ? '0 0 24px rgba(255,80,80,0.25)' : undefined }}>
            {sent
              ? <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 13l4 4L19 7"/></svg>
              : <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="var(--accent-err,#ff5050)" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            }
          </div>
          <p style={{ color: 'var(--ink)', fontFamily: 'var(--ff-display)', fontSize: 16, maxWidth: '30ch', lineHeight: 1.5 }}>
            {sent ? t.contact.sent : t.contact.error}
          </p>
        </div>
      </div>
      <div className="icon-row">
        <a className="icon-btn" href="https://github.com/yannuser" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><GithubIcon /></a>
        <a className="icon-btn" href="https://gitlab.com/hienpollo" target="_blank" rel="noopener noreferrer" aria-label="GitLab"><GitlabIcon /></a>
      </div>
    </>
  )
}

/* ============ App ============ */
export default function App() {
  const [lang, setLang] = useState<Lang>('en')
  const [section, setSection] = useState<Section>('home')
  const [agitating, setAgitating] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [wobble, setWobble] = useState<Record<number, boolean>>({})
  const navpillRef = useRef<HTMLElement>(null)
  const indicatorRef = useRef<HTMLSpanElement>(null)
  const indicatorInitialized = useRef(false)
  const hintShownRef = useRef(false)
  const t = useTranslations(lang)

  const goTo = useCallback((next: Section) => {
    if (next === section || agitating) return
    setAgitating(true)
    setTimeout(() => setSection(next), 380)
    setTimeout(() => setAgitating(false), 820)
  }, [section, agitating])

  const cycle = useCallback((dir: number) => {
    const idx = SECTIONS.indexOf(section)
    const nx = (idx + dir + SECTIONS.length) % SECTIONS.length
    goTo(SECTIONS[nx])
  }, [section, goTo])

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') return
      if (e.key === 'ArrowRight') cycle(1)
      else if (e.key === 'ArrowLeft') cycle(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [cycle])

  // Touch swipe
  useEffect(() => {
    let sx = 0, sy = 0
    const onStart = (e: TouchEvent) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY }
    const onEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - sx
      const dy = e.changedTouches[0].clientY - sy
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) cycle(1); else cycle(-1)
      }
    }
    window.addEventListener('touchstart', onStart, { passive: true })
    window.addEventListener('touchend', onEnd, { passive: true })
    return () => { window.removeEventListener('touchstart', onStart); window.removeEventListener('touchend', onEnd) }
  }, [cycle])

  // Mouse-driven satellite drift
  useEffect(() => {
    const targets: Record<number, { x: number; y: number }> = {}
    const current: Record<number, { x: number; y: number }> = {}
    let raf: number
    const onMove = (e: MouseEvent) => {
      const cx = innerWidth / 2, cy = innerHeight / 2
      const nx = (e.clientX - cx) / cx
      const ny = (e.clientY - cy) / cy
      ;[1, 2, 3, 4, 5, 6].forEach(i => {
        const mag = [10, 6, 14, 4, 8, 6][i - 1]
        const sign = [1, -1, 1, -1, 1, -1][i - 1]
        targets[i] = { x: nx * mag * sign, y: ny * mag * sign }
      })
    }
    function tick() {
      ;[1, 2, 3, 4, 5, 6].forEach(i => {
        if (!current[i]) current[i] = { x: 0, y: 0 }
        const tg = targets[i] || { x: 0, y: 0 }
        current[i].x += (tg.x - current[i].x) * 0.05
        current[i].y += (tg.y - current[i].y) * 0.05
        const el = document.querySelector(`.sat.s${i}`) as HTMLElement | null
        if (el) {
          el.style.setProperty('--tx', current[i].x.toFixed(2) + 'px')
          el.style.setProperty('--ty', current[i].y.toFixed(2) + 'px')
          if (!el.classList.contains('wobble')) {
            el.style.transform = `translate(${current[i].x.toFixed(2)}px, ${current[i].y.toFixed(2)}px)`
          }
        }
      })
      raf = requestAnimationFrame(tick)
    }
    window.addEventListener('mousemove', onMove)
    raf = requestAnimationFrame(tick)
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf) }
  }, [])

  // First-load hint
  useEffect(() => {
    if (hintShownRef.current) return
    hintShownRef.current = true
    const a = setTimeout(() => setShowHint(true), 1000)
    const b = setTimeout(() => setShowHint(false), 5000)
    return () => { clearTimeout(a); clearTimeout(b) }
  }, [])

  // Nav indicator — direct DOM manipulation so the transition doesn't animate on first paint
  useLayoutEffect(() => {
    const move = (instant: boolean) => {
      if (!navpillRef.current || !indicatorRef.current) return
      const btn = navpillRef.current.querySelector<HTMLElement>('button.on')
      if (!btn) return
      const r = btn.getBoundingClientRect()
      const pr = navpillRef.current.getBoundingClientRect()
      if (!r.width) return
      const el = indicatorRef.current
      if (instant) {
        el.style.transition = 'none'
        el.style.left = (r.left - pr.left) + 'px'
        el.style.width = r.width + 'px'
        el.getBoundingClientRect() // force reflow before re-enabling transition
        el.style.transition = ''
      } else {
        el.style.left = (r.left - pr.left) + 'px'
        el.style.width = r.width + 'px'
      }
    }
    const isInit = !indicatorInitialized.current
    if (isInit) {
      indicatorInitialized.current = true
      move(true)
      document.fonts?.ready.then(() => move(true))
    } else {
      move(false)
    }
  }, [section, lang])

  const tapSat = (i: number) => {
    setWobble(w => ({ ...w, [i]: true }))
    setTimeout(() => setWobble(w => ({ ...w, [i]: false })), 600)
  }

  return (
    <>
      <div className="topbar">
        <div className="brand"><span className="pulse" /><span>FH · build.0426</span></div>
        <div className="lang">
          <button className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>EN</button>
          <button className={lang === 'fr' ? 'on' : ''} onClick={() => setLang('fr')}>FR</button>
        </div>
      </div>

      <div className="stage">
        <div className="blob-wrap">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className={`sat s${i} ${wobble[i] ? 'wobble' : ''}`} onClick={() => tapSat(i)} />
          ))}
          <div className={`blob ${agitating ? 'agitating' : ''}`}>
            <div className="blob-spec" />
            <div className="blob-content">
              <div className={`section ${section === 'home' ? 'active' : ''}`}><HomeView t={t} active={section === 'home'} /></div>
              <div className={`section ${section === 'about' ? 'active' : ''}`}><AboutView t={t} /></div>
              <div className={`section ${section === 'projects' ? 'active' : ''}`}><ProjectsView lang={lang} t={t} /></div>
              <div className={`section ${section === 'skills' ? 'active' : ''}`}><SkillsView t={t} lang={lang} active={section === 'skills'} /></div>
              <div className={`section ${section === 'contact' ? 'active' : ''}`}><ContactView t={t} /></div>
            </div>
          </div>
        </div>
      </div>

      <nav className="navpill" ref={navpillRef}>
        <span className="indicator" ref={indicatorRef}></span>
        {SECTIONS.map(s => (
          <button key={s} className={section === s ? 'on' : ''} onClick={() => goTo(s)}>{t.nav[s]}</button>
        ))}
      </nav>

      <div className={`nav-hint ${showHint ? 'on' : ''}`}>{t.hint}</div>

      <div className="dots">
        {SECTIONS.map(s => (
          <button key={s} className={section === s ? 'on' : ''} onClick={() => goTo(s)} aria-label={s}>
            <span className="lbl">{t.nav[s]}</span>
          </button>
        ))}
      </div>

    </>
  )
}

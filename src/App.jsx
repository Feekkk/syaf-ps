import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import {
  brand,
  faq,
  categories,
  footer,
  contact,
  items,
} from './content'
import './App.css'

const tiktokLink = `https://www.tiktok.com/@${brand.tiktok}`

const titles = {
  '/': 'syafwaldorf · pre-loved shop',
  '/faq': 'FAQ · syafwaldorf',
  '/contact': 'Contact · syafwaldorf',
}

function currentPath() {
  const { pathname, hash } = window.location
  if (hash === '#faq' || pathname === '/faq') return '/faq'
  if (hash === '#contact' || pathname === '/contact') return '/contact'
  return '/'
}

function go(event, href) {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
    return
  }
  event.preventDefault()
  if (currentPath() === href) {
    window.scrollTo(0, 0)
    return
  }
  window.history.pushState({}, '', href)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

function useRoute() {
  const [path, setPath] = useState(currentPath)

  useEffect(() => {
    const pathNow = currentPath()
    if (window.location.hash === '#faq' || window.location.hash === '#contact') {
      window.history.replaceState({}, '', pathNow)
    }
    const sync = () => setPath(currentPath())
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [])

  useEffect(() => {
    document.title = titles[path] ?? titles['/']
    window.scrollTo(0, 0)
  }, [path])

  return path
}

const dockLinks = [
  {
    id: 'drop',
    href: '/',
    label: 'Pre-loved',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 5.5a1.6 1.6 0 1 1 1.55 2.05L12 9.2 6.8 7.4 5.2 19.5h13.6L17.2 7.4 12 9.2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: 'faq',
    href: '/faq',
    label: 'FAQ',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="8.25" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M9.6 9.4a2.5 2.5 0 0 1 4.7.9c0 1.5-1.5 2-2.3 2.6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle cx="12" cy="16.4" r="0.9" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: 'contact',
    href: '/contact',
    label: 'Contact',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect
          x="4"
          y="6.5"
          width="16"
          height="11"
          rx="1.6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="m5 8 7 5.2L19 8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
]

function Masthead() {
  return (
    <header className="mast">
      <a className="mast__name" href="/" onClick={(event) => go(event, '/')}>
        {brand.wordmark}
      </a>
      <blockquote className="mast__quote">{brand.mastLine}</blockquote>
      <hr className="mast__rule" aria-hidden="true" />
    </header>
  )
}

function Dock({ path }) {
  return (
    <nav className="dock" aria-label="Primary">
      <ul className="dock__list">
        {dockLinks.map((link) => {
          const current = path === link.href
          return (
            <li key={link.id}>
              <a
                className={current ? 'dock__item is-active' : 'dock__item'}
                href={link.href}
                aria-current={current ? 'page' : undefined}
                onClick={(event) => go(event, link.href)}
              >
                <span className="dock__icon">{link.icon}</span>
                <span className="dock__label">{link.label}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

const EASE_OUT = 'cubic-bezier(0.16, 1, 0.3, 1)'
const SWIPE_PX = 80
const SWIPE_VELOCITY = 0.11

function money(value) {
  return value == null ? 'RM —' : `RM ${value}`
}

function offPercent(actual, current) {
  if (actual == null || current == null || actual <= 0 || current >= actual) {
    return null
  }
  return Math.round((1 - current / actual) * 100)
}

function PieceCard({
  piece,
  depth,
  leaving,
  maximized,
  cardRef,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onClick,
}) {
  const names = ['card']
  if (leaving) names.push('card--leaving')
  if (maximized) names.push('card--max')
  const off = offPercent(piece.actualPrice, piece.sellPrice)

  return (
    <article
      className={names.join(' ')}
      data-depth={leaving || maximized ? undefined : depth}
      ref={cardRef}
      tabIndex={maximized ? 0 : undefined}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onClick={onClick}
    >
      <figure className="card__figure">
        <img
          className="card__photo"
          src={piece.photo ?? '/placeholder-item.svg'}
          alt={piece.title}
          width="320"
          height="400"
          draggable={false}
        />
      </figure>
      {maximized ? null : (
        <div className="card__body">
          <h3 className="card__title">{piece.title}</h3>
          <dl className="card__facts">
            <div>
              <dt>Size</dt>
              <dd>{piece.size}</dd>
            </div>
            <div>
              <dt>Actual price</dt>
              <dd className="card__deal">
                <s className="card__was">{money(piece.actualPrice)}</s>
                {off != null ? (
                  <span className="card__off">−{off}%</span>
                ) : null}
              </dd>
            </div>
            <div>
              <dt>Current price</dt>
              <dd className="card__now">{money(piece.sellPrice)}</dd>
            </div>
          </dl>
          <a
            className="link-action"
            href={tiktokLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            Enquire
          </a>
        </div>
      )}
    </article>
  )
}

function Deck({ pieces }) {
  const [index, setIndex] = useState(0)
  const [flight, setFlight] = useState(null)
  const [maxed, setMaxed] = useState(null)
  const frontRef = useRef(null)
  const leaveRef = useRef(null)
  const maxRef = useRef(null)
  const lightboxRef = useRef(null)
  const originRect = useRef(null)
  const closingRef = useRef(false)
  const dragRef = useRef(null)
  const busyRef = useRef(false)

  useEffect(() => {
    setIndex(0)
    setFlight(null)
    setMaxed(null)
    busyRef.current = false
  }, [pieces])

  const reduceMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const step = (dir) => {
    setIndex((current) => (current + dir + pieces.length) % pieces.length)
  }

  const flipTo = (el, fromRect, toRect, reverse) => {
    el.style.transformOrigin = '0 0'
    const dx = fromRect.left - toRect.left
    const dy = fromRect.top - toRect.top
    const sx = fromRect.width / toRect.width
    const sy = fromRect.height / toRect.height
    const compact = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`
    return el.animate(
      reverse
        ? [{ transform: 'none' }, { transform: compact }]
        : [{ transform: compact }, { transform: 'none' }],
      { duration: 280, easing: EASE_OUT, fill: reverse ? 'forwards' : 'none' },
    )
  }

  const openedAt = useRef(0)

  const closeMax = () => {
    if (Date.now() - openedAt.current < 450) return
    const el = maxRef.current
    const dest = frontRef.current?.getBoundingClientRect() ?? originRect.current
    if (!el || !dest || reduceMotion() || closingRef.current) {
      setMaxed(null)
      return
    }
    closingRef.current = true
    const motion = flipTo(el, dest, el.getBoundingClientRect(), true)
    motion.finished.then(() => {
      closingRef.current = false
      setMaxed(null)
    })
  }

  useLayoutEffect(() => {
    if (!maxed || !maxRef.current || closingRef.current) return
    const el = maxRef.current
    const first = originRect.current
    if (!first) return
    if (reduceMotion()) {
      el.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 200,
        easing: EASE_OUT,
      })
      return
    }
    flipTo(el, first, el.getBoundingClientRect(), false)
  }, [maxed])

  useEffect(() => {
    if (!maxed) return
    const box = lightboxRef.current
    if (!box) return

    const previous = document.activeElement
    const { body, documentElement } = document
    const gutter = window.innerWidth - documentElement.clientWidth
    body.style.overflow = 'hidden'
    if (gutter > 0) body.style.paddingRight = `${gutter}px`
    documentElement.classList.add('is-lightbox')

    const onTouchMove = (event) => {
      if (event.target instanceof Node && box.contains(event.target)) return
      event.preventDefault()
    }
    document.addEventListener('touchmove', onTouchMove, { passive: false })

    const targets = () =>
      [...box.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])')].filter(
        (node) => !node.hasAttribute('disabled'),
      )

    const closeButton = box.querySelector('.lightbox__scrim')
    if (closeButton instanceof HTMLElement) {
      closeButton.focus({ preventScroll: true })
    } else {
      box.focus({ preventScroll: true })
    }

    const onTab = (event) => {
      if (event.key !== 'Tab') return
      const nodes = targets()
      if (nodes.length === 0) {
        event.preventDefault()
        box.focus({ preventScroll: true })
        return
      }
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      const active = document.activeElement
      if (event.shiftKey && (active === first || active === box)) {
        event.preventDefault()
        last.focus()
        return
      }
      if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    box.addEventListener('keydown', onTab)
    return () => {
      box.removeEventListener('keydown', onTab)
      document.removeEventListener('touchmove', onTouchMove)
      documentElement.classList.remove('is-lightbox')
      body.style.overflow = ''
      body.style.paddingRight = ''
      if (previous instanceof HTMLElement) previous.focus({ preventScroll: true })
    }
  }, [maxed])

  useLayoutEffect(() => {
    if (!flight || !leaveRef.current) return
    const el = leaveRef.current
    const width = el.getBoundingClientRect().width
    const from = flight.from || 'none'
    const to = `translateX(${flight.dir * (width + 96)}px) rotate(${flight.dir * 12}deg)`
    const motion = el.animate(
      [
        { transform: from, opacity: 1 },
        { transform: to, opacity: 0 },
      ],
      { duration: 280, easing: EASE_OUT, fill: 'forwards' },
    )
    let alive = true
    motion.finished.then(() => {
      if (!alive) return
      setFlight(null)
      busyRef.current = false
    })
    return () => {
      alive = false
      motion.cancel()
    }
  }, [flight])

  const snap = (el) => {
    el.style.transition = `transform 220ms ${EASE_OUT}`
    el.style.transform = ''
    const done = () => {
      el.style.transition = ''
      el.classList.remove('card--live')
      el.removeEventListener('transitionend', done)
    }
    el.addEventListener('transitionend', done)
  }

  const onPointerDown = (event) => {
    if (event.button !== 0) return
    if (event.target.closest('a')) return
    if (dragRef.current || busyRef.current || maxed) return
    const el = frontRef.current
    if (!el) return
    el.getAnimations().forEach((animation) => animation.cancel())
    el.style.transition = ''
    el.classList.add('card--live')
    el.setPointerCapture(event.pointerId)
    dragRef.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      lastX: event.clientX,
      lastT: Date.now(),
      dx: 0,
      dy: 0,
      locked: false,
    }
  }

  const onPointerMove = (event) => {
    const drag = dragRef.current
    if (!drag || drag.id !== event.pointerId) return
    const el = frontRef.current
    if (!el) return
    const dx = event.clientX - drag.x
    const dy = event.clientY - drag.y
    if (pieces.length < 2) return
    if (!drag.locked) {
      if (Math.hypot(dx, dy) < 28) return
      if (Math.abs(dx) <= Math.abs(dy)) return
      drag.locked = true
    }
    drag.dx = dx
    drag.dy = dy
    drag.lastX = event.clientX
    drag.lastT = Date.now()
    event.preventDefault()
    el.style.transform = `translateX(${dx}px) rotate(${dx / 18}deg)`
  }

  const onPointerUp = (event) => {
    const drag = dragRef.current
    if (!drag || drag.id !== event.pointerId) return
    const el = frontRef.current
    dragRef.current = null
    if (!el) return
    if (!drag.locked) {
      event.preventDefault()
      el.classList.remove('card--live')
      originRect.current = el.getBoundingClientRect()
      openedAt.current = Date.now()
      setMaxed(pieces[index])
      return
    }
    const elapsed = Math.max(Date.now() - drag.lastT, 1)
    const velocity = Math.abs(event.clientX - drag.lastX) / elapsed
    const dir = drag.dx === 0 ? 1 : Math.sign(drag.dx)
    const shouldLeave =
      Math.abs(drag.dx) >= SWIPE_PX || velocity > SWIPE_VELOCITY
    if (reduceMotion() || !shouldLeave) {
      if (reduceMotion() && shouldLeave) {
        el.style.transform = ''
        el.classList.remove('card--live')
        step(1)
        return
      }
      snap(el)
      return
    }
    busyRef.current = true
    const from = el.style.transform
    setFlight({ piece: pieces[index], dir, from })
    step(1)
  }

  useEffect(() => {
    const onKey = (event) => {
      if (maxed) {
        if (event.key === 'Escape') {
          event.preventDefault()
          closeMax()
        }
        return
      }
      if (pieces.length < 2 || busyRef.current) return
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        step(1)
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        step(-1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [pieces.length, maxed])

  if (pieces.length === 0) return null

  const outgoingId = flight?.piece.id
  const stack = []
  for (let offset = 0; stack.length < Math.min(3, pieces.length); offset += 1) {
    if (offset >= pieces.length) break
    const piece = pieces[(index + offset) % pieces.length]
    if (piece.id === outgoingId) continue
    stack.push({ piece, depth: stack.length })
  }

  return (
    <div className={maxed ? 'deck deck--max' : 'deck'}>
      <div className="deck__stage">
        {stack
          .slice()
          .reverse()
          .map(({ piece, depth }) => (
            <PieceCard
              key={piece.id}
              piece={piece}
              depth={depth}
              cardRef={depth === 0 ? frontRef : undefined}
              onPointerDown={depth === 0 ? onPointerDown : undefined}
              onPointerMove={depth === 0 ? onPointerMove : undefined}
              onPointerUp={depth === 0 ? onPointerUp : undefined}
            />
          ))}
        {flight ? (
          <PieceCard
            key={`${flight.piece.id}-leave`}
            piece={flight.piece}
            leaving
            cardRef={leaveRef}
          />
        ) : null}
      </div>
      <p className="deck__count" aria-live="polite">
        {index + 1} of {pieces.length}
      </p>
      <p className="deck__hint">Slide the card.</p>
      {maxed ? (
        <div
          className="lightbox"
          ref={lightboxRef}
          role="dialog"
          aria-modal="true"
          aria-label={maxed.title}
          tabIndex={-1}
        >
          <button
            className="lightbox__scrim"
            type="button"
            aria-label="Close"
            onClick={closeMax}
          />
          <PieceCard
            piece={maxed}
            maximized
            cardRef={maxRef}
            onClick={(event) => {
              if (event.target.closest('a')) return
              closeMax()
            }}
          />
        </div>
      ) : null}
    </div>
  )
}

function Drop() {
  const [active, setActive] = useState('All')
  const shown = useMemo(
    () => (active === 'All' ? items : items.filter((p) => p.category === active)),
    [active],
  )

  return (
    <section className="drop" id="drop" aria-labelledby="drop-title">
      <div className="section-head drop__head">
        <h1 id="drop-title">In stock now !</h1>
        <p className="section-head__sub">
          Grab it before it's gone
        </p>
      </div>

      <div className="filters" role="group" aria-label="Filter by category">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className="filter"
            aria-pressed={active === category}
            onClick={() => setActive(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {shown.length > 0 ? (
        <Deck pieces={shown} key={active} />
      ) : (
        <div className="empty">
          <p className="empty__title">Nothing in {active.toLowerCase()} this drop.</p>
          <p className="empty__body">
            Pieces move between drops. Ask on TikTok if you are after something that is not here.
          </p>
          <a
            className="button"
            href={tiktokLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            TikTok
          </a>
        </div>
      )}
    </section>
  )
}

function Faq() {
  return (
    <section className="faq" id="faq" aria-labelledby="faq-title">
      <div className="section-head">
        <h1 id="faq-title">{faq.title}</h1>
        <p className="section-head__sub">{faq.lead}</p>
      </div>
      <dl className="faq-notes">
        {faq.items.map(([question, answer]) => (
          <div className="faq-note" key={question}>
            <dt>
              <span className="faq-note__who">You</span>
              {question}
            </dt>
            <dd>
              <span className="faq-note__who">Syaf</span>
              {answer}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function Contact() {
  return (
    <section className="contact" id="contact" aria-labelledby="contact-title">
      <div className="section-head">
        <h1 id="contact-title">Contact</h1>
        <p className="section-head__sub">{footer.ps}</p>
      </div>
      <div className="contact__letter">
        <dl className="contact__facts">
          {contact.facts.map(([label, detail]) => (
            <div className="contact__fact" key={label}>
              <dt>{label}</dt>
              <dd>{detail}</dd>
            </div>
          ))}
        </dl>
        <p className="close__sign">
          {footer.close}
          <br />
          <span className="close__name">— {brand.wordmark}</span>
        </p>
        <ul className="close__links">
          <li>
            <a
              className="link-action"
              href={tiktokLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              TikTok
            </a>
          </li>
        </ul>
      </div>
    </section>
  )
}

export default function App() {
  const path = useRoute()

  return (
    <div className="page" id="top">
      <Masthead />
      <main>
        {path === '/faq' ? <Faq /> : null}
        {path === '/contact' ? <Contact /> : null}
        {path === '/' ? <Drop /> : null}
      </main>
      <Dock path={path} />
    </div>
  )
}

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import {
  brand,
  faq,
  categories,
  footer,
  items,
} from './content'
import './App.css'

const tiktokLink = `https://www.tiktok.com/@${brand.tiktok}`

function Masthead() {
  return (
    <header className="mast">
      <p className="mast__line">{brand.mastLine}</p>
      <a className="mast__name" href="#top">
        {brand.wordmark}
      </a>
      <nav className="mast__nav" aria-label="Primary">
        <ul>
          <li>
            <a className="mast__link" href="#drop">
              Pre-loved
            </a>
          </li>
          <li>
            <a className="mast__link" href="#faq">
              FAQ
            </a>
          </li>
          <li>
            <a className="mast__link" href="#contact">
              Contact
            </a>
          </li>
        </ul>
      </nav>
      <hr className="mast__rule" aria-hidden="true" />
    </header>
  )
}

const EASE_OUT = 'cubic-bezier(0.16, 1, 0.3, 1)'
const SWIPE_PX = 80
const SWIPE_VELOCITY = 0.11

function money(value) {
  return value ?? '—'
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

  return (
    <article
      className={names.join(' ')}
      data-depth={leaving || maximized ? undefined : depth}
      ref={cardRef}
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
              <dt>Actual</dt>
              <dd>{money(piece.actualPrice)}</dd>
            </div>
            <div>
              <dt>Sell</dt>
              <dd>{money(piece.sellPrice)}</dd>
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
        step(dir)
        return
      }
      snap(el)
      return
    }
    busyRef.current = true
    const from = el.style.transform
    setFlight({ piece: pieces[index], dir, from })
    step(dir)
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
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={maxed.title}>
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
      <div className="section-head">
        <h1 id="drop-title">In stock now</h1>
        <p className="section-head__sub">
          Every piece is one of one. When it is gone, it is gone.
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
        <h2 id="faq-title">{faq.title}</h2>
        <p className="section-head__sub">{faq.lead}</p>
      </div>
      <dl className="faq-list">
        {faq.items.map(([question, answer]) => (
          <div className="faq-item" key={question}>
            <dt>{question}</dt>
            <dd>{answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function Footer() {
  return (
    <footer className="close" id="contact">
      <p className="close__sign">
        {footer.close}
        <br />
        <span className="close__name">— {brand.wordmark}</span>
      </p>
      <p className="close__ps">{footer.ps}</p>
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
    </footer>
  )
}

export default function App() {
  return (
    <div className="page" id="top">
      <Masthead />
      <main>
        <Drop />
        <Faq />
      </main>
      <Footer />
    </div>
  )
}

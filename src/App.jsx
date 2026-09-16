import { useMemo, useState } from 'react'
import {
  brand,
  buying,
  categories,
  drop,
  footer,
  items,
  order,
} from './content'
import './App.css'

const NUMBER_WORDS = [
  'No',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
  'Eleven',
  'Twelve',
]

const spell = (n) => NUMBER_WORDS[n] ?? String(n)

const enquiryLink = (piece) =>
  `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(
    `Hello — I would like to ask about the ${piece.item}${
      piece.house && piece.house !== '—' ? ` by ${piece.house}` : ''
    }.`,
  )}`

const orderLink = `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(
  'Hello — I would like you to buy a piece for me.',
)}`

const composeOrderMessage = ({ piece, size, budget, notes }) => {
  const lines = [
    'Hello — please buy this for me.',
    '',
    `Piece: ${piece}`,
    size ? `Size: ${size}` : null,
    budget ? `Ceiling: ${budget}` : null,
    notes ? `Notes: ${notes}` : null,
  ].filter(Boolean)
  return `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(lines.join('\n'))}`
}

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
              The&nbsp;drop
            </a>
          </li>
          <li>
            <a className="mast__link" href="#order">
              Order
            </a>
          </li>
          <li>
            <a className="mast__link" href="#how">
              How&nbsp;I&nbsp;buy
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

function InventoryHeader() {
  return (
    <section className="inventory" aria-labelledby="inventory-title">
      <div className="inventory__lede">
        <h1 id="inventory-title" className="inventory__title">
          {spell(items.length)} {drop.headline}
        </h1>
        <p className="inventory__lead">{drop.lead}</p>
      </div>
      <dl className="inventory__facts">
        {drop.facts.map(([term, value]) => (
          <div className="fact" key={term}>
            <dt>{term}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function Piece({ piece }) {
  return (
    <li className="piece">
      <figure className="piece__figure">
        {/* TODO: Replace with real photography, target size 320×400 or larger. */}
        <img
          className="piece__photo"
          src={piece.photo ?? '/placeholder-item.svg'}
          alt={`${piece.item}${piece.house !== '—' ? ` by ${piece.house}` : ''}`}
          width="320"
          height="400"
          loading="lazy"
        />
      </figure>
      <p className="piece__house">{piece.house}</p>
      <h3 className="piece__item">{piece.item}</h3>
      <dl className="piece__spec">
        <div>
          <dt>Size</dt>
          <dd>{piece.size}</dd>
        </div>
        <div>
          <dt>Condition</dt>
          <dd>{piece.condition}</dd>
        </div>
      </dl>
      <p className="piece__note">{piece.note}</p>
      <div className="piece__foot">
        <span className="piece__price">{piece.price ?? 'Ask'}</span>
        <a
          className="link-action"
          href={enquiryLink(piece)}
          target="_blank"
          rel="noopener noreferrer"
        >
          Enquire
        </a>
      </div>
    </li>
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
        <h2 id="drop-title">In stock now</h2>
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
        <ul className="grid" key={active}>
          {shown.map((piece) => (
            <Piece piece={piece} key={piece.id} />
          ))}
        </ul>
      ) : (
        <div className="empty">
          <p className="empty__title">Nothing in {active.toLowerCase()} this drop.</p>
          <p className="empty__body">
            Pieces move between drops. Tell me what you are after and I will buy it for you.
          </p>
          <a className="button" href="#order">
            Place an order
          </a>
        </div>
      )}
    </section>
  )
}

function Field({ id, label, helper, error, children, invalid }) {
  const hintId = `${id}-hint`
  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      {children}
      <p
        className={invalid ? 'field__hint field__hint--error' : 'field__hint'}
        id={hintId}
      >
        {invalid ? error : helper}
      </p>
    </div>
  )
}

function OrderForm() {
  const [values, setValues] = useState({
    piece: '',
    size: '',
    budget: '',
    notes: '',
  })
  const [touched, setTouched] = useState({})
  const [status, setStatus] = useState('idle')

  const pieceInvalid = touched.piece && !values.piece.trim()
  const { piece: pieceField, size, budget, notes } = order.fields

  const set = (key) => (event) => {
    setValues((current) => ({ ...current, [key]: event.target.value }))
    if (status === 'success' || status === 'error') setStatus('idle')
  }

  const blur = (key) => () => {
    setTouched((current) => ({ ...current, [key]: true }))
  }

  const onSubmit = (event) => {
    event.preventDefault()
    setTouched({ piece: true, size: true, budget: true, notes: true })
    if (!values.piece.trim()) {
      setStatus('error')
      return
    }
    setStatus('loading')
    window.setTimeout(() => {
      window.open(composeOrderMessage(values), '_blank', 'noopener,noreferrer')
      setStatus('success')
    }, 220)
  }

  const submitLabel =
    status === 'loading'
      ? order.ctaLoading
      : status === 'success'
        ? order.ctaSuccess
        : order.cta

  return (
    <form className="order-form" onSubmit={onSubmit} noValidate>
      <Field
        id="order-piece"
        label={pieceField.label}
        helper={pieceField.helper}
        error={pieceField.error}
        invalid={pieceInvalid}
      >
        <input
          className="input"
          id="order-piece"
          name="piece"
          type="text"
          value={values.piece}
          onChange={set('piece')}
          onBlur={blur('piece')}
          placeholder={pieceField.placeholder}
          aria-required="true"
          aria-invalid={pieceInvalid}
          aria-describedby="order-piece-hint"
          autoComplete="off"
        />
      </Field>
      <div className="order-form__pair">
        <Field id="order-size" label={size.label} helper={size.helper}>
          <input
            className="input"
            id="order-size"
            name="size"
            type="text"
            value={values.size}
            onChange={set('size')}
            onBlur={blur('size')}
            placeholder={size.placeholder}
            aria-describedby="order-size-hint"
            autoComplete="off"
          />
        </Field>
        <Field id="order-budget" label={budget.label} helper={budget.helper}>
          <input
            className="input"
            id="order-budget"
            name="budget"
            type="text"
            value={values.budget}
            onChange={set('budget')}
            onBlur={blur('budget')}
            placeholder={budget.placeholder}
            aria-describedby="order-budget-hint"
            autoComplete="off"
          />
        </Field>
      </div>
      <Field id="order-notes" label={notes.label} helper={notes.helper}>
        <textarea
          className="input input--area"
          id="order-notes"
          name="notes"
          rows={3}
          value={values.notes}
          onChange={set('notes')}
          onBlur={blur('notes')}
          placeholder={notes.placeholder}
          aria-describedby="order-notes-hint"
        />
      </Field>
      <div className="order-form__actions">
        <button
          className="button"
          type="submit"
          data-state={status}
          aria-disabled={status === 'loading'}
          disabled={status === 'loading'}
        >
          {submitLabel}
        </button>
        <p
          className={
            status === 'error'
              ? 'order-form__status order-form__status--error'
              : 'order-form__status'
          }
          role="status"
        >
          {status === 'error'
            ? pieceField.error
            : status === 'success'
              ? 'WhatsApp should open with this order. I will not buy until you confirm the photographs.'
              : 'Opens WhatsApp with this request. I buy only after you approve.'}
        </p>
      </div>
    </form>
  )
}

function Order() {
  return (
    <section className="order" id="order" aria-labelledby="order-title">
      <div className="order__copy">
        <div className="section-head">
          <h2 id="order-title">{order.title}</h2>
          <p className="section-head__sub">{order.lead}</p>
        </div>
      </div>
      <OrderForm />
    </section>
  )
}

function HowIBuy() {
  return (
    <section className="buying" id="how" aria-labelledby="buying-title">
      <div className="section-head">
        <h2 id="buying-title">{buying.title}</h2>
        <p className="section-head__sub">{buying.lead}</p>
      </div>
      <dl className="terms">
        {buying.terms.map(([term, meaning]) => (
          <div className="term" key={term}>
            <dt>{term}</dt>
            <dd>{meaning}</dd>
          </div>
        ))}
      </dl>
      <p className="buying__close">{buying.closing}</p>
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
            href={orderLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </a>
        </li>
        <li>
          <a
            className="link-action"
            href={`https://instagram.com/${brand.instagram}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
        </li>
        <li>
          <a className="link-action" href={`mailto:${brand.email}`}>
            Email
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
        <InventoryHeader />
        <Drop />
        <Order />
        <HowIBuy />
      </main>
      <Footer />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// EVERY piece of real content lives here. Replace the slot values marked TODO.
// Nothing in this file is a fabricated statistic, review, or client claim —
// where a real number belongs, the slot reads "—" until you fill it in.
// ─────────────────────────────────────────────────────────────────────────────

export const brand = {
  // TODO: Replace with the trading name you want on the masthead.
  wordmark: 'Syaf',
  // TODO: Replace with drop number, month, and where you trade from.
  mastLine: 'Welcome to my shop',
  // TODO: Replace with your WhatsApp number in full international form, digits only.
  whatsapp: '60000000000',
  // TODO: Replace with your Instagram handle, without the @.
  instagram: 'your-handle',
  // TODO: Replace with the email you actually read.
  email: 'hello@example.com',
}

export const drop = {
  headline: 'pieces, this drop.',
  lead:
    'Bought in person, checked against the maker’s own marks, and photographed as they are wear included.',
  // TODO: Confirm or replace each of these. Use "—" for anything not yet settled.
  facts: [
    ['Opens', '10am'],
    ['Ships', 'Peninsula Malaysia only'],
    ['Payment', 'QR payment, bank transfer, or digital wallet'],
  ],
}

export const categories = ['All', 'Bags', 'Shoes', 'Ready-to-wear', 'Accessories']

// TODO: Replace this whole array with the real drop. One object per piece.
// `house` = maker, `price` = a string you control ("RM 1,280", "Ask"), or null.
// `photo` = a path under /public once you have real photography.
export const items = [
  {
    id: 'p1',
    house: '—',
    item: 'Structured tote, grained leather',
    category: 'Bags',
    size: 'One size',
    condition: 'Very good',
    price: null,
    note: 'Photo, price, and measurements to add',
    photo: null,
  },
  {
    id: 'p2',
    house: '—',
    item: 'Quilted shoulder bag, lambskin',
    category: 'Bags',
    size: 'Medium',
    condition: 'Excellent',
    price: null,
    note: 'Photo, price, and measurements to add',
    photo: null,
  },
  {
    id: 'p3',
    house: '—',
    item: 'Slingback pump, patent',
    category: 'Shoes',
    size: 'EU 38',
    condition: 'Good',
    price: null,
    note: 'Photo, price, and sole condition to add',
    photo: null,
  },
  {
    id: 'p4',
    house: '—',
    item: 'Wool coat, double-faced',
    category: 'Ready-to-wear',
    size: 'FR 36',
    condition: 'Very good',
    price: null,
    note: 'Photo, price, and shoulder measurement to add',
    photo: null,
  },
  {
    id: 'p5',
    house: '—',
    item: 'Silk twill scarf, 90 cm',
    category: 'Accessories',
    size: '90 × 90 cm',
    condition: 'New with tags',
    price: null,
    note: 'Photo and price to add',
    photo: null,
  },
  {
    id: 'p6',
    house: '—',
    item: 'Leather loafer, hand-stitched',
    category: 'Shoes',
    size: 'EU 40',
    condition: 'Very good',
    price: null,
    note: 'Photo, price, and sole condition to add',
    photo: null,
  },
  {
    id: 'p7',
    house: '—',
    item: 'Knit cardigan, cashmere',
    category: 'Ready-to-wear',
    size: 'S',
    condition: 'Good',
    price: null,
    note: 'Photo, price, and pilling notes to add',
    photo: null,
  },
  {
    id: 'p8',
    house: '—',
    item: 'Card holder, box calf',
    category: 'Accessories',
    size: 'One size',
    condition: 'Excellent',
    price: null,
    note: 'Photo and price to add',
    photo: null,
  },
]

export const order = {
  title: 'Ask me to buy it',
  lead:
    'You name the piece. I find it, photograph it, and buy it for you — nothing leaves the counter until you say yes.',
  cta: 'Send this order',
  ctaLoading: 'Opening WhatsApp',
  ctaSuccess: 'Order ready in WhatsApp',
  fields: {
    piece: {
      label: 'The piece',
      helper: 'Maker, model, colour. A screenshot in the chat after is enough.',
      placeholder: 'e.g. quilted flap bag, black lambskin',
      error: 'Name the piece you want bought. Maker and model if you have them.',
    },
    size: {
      label: 'Size',
      helper: 'Leave blank if it does not apply.',
      placeholder: 'EU 38, FR 36, or one size',
    },
    budget: {
      label: 'Ceiling',
      helper: 'The most you will pay, including my fee once it is set.',
      placeholder: 'RM —',
    },
    notes: {
      label: 'Notes',
      helper: 'Deadline, colour, where you last saw it.',
      placeholder: 'Anything that helps me recognise the right one',
    },
  },
}

export const buying = {
  title: 'How I buy for you',
  lead:
    'I am the one at the counter. You approve the photographs and the total before any money moves.',
  terms: [
    [
      'What you send',
      'Maker, model, size, and a ceiling. A screenshot from the house or a listing is enough to start.',
    ],
    [
      'Before I buy',
      'I send you photographs and the full cost. I do not buy on your behalf until you reply yes.',
    ],
    [
      'After you say yes',
      'I pay, collect, and arrange handover. Payment from you is due before the piece leaves me.',
    ],
    [
      'If I cannot find it',
      'I tell you so. No fee. You can keep the order open or close it.',
    ],
  ],
  // TODO: Replace with the real fee, regions, and turnaround.
  closing: 'Fee — — · Regions I source from — — · Typical turnaround — —',
}

export const footer = {
  close: 'Yours,',
  ps: 'Letters, questions, and photographs of things you are hunting for are all welcome.',
}

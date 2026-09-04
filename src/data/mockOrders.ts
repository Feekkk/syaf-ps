export type OrderStatus = 'new' | 'preparing' | 'on_delivery' | 'delivered' | 'cancelled';

export type OrderItem = {
  name: string;
  qty: number;
  notes?: string;
  price: number;
};

export type ShopperOrder = {
  id: string;
  clientName: string;
  telegramHandle: string;
  telegramChatId: string;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  currency: string;
  receivedAt: string;
  lastMessage: string;
  notes?: string;
};

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  new: 'New order',
  preparing: 'Preparing',
  on_delivery: 'On delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export const mockOrders: ShopperOrder[] = [
  {
    id: 'SS-1042',
    clientName: 'Aisyah Rahman',
    telegramHandle: '@aisyah.r',
    telegramChatId: '88219301',
    items: [
      { name: 'The Ordinary Niacinamide 10%', qty: 2, price: 68 },
      { name: 'Rhode Peptide Lip Tint — Espresso', qty: 1, price: 95 },
    ],
    status: 'new',
    total: 163,
    currency: 'MYR',
    receivedAt: '2026-09-03T11:20:00+08:00',
    lastMessage: 'Kak, boleh tolong beli niacinamide + rhode lip tint?',
  },
  {
    id: 'SS-1041',
    clientName: 'Nurul Iman',
    telegramHandle: '@n.iman',
    telegramChatId: '77123098',
    items: [
      { name: 'COSRx Snail Mucin 96', qty: 1, price: 89 },
      { name: 'Beauty of Joseon Relief Sun', qty: 2, price: 84 },
    ],
    status: 'new',
    total: 173,
    currency: 'MYR',
    receivedAt: '2026-09-02T16:05:00+08:00',
    lastMessage: 'Quote ok. I transfer tonight ya.',
    notes: 'Waiting for Touch n Go screenshot.',
  },
  {
    id: 'SS-1038',
    clientName: 'Sarah Lim',
    telegramHandle: '@sarahlim',
    telegramChatId: '65012944',
    items: [
      { name: 'Skims Fits Everybody T-shirt — Sand', qty: 1, notes: 'Size S', price: 210 },
    ],
    status: 'preparing',
    total: 210,
    currency: 'MYR',
    receivedAt: '2026-09-01T09:40:00+08:00',
    lastMessage: 'Size S sand please, if restock take it.',
  },
  {
    id: 'SS-1033',
    clientName: 'Farah Aziz',
    telegramHandle: '@farahaziz',
    telegramChatId: '44109823',
    items: [
      { name: 'Dior Lip Glow — 001 Pink', qty: 1, price: 175 },
      { name: 'Chanel Chance Eau Tendre travel spray', qty: 1, price: 160 },
    ],
    status: 'on_delivery',
    total: 335,
    currency: 'MYR',
    receivedAt: '2026-08-28T13:12:00+08:00',
    lastMessage: 'Tracking received, thank you kak!',
  },
  {
    id: 'SS-1029',
    clientName: 'Megan Tan',
    telegramHandle: '@megantan',
    telegramChatId: '33982110',
    items: [
      { name: 'Apple Watch sport band — Starlight', qty: 1, notes: '41mm', price: 149 },
    ],
    status: 'preparing',
    total: 149,
    currency: 'MYR',
    receivedAt: '2026-08-27T19:48:00+08:00',
    lastMessage: 'Can you check if Starlight is still available?',
  },
  {
    id: 'SS-1024',
    clientName: 'Aisyah Rahman',
    telegramHandle: '@aisyah.r',
    telegramChatId: '88219301',
    items: [
      { name: 'Uniqlo Airism oversized tee', qty: 3, notes: 'White M', price: 177 },
    ],
    status: 'delivered',
    total: 177,
    currency: 'MYR',
    receivedAt: '2026-08-20T10:15:00+08:00',
    lastMessage: 'Received already, love it!',
  },
  {
    id: 'SS-1018',
    clientName: 'Hana Yusuf',
    telegramHandle: '@hanayusuf',
    telegramChatId: '22819076',
    items: [
      { name: 'Jacquemus Le Chiquito mini', qty: 1, price: 2890 },
    ],
    status: 'cancelled',
    total: 2890,
    currency: 'MYR',
    receivedAt: '2026-08-18T21:02:00+08:00',
    lastMessage: 'Cancel ya kak, over budget.',
  },
];

export const formatMoney = (amount: number, currency = 'MYR') =>
  new Intl.NumberFormat('en-MY', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);

export const getOrderById = (id: string) => mockOrders.find((order) => order.id === id);

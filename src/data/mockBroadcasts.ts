import { formatMoney } from '@/data/mockOrders';

export type BroadcastPost = {
  id: string;
  title: string;
  details: string;
  imageUrl: string;
  price: number;
  quantity: number;
  remaining: number;
  postedAt: string;
};

export const mockBroadcasts: BroadcastPost[] = [
  {
    id: 'CH-204',
    title: 'Rhode Peptide Lip Tint — Espresso',
    details: 'Restock drop for the channel. Shade Espresso, limited slots this round.',
    imageUrl: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&q=80',
    price: 95,
    quantity: 12,
    remaining: 4,
    postedAt: '2026-09-03T10:15:00+08:00',
  },
  {
    id: 'CH-203',
    title: 'Beauty of Joseon Relief Sun',
    details: 'SPF50+ rice + probiotics. Good for daily wear, no white cast.',
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80',
    price: 42,
    quantity: 20,
    remaining: 7,
    postedAt: '2026-09-01T14:40:00+08:00',
  },
  {
    id: 'CH-202',
    title: 'COSRx Snail Mucin 96',
    details: 'Essence restock. Comment in the group to grab.',
    imageUrl: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&q=80',
    price: 89,
    quantity: 10,
    remaining: 2,
    postedAt: '2026-08-29T19:05:00+08:00',
  },
  {
    id: 'CH-201',
    title: 'Dior Lip Glow — 001 Pink',
    details: 'Original batch, ready to ship this week.',
    imageUrl: 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=800&q=80',
    price: 175,
    quantity: 6,
    remaining: 0,
    postedAt: '2026-08-26T11:22:00+08:00',
  },
];

export const getTotalStockLeft = (posts: BroadcastPost[]) =>
  posts.reduce((sum, post) => sum + post.remaining, 0);

export const formatBroadcastPrice = (price: number) => formatMoney(price);

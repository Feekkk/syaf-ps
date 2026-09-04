import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { formatMoney, mockOrders, ORDER_STATUS_LABEL, type OrderStatus } from '@/data/mockOrders';
import OrderStatusBadge from '@/components/orders/OrderStatusBadge';
import { format } from 'date-fns';
import { Search } from 'lucide-react';

const filters: Array<{ label: string; value: 'all' | OrderStatus }> = [
  { label: 'All', value: 'all' },
  { label: 'New order', value: 'new' },
  { label: 'Preparing', value: 'preparing' },
  { label: 'On delivery', value: 'on_delivery' },
  { label: 'Delivered', value: 'delivered' },
];

const OrdersList = () => {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<(typeof filters)[number]['value']>('all');

  const orders = useMemo(() => {
    return mockOrders.filter((order) => {
      const matchesStatus = status === 'all' || order.status === status;
      const haystack = `${order.clientName} ${order.telegramHandle} ${order.id} ${order.lastMessage}`.toLowerCase();
      return matchesStatus && haystack.includes(query.toLowerCase());
    });
  }, [query, status]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-4xl text-foreground">Orders</h1>
        <p className="mt-2 text-muted-foreground">Every request that came in through Telegram.</p>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search client, handle, or order ID"
            className="h-11 rounded-xl bg-card pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatus(filter.value)}
              className={`rounded-full px-3 py-1.5 text-sm transition ${
                status === filter.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card text-muted-foreground hover:bg-accent'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-card">
        <div className="hidden grid-cols-[140px_1fr_160px_120px_140px] gap-4 border-b px-5 py-3 text-xs uppercase tracking-wide text-muted-foreground md:grid">
          <span>Order</span>
          <span>Client</span>
          <span>Status</span>
          <span>Total</span>
          <span>Received</span>
        </div>
        {orders.map((order) => (
          <Link
            key={order.id}
            to={`/orders/${order.id}`}
            className="grid gap-2 border-b px-5 py-4 last:border-b-0 transition hover:bg-accent/40 md:grid-cols-[140px_1fr_160px_120px_140px] md:items-center md:gap-4"
          >
            <div>
              <p className="font-medium">{order.id}</p>
              <p className="text-xs text-muted-foreground md:hidden">{ORDER_STATUS_LABEL[order.status]}</p>
            </div>
            <div>
              <p className="font-medium">{order.clientName}</p>
              <p className="text-sm text-muted-foreground">{order.telegramHandle}</p>
              <p className="mt-1 line-clamp-1 text-sm text-muted-foreground md:hidden">“{order.lastMessage}”</p>
            </div>
            <div className="hidden md:block">
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="text-sm">{formatMoney(order.total, order.currency)}</p>
            <p className="text-sm text-muted-foreground">{format(new Date(order.receivedAt), 'd MMM, h:mm a')}</p>
          </Link>
        ))}
        {orders.length === 0 && (
          <p className="px-5 py-12 text-center text-sm text-muted-foreground">No orders match this filter.</p>
        )}
      </div>
    </div>
  );
};

export default OrdersList;

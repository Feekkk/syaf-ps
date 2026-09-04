import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { formatMoney, mockOrders, mockStockLeft, type OrderStatus } from '@/data/mockOrders';
import OrderStatusBadge from '@/components/orders/OrderStatusBadge';
import { formatDistanceToNow } from 'date-fns';
import { Boxes, Clock3, Package, Truck } from 'lucide-react';

const countBy = (status: OrderStatus) => mockOrders.filter((order) => order.status === status).length;

const latestOrders = [...mockOrders]
  .sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime())
  .slice(0, 5);

const metrics = [
  {
    label: 'New Order',
    value: countBy('new'),
    hint: 'Just in from Telegram',
    icon: Clock3,
  },
  {
    label: 'Stock Left',
    value: mockStockLeft,
    hint: 'Units on hand',
    icon: Boxes,
  },
  {
    label: 'Preparing',
    value: countBy('preparing'),
    hint: 'Packing for clients',
    icon: Package,
  },
  {
    label: 'On Delivery',
    value: countBy('on_delivery'),
    hint: 'Out to clients',
    icon: Truck,
  },
];

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm tracking-[0.18em] text-primary uppercase">Syaf Personal Shopper</p>
        <h1 className="mt-1 font-serif text-4xl text-foreground">Order overview</h1>
        <p className="mt-2 text-muted-foreground">
          Track requests that come in from Telegram, from first message to delivery.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="rounded-2xl border-border/80 shadow-none">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <p className="text-sm text-muted-foreground">{metric.label}</p>
                <metric.icon className="h-4 w-4 text-primary" />
              </div>
              <p className="mt-3 font-serif text-4xl text-foreground">{metric.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{metric.hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-2xl border-border/80 shadow-none">
          <CardContent className="p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-serif text-2xl">Latest order</h2>
              <Link to="/orders" className="text-sm text-primary hover:underline">
                View all orders
              </Link>
            </div>
            <div className="space-y-3">
              {latestOrders.map((order) => (
                <Link
                  key={order.id}
                  to={`/orders/${order.id}`}
                  className="block rounded-xl border bg-background/70 p-4 transition hover:border-primary/30 hover:bg-accent/50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{order.clientName}</p>
                      <p className="text-xs text-muted-foreground">{order.telegramHandle}</p>
                    </div>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{order.id}</span>
                    <span>{formatMoney(order.total, order.currency)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/80 shadow-none">
          <CardContent className="p-6">
            <h2 className="mb-5 font-serif text-2xl">Latest telegram message</h2>
            <div className="space-y-4">
              {latestOrders.map((order) => (
                <Link key={order.id} to={`/orders/${order.id}`} className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-medium text-primary">
                    {order.clientName.split(' ').map((part) => part[0]).join('').slice(0, 2)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-medium">{order.telegramHandle}</p>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(order.receivedAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="mt-1 rounded-2xl rounded-tl-sm bg-background px-3 py-2 text-sm leading-relaxed text-foreground">
                      {order.lastMessage}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

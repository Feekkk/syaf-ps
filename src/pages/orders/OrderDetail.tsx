import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatMoney, getOrderById, ORDER_STATUS_LABEL } from '@/data/mockOrders';
import OrderStatusBadge from '@/components/orders/OrderStatusBadge';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';

const timeline: Record<string, string[]> = {
  new: ['Message received on Telegram', 'Waiting to start'],
  preparing: ['Order confirmed', 'Items being packed'],
  on_delivery: ['Packed', 'On the way to client'],
  delivered: ['Packed', 'Delivered to client'],
  cancelled: ['Request cancelled'],
};

const OrderDetail = () => {
  const { id } = useParams();
  const order = id ? getOrderById(id) : undefined;

  if (!order) {
    return (
      <div className="space-y-4">
        <h1 className="font-serif text-3xl">Order not found</h1>
        <Link to="/orders" className="text-primary hover:underline">
          Back to orders
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link to="/orders" className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Orders
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-serif text-4xl">{order.id}</h1>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="mt-2 text-muted-foreground">
            Received {format(new Date(order.receivedAt), 'd MMMM yyyy, h:mm a')} from Telegram
          </p>
        </div>
        <Button variant="outline" className="rounded-xl" asChild>
          <a href={`https://t.me/${order.telegramHandle.replace('@', '')}`} target="_blank" rel="noreferrer">
            Open Telegram chat
          </a>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="rounded-2xl shadow-none">
          <CardContent className="p-6">
            <h2 className="font-serif text-2xl">Items</h2>
            <div className="mt-4 divide-y">
              {order.items.map((item) => (
                <div key={item.name} className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">Qty {item.qty}{item.notes ? ` · ${item.notes}` : ''}</p>
                  </div>
                  <p>{formatMoney(item.price, order.currency)}</p>
                </div>
              ))}
            </div>
            <div className="mt-2 flex items-center justify-between border-t pt-4">
              <span className="text-muted-foreground">Total</span>
              <span className="font-serif text-2xl">{formatMoney(order.total, order.currency)}</span>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-2xl shadow-none">
            <CardContent className="p-6">
              <h2 className="font-serif text-2xl">Client</h2>
              <p className="mt-3 font-medium">{order.clientName}</p>
              <p className="text-sm text-muted-foreground">{order.telegramHandle}</p>
              <p className="mt-4 rounded-xl bg-background p-3 text-sm leading-relaxed">“{order.lastMessage}”</p>
              {order.notes && <p className="mt-3 text-sm text-muted-foreground">{order.notes}</p>}
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-none">
            <CardContent className="p-6">
              <h2 className="font-serif text-2xl">Progress</h2>
              <p className="mt-1 text-sm text-muted-foreground">{ORDER_STATUS_LABEL[order.status]}</p>
              <ol className="mt-4 space-y-3">
                {(timeline[order.status] || []).map((step) => (
                  <li key={step} className="flex gap-3 text-sm">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    {step}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;

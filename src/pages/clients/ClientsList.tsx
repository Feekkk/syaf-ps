import { Link } from 'react-router-dom';
import { formatMoney, getClients, mockOrders } from '@/data/mockOrders';

const ClientsList = () => {
  const clients = getClients();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-4xl text-foreground">Clients</h1>
        <p className="mt-2 text-muted-foreground">People who place orders with you on Telegram.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {clients.map((client) => {
          const latest = mockOrders.find((order) => order.telegramHandle === client.handle);
          return (
            <div key={client.handle} className="rounded-2xl border bg-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-lg">{client.name}</p>
                  <p className="text-sm text-muted-foreground">{client.handle}</p>
                </div>
                <span className="rounded-full bg-secondary px-2.5 py-1 text-xs">
                  {client.orders} {client.orders === 1 ? 'order' : 'orders'}
                </span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">Lifetime spend</p>
              <p className="font-serif text-3xl">{formatMoney(client.spent)}</p>
              {latest && (
                <Link
                  to={`/orders/${latest.id}`}
                  className="mt-4 inline-block text-sm text-primary hover:underline"
                >
                  Latest: {latest.id}
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ClientsList;

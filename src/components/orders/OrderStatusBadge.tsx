import { Badge } from '@/components/ui/badge';
import { ORDER_STATUS_LABEL, type OrderStatus } from '@/data/mockOrders';
import { cn } from '@/lib/utils';

const styles: Record<OrderStatus, string> = {
  new: 'border-transparent bg-primary/15 text-primary hover:bg-primary/15',
  preparing: 'border-transparent bg-[#E8D9C8] text-[#6B5344] hover:bg-[#E8D9C8]',
  on_delivery: 'border-transparent bg-[#E4D7E8] text-[#6A4A72] hover:bg-[#E4D7E8]',
  delivered: 'border-transparent bg-[#D8E5D3] text-[#3F5A3A] hover:bg-[#D8E5D3]',
  cancelled: 'border-transparent bg-muted text-muted-foreground hover:bg-muted',
};

const OrderStatusBadge = ({ status, className }: { status: OrderStatus; className?: string }) => (
  <Badge className={cn('font-medium', styles[status], className)}>{ORDER_STATUS_LABEL[status]}</Badge>
);

export default OrderStatusBadge;

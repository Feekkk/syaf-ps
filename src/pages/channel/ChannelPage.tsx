import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { formatBroadcastPrice, getTotalStockLeft, mockBroadcasts, type BroadcastPost } from '@/data/mockBroadcasts';
import { format } from 'date-fns';
import { ImagePlus, Send } from 'lucide-react';
import { toast } from 'sonner';

const emptyForm = {
  title: '',
  details: '',
  price: '',
  quantity: '',
};

const ChannelPage = () => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [posts, setPosts] = useState(mockBroadcasts);
  const [form, setForm] = useState(emptyForm);
  const [imageUrl, setImageUrl] = useState('');
  const [imageName, setImageName] = useState('');

  useEffect(() => {
    return () => {
      if (imageUrl.startsWith('blob:')) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  const stockLeft = useMemo(() => getTotalStockLeft(posts), [posts]);

  const handleImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (imageUrl.startsWith('blob:')) URL.revokeObjectURL(imageUrl);
    setImageUrl(URL.createObjectURL(file));
    setImageName(file.name);
  };

  const handlePost = (event: React.FormEvent) => {
    event.preventDefault();
    const quantity = Number(form.quantity);
    const price = Number(form.price);
    if (!form.title.trim() || !form.details.trim() || !imageUrl || !price || !quantity) {
      toast.error('Fill in title, details, image, price, and quantity.');
      return;
    }

    const post: BroadcastPost = {
      id: `CH-${200 + posts.length + 1}`,
      title: form.title.trim(),
      details: form.details.trim(),
      imageUrl,
      price,
      quantity,
      remaining: quantity,
      postedAt: new Date().toISOString(),
    };

    setPosts((current) => [post, ...current]);
    setForm(emptyForm);
    setImageUrl('');
    setImageName('');
    if (fileRef.current) fileRef.current.value = '';
    toast.success('Posted to the Telegram channel.');
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm tracking-[0.18em] text-primary uppercase">Telegram channel</p>
        <h1 className="mt-1 font-serif text-4xl text-foreground">Broadcast</h1>
        <p className="mt-2 text-muted-foreground">
          Post a drop to the group, then watch remaining quantity from older messages.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <form onSubmit={handlePost} className="rounded-2xl border bg-card p-6">
          <h2 className="font-serif text-2xl">New channel message</h2>
          <p className="mt-1 text-sm text-muted-foreground">@syafpersonalshopper</p>

          <div className="mt-5 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                placeholder="Item name"
                className="rounded-xl bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="details">Details</Label>
              <Textarea
                id="details"
                value={form.details}
                onChange={(event) => setForm((current) => ({ ...current, details: event.target.value }))}
                placeholder="Size, shade, how to claim in the group"
                className="rounded-xl bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label>Image</Label>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex w-full flex-col items-center justify-center rounded-xl border border-dashed bg-background px-4 py-8 text-sm text-muted-foreground transition hover:border-primary/40 hover:bg-accent/40"
              >
                {imageUrl ? (
                  <img src={imageUrl} alt="Preview" className="h-40 w-full rounded-lg object-cover" />
                ) : (
                  <>
                    <ImagePlus className="mb-2 h-5 w-5" />
                    Add a product photo
                  </>
                )}
                {imageName && <span className="mt-2 text-xs">{imageName}</span>}
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="price">Price (MYR)</Label>
                <Input
                  id="price"
                  type="number"
                  min="1"
                  value={form.price}
                  onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
                  placeholder="0"
                  className="rounded-xl bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={form.quantity}
                  onChange={(event) => setForm((current) => ({ ...current, quantity: event.target.value }))}
                  placeholder="0"
                  className="rounded-xl bg-background"
                />
              </div>
            </div>

            <Button type="submit" className="h-11 w-full rounded-xl">
              <Send className="h-4 w-4" />
              Post to channel
            </Button>
          </div>
        </form>

        <section className="rounded-2xl border bg-card p-6">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="font-serif text-2xl">Items left</h2>
              <p className="mt-1 text-sm text-muted-foreground">Quantity still available from channel posts</p>
            </div>
            <p className="font-serif text-4xl text-primary">{stockLeft}</p>
          </div>

          <div className="mt-5 space-y-3">
            {posts.map((post) => {
              const sold = post.quantity - post.remaining;
              const leftPct = Math.round((post.remaining / post.quantity) * 100);
              return (
                <div key={post.id} className="rounded-xl border bg-background p-3">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-medium leading-snug">{post.title}</p>
                    <span className="shrink-0 text-sm">{post.remaining}/{post.quantity}</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${leftPct}%` }} />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {sold} claimed · {formatBroadcastPrice(post.price)}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <section>
        <h2 className="font-serif text-2xl">Older messages</h2>
        <p className="mt-1 text-sm text-muted-foreground">Posts already sent to the Telegram group</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {posts.map((post) => (
            <article key={post.id} className="overflow-hidden rounded-2xl border bg-card">
              <img src={post.imageUrl} alt="" className="h-40 w-full object-cover" />
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-medium leading-snug">{post.title}</h3>
                  <span className="shrink-0 rounded-full bg-secondary px-2.5 py-1 text-xs">
                    {post.remaining} left
                  </span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{post.details}</p>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span>{formatBroadcastPrice(post.price)}</span>
                  <span className="text-muted-foreground">
                    {format(new Date(post.postedAt), 'd MMM, h:mm a')}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ChannelPage;

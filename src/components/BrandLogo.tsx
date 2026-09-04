import { cn } from '@/lib/utils';

const sizes = {
  sm: 'h-10 w-10',
  md: 'h-20 w-20',
  lg: 'h-36 w-36',
  hero: 'h-44 w-44 sm:h-52 sm:w-52',
} as const;

type BrandLogoProps = {
  size?: keyof typeof sizes;
  className?: string;
};

const BrandLogo = ({ size = 'md', className }: BrandLogoProps) => (
  <img
    src="/logo.png"
    alt="Syaf Personal Shopper"
    width={2000}
    height={2000}
    className={cn('object-contain', sizes[size], className)}
  />
);

export default BrandLogo;

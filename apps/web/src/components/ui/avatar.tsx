import { cn, getInitials, getAvatarUrl } from '@/lib/utils';
import Image from 'next/image';

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-base',
  };

  const imageSizes = { sm: 32, md: 40, lg: 56 };

  if (src) {
    return (
      <Image
        src={getAvatarUrl(src)}
        alt={name}
        width={imageSizes[size]}
        height={imageSizes[size]}
        className={cn('rounded-full object-cover', sizes[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-primary/10 text-primary font-semibold',
        sizes[size],
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
}

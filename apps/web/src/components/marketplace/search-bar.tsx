'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input, Button } from '@/components/ui';

interface SearchBarProps {
  defaultValue?: string;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  defaultValue = '',
  placeholder = 'Search products, suppliers...',
  className,
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className={`flex gap-2 ${className ?? ''}`}>
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        icon={<Search className="h-4 w-4" />}
        className="flex-1"
      />
      <Button type="submit">Search</Button>
    </form>
  );
}

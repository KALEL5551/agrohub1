'use client';

import { cn } from '@/lib/utils';
import { AGRICULTURE_SUBCATEGORIES, AGRO_SECTORS } from '@/lib/constants';

interface CategoryFilterProps {
  sector?: string;
  activeSubcategory: string | null;
  onSubcategoryChange: (subcategory: string | null) => void;
  // legacy compat
  category?: string;
}

export function CategoryFilter({
  sector,
  activeSubcategory,
  onSubcategoryChange,
}: CategoryFilterProps) {
  const subcategories = sector && sector !== 'all'
    ? AGRICULTURE_SUBCATEGORIES.filter(s => s.sector === sector)
    : AGRICULTURE_SUBCATEGORIES;

  return (
    <div className="space-y-3">
      {/* Sector pills (when showing all) */}
      {(!sector || sector === 'all') && (
        <div className="flex flex-wrap gap-2 mb-2">
          {AGRO_SECTORS.map(s => (
            <a
              key={s.value}
              href={`/sector/${s.value}`}
              className="px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
            >
              {s.icon} {s.label}
            </a>
          ))}
        </div>
      )}

      {/* Subcategory pills */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onSubcategoryChange(null)}
          className={cn(
            'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
            !activeSubcategory
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          )}
        >
          All
        </button>
        {subcategories.map(sub => (
          <button
            key={sub.value}
            type="button"
            onClick={() => onSubcategoryChange(sub.value)}
            className={cn(
              'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
              activeSubcategory === sub.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            {sub.icon} {sub.label}
          </button>
        ))}
      </div>
    </div>
  );
}

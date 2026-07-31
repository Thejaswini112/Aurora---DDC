import { forwardRef } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onSearch?: (value: string) => void;
  containerClassName?: string;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, containerClassName, onSearch, defaultValue, value, ...props }, ref) => {
    return (
      <div className={cn('relative', containerClassName)}>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          ref={ref}
          onChange={(e) => onSearch?.(e.target.value)}
          defaultValue={defaultValue}
          value={value}
          className={cn(
            'h-9 w-full rounded-lg border border-input bg-card pl-9 pr-9 text-sm text-foreground shadow-sm transition-colors',
            'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0',
            className,
          )}
          {...props}
        />
        {(value || defaultValue) && (
          <button
            type="button"
            onClick={() => onSearch?.('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    );
  },
);
SearchInput.displayName = 'SearchInput';

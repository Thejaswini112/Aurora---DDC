import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { buttonVariants, type ButtonProps } from '@/components/ui/button';

interface PrimaryButtonProps extends ButtonProps {
  to?: string;
}

export const PrimaryButton = forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  ({ className, to, ...props }, ref) => {
    if (to) {
      return (
        <Link to={to} className={cn(buttonVariants({ variant: 'default' }), className)}>
          {props.children}
        </Link>
      );
    }
    return <button ref={ref} className={cn(buttonVariants({ variant: 'default' }), className)} {...props} />;
  },
);
PrimaryButton.displayName = 'PrimaryButton';

interface SecondaryButtonProps extends ButtonProps {
  to?: string;
}

export const SecondaryButton = forwardRef<HTMLButtonElement, SecondaryButtonProps>(
  ({ className, to, ...props }, ref) => {
    if (to) {
      return (
        <Link to={to} className={cn(buttonVariants({ variant: 'outline' }), className)}>
          {props.children}
        </Link>
      );
    }
    return <button ref={ref} className={cn(buttonVariants({ variant: 'outline' }), className)} {...props} />;
  },
);
SecondaryButton.displayName = 'SecondaryButton';

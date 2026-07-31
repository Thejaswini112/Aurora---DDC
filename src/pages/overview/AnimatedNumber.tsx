import { useCountUp } from './useCountUp';

export function AnimatedNumber({
  value,
  decimals = 0,
  className,
}: {
  value: number;
  decimals?: number;
  className?: string;
}) {
  const { ref, display } = useCountUp(value, 1100, decimals);
  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}

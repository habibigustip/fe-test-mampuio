type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded${className ? ` ${className}` : ''}`}
      aria-hidden="true"
    />
  );
}

type CardProps = {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export function Card({ title, subtitle, children, className }: CardProps) {
  return (
    <section
      className={`rounded-lg border border-gray-200 bg-white p-6 shadow-sm${className ? ` ${className}` : ''}`}
    >
      <header className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </header>
      {children}
    </section>
  );
}

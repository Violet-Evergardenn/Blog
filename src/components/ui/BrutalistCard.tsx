interface BrutalistCardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'dark' | 'brand'
  onClick?: () => void
}

export default function BrutalistCard({
  children,
  className = '',
  variant = 'default',
  onClick,
}: BrutalistCardProps) {
  const variants = {
    default: 'border-2 border-white/20 bg-transparent',
    dark: 'border-2 border-black bg-black',
    brand: 'border-2 border-brand bg-brand text-black',
  }

  return (
    <div
      className={`${variants[variant]} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
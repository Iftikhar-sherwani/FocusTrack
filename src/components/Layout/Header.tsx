import { CalendarDays } from 'lucide-react'
import { format } from 'date-fns'

type Props = {
  title: string
  subtitle: string
}

export function Header({ title, subtitle }: Props) {
  return (
    <header className="mb-5 md:mb-8">
      <p className="text-xs uppercase tracking-[0.2em] mb-2" style={{ color: 'var(--color-textMuted)' }}>
        <CalendarDays size={14} className="inline mr-2" />
        {format(new Date(), 'EEEE, MMM dd')}
      </p>
      <h2 className="text-3xl md:text-4xl" style={{ fontFamily: 'var(--font-heading)' }}>
        {title}
      </h2>
      <p className="mt-1" style={{ color: 'var(--color-textMuted)' }}>
        {subtitle}
      </p>
    </header>
  )
}

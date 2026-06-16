const colorMap = {
  green:  'bg-green/10 text-green border-green/30',
  blue:   'bg-blue/10 text-blue border-blue/30',
  purple: 'bg-purple/10 text-purple border-purple/30',
  yellow: 'bg-yellow/10 text-yellow border-yellow/30',
  red:    'bg-red/10 text-red border-red/30',
  cyan:   'bg-cyan/10 text-cyan border-cyan/30',
  orange: 'bg-orange/10 text-orange border-orange/30',
  muted:  'bg-surface2 text-muted border-border',
  basic:       'bg-green/10 text-green border-green/30',
  intermediate:'bg-yellow/10 text-yellow border-yellow/30',
  advanced:    'bg-red/10 text-red border-red/30',
}
export default function Badge({ children, color = 'muted', className = '' }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${colorMap[color]||colorMap.muted} ${className}`}>
      {children}
    </span>
  )
}

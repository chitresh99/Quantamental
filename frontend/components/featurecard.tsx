import { DivideIcon } from 'lucide-react'
import type { LucideIcon } from 'lucide-react' // <-- import type, not value

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
}

export default function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="group rounded-2xl bg-white/10 p-8 shadow-lg backdrop-blur-sm border border-blue-500/30 hover:shadow-xl hover:bg-white/15 transition-all duration-300">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/20 mb-6">
        <Icon className="h-6 w-6 text-blue-200" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-4">
        {title}
      </h3>
      <p className="text-blue-100 leading-relaxed">
        {description}
      </p>
    </div>
  )
}

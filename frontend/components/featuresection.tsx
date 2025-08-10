import { BarChart3, Calculator, Bot } from 'lucide-react'
import FeatureCard from './featurecard'

const features = [
  {
    icon: BarChart3,
    title: "Real-Time Market Data",
    description: "Access live stock prices, market indicators, and financial data through our powerful CLI interface. Get instant insights with minimal latency."
  },
  {
    icon: Calculator,
    title: "Quantitative Modeling",
    description: "Advanced mathematical tools and statistical models for portfolio optimization, risk analysis, and algorithmic trading strategies."
  },
  {
    icon: Bot,
    title: "AI-Powered Analytics",
    description: "Machine learning models for stock recommendations, market sentiment analysis, and intelligent chatbot assistance for complex financial queries."
  }
]

export default function FeaturesSection() {
  return (
    <section id="features" className="px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Powerful Tools for Modern Finance
          </h2>
          <p className="mt-4 text-lg text-blue-100">
            Everything you need to analyze markets, build models, and make data-driven decisions
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
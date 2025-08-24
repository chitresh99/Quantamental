"use client"

import React from "react"
import { TrendingUp, ArrowRight, Brain } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AiservicesDashboard() {
  const router = useRouter()

  const handleNavigateToLysa = () => {
    router.push("/lysa")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/10 backdrop-blur-sm border-b border-blue-500/30">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-8 h-8 text-white" />
              <span className="text-xl font-bold text-white tracking-tight">
                LYSA - The AI Investment Advisor
              </span>
            </div>
            <div className="flex items-center gap-6">
              <TrendingUp className="w-6 h-6 text-blue-200" />
              <span className="text-blue-200 font-semibold">Dashboard</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-4xl">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6">
              Welcome to our
              <span className="bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent block mt-2">
                AI SERVICES
              </span>
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Harness the power of AI-driven investment insights and make smarter financial decisions
            </p>
          </div>

          {/* Card */}
          <div className="bg-white/15 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-8 shadow-lg hover:shadow-xl hover:bg-white/20 transition-all duration-300">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="bg-blue-500/30 p-3 rounded-xl">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    Lysa
                  </h2>
                  <p className="text-blue-200 font-semibold">
                    The AI Investment Advisor Tool
                  </p>
                </div>
              </div>
              <TrendingUp className="w-6 h-6 text-blue-300 group-hover:text-white transition-colors duration-200" />
            </div>

            <p className="text-blue-100 text-lg mb-8 leading-relaxed">
              Get personalized investment recommendations, portfolio analysis, and market insights 
              powered AI Models. Make informed decisions with confidence.
            </p>

            <div className="flex items-center justify-between flex-wrap gap-6">
              <div className="flex items-center gap-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">24/7</div>
                  <div className="text-sm text-blue-200">Available</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">AI</div>
                  <div className="text-sm text-blue-200">Powered</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">Smart</div>
                  <div className="text-sm text-blue-200">Insights</div>
                </div>
              </div>

              <button
                onClick={handleNavigateToLysa}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                Launch Lysa
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

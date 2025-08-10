import Navbar from '../components/navbar'
import HeroSection from '../components/herosection'
import FeaturesSection from '../components/featuresection'
import Footer from '../components/footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <Footer />
    </div>
  )
}

/*
=== TAILWINDCSS UTILITY DOCUMENTATION ===

GRADIENT BACKGROUNDS:
- bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600
  Creates a beautiful multi-stop diagonal gradient from deep navy to medium blue

TRANSPARENCY & GLASSMORPHISM:
- bg-white/10, bg-white/15, bg-white/5
  Semi-transparent white overlays for glassmorphic effect (10%, 15%, 5% opacity)
- border-blue-500/30
  30% transparent blue borders for subtle definition

BACKDROP BLUR:
- backdrop-blur-sm
  Creates the signature glass effect by blurring background content

SHADOWS:
- shadow-lg
  Large shadow for card depth
- hover:shadow-xl
  Enhanced shadow on hover for interactive feedback

SPACING:
- px-6 py-20
  Horizontal padding 1.5rem, vertical padding 5rem
- px-8 py-3
  Button padding for optimal touch targets
- gap-8, gap-x-6
  Grid and flex gaps for consistent spacing

TYPOGRAPHY:
- tracking-tight
  Reduced letter spacing for modern headlines
- font-extrabold, font-bold, font-semibold
  Font weight hierarchy for visual importance
- text-4xl sm:text-5xl lg:text-6xl
  Responsive text sizing that scales with viewport

RESPONSIVE GRIDS:
- md:grid-cols-3
  Three-column grid on medium screens and up
- grid gap-8
  Consistent 2rem spacing between grid items

HOVER TRANSITIONS:
- hover:text-white transition-colors duration-200
  Smooth color transitions on hover (200ms)
- hover:bg-blue-700 transition-all duration-300
  All-property transitions for button interactions
- group hover:shadow-xl hover:bg-white/15
  Card hover states with multiple property changes

POSITIONING:
- sticky top-0 z-50
  Sticky navigation that stays at viewport top with high z-index
- mx-auto max-w-7xl
  Centered content with maximum width constraint

FLEXBOX:
- flex items-center justify-between
  Common pattern for navbar layout
- flex-col items-center justify-between gap-4 sm:flex-row
  Responsive flex direction change

TEXT EFFECTS:
- bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent
  Gradient text effect for visual interest
*/
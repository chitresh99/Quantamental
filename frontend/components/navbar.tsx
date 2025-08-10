import { Button } from "@/components/ui/button"

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-blue-500/30 bg-white/10 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Quantamental
            </h1>
          </div>
          
          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a 
                href="#features" 
                className="text-blue-100 hover:text-white transition-colors duration-200 px-3 py-2 text-sm font-medium"
              >
                Features
              </a>
              <a 
                href="#about" 
                className="text-blue-100 hover:text-white transition-colors duration-200 px-3 py-2 text-sm font-medium"
              >
                About
              </a>
              <a 
                href="#contact" 
                className="text-blue-100 hover:text-white transition-colors duration-200 px-3 py-2 text-sm font-medium"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
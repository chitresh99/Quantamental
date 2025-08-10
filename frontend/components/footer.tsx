export default function Footer() {
  return (
    <footer className="border-t border-blue-500/30 bg-white/5 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-blue-200">
            © 2025 Quantamental. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a 
              href="#privacy" 
              className="text-sm text-blue-200 hover:text-white transition-colors duration-200"
            >
              Privacy
            </a>
            <a 
              href="#terms" 
              className="text-sm text-blue-200 hover:text-white transition-colors duration-200"
            >
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
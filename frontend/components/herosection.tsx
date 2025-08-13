import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="px-6 py-20 lg:py-32">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Powering Quantitative Finance with{" "}
          <span className="bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
            AI & Precision
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-blue-100">
          Quantamental combines cutting edge AI, mathematical modeling, and real
          time market data into a single platform for quants, traders, and analysts.
        </p>

        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-3 text-lg font-semibold"
            >
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

interface Service {
  title: string;
  route: string;
}

const services: Service[] = [
  { title: "ML and AI Services", route: "/ml-ai" },
  { title: "Developer Tools", route: "/developerdash" },
  { title: "CLI", route: "/clidash" },
];

export default function Dashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 px-6 py-20">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-center mb-16 text-white">
        Quantamental&apos;s Dashboard
      </h1>

      <div className="grid gap-8 md:grid-cols-3 max-w-7xl mx-auto">
        {services.map((service) => (
          <Card
            key={service.title}
            className="group bg-white/10 border border-blue-500/30 backdrop-blur-sm shadow-lg hover:shadow-xl hover:bg-white/15 transition-all duration-300 cursor-pointer"
            onClick={() => router.push(service.route)}
          >
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white">
                {service.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <button
                className="w-full flex items-center justify-center gap-2 border border-blue-500/30 bg-white/10 text-white font-semibold rounded-lg hover:bg-blue-700 hover:border-blue-500 transition-all duration-300"
              >
                Go
                <ArrowRight className="w-5 h-5" />
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

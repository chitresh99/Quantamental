"use client";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Newspaper, Code2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-12">
          Developer Tools
        </h1>

        <div className="grid gap-8 sm:grid-cols-2">
          {/* Financial News Card */}
          <Card className="bg-white/10 border border-blue-500/30 backdrop-blur-sm shadow-lg hover:shadow-xl hover:bg-white/15 transition-all duration-300 group">
            <CardHeader className="flex items-center gap-3">
              <Newspaper className="w-6 h-6 text-blue-300 group-hover:text-white transition-colors duration-200" />
              <CardTitle className="text-white">Financial News</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-100 mb-4">
                Stay updated with the latest market trends, stock updates, and
                economic insights.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/financenews" className="w-full">
                <Button
                  variant="outline"
                  className="w-full border-blue-500/30 bg-white/10 text-white hover:bg-blue-700 hover:border-blue-500 transition-all duration-300"
                >
                  Go to Financial News
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Developer Tools Card */}
          <Card className="bg-white/10 border border-blue-500/30 backdrop-blur-sm shadow-lg hover:shadow-xl hover:bg-white/15 transition-all duration-300 group">
            <CardHeader className="flex items-center gap-3">
              <Code2 className="w-6 h-6 text-blue-300 group-hover:text-white transition-colors duration-200" />
              <CardTitle className="text-white">Developer Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-100 mb-4">
                Access Quantamental's powerfull advanced mathematical tools.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/developertool" className="w-full">
                <Button
                  variant="outline"
                  className="w-full border-blue-500/30 bg-white/10 text-white hover:bg-blue-700 hover:border-blue-500 transition-all duration-300"
                >
                  Go to Developer Tools
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

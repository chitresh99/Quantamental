"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Terminal, 
  Github, 
  Key, 
  Play, 
  Copy, 
  Check, 
  TrendingUp, 
  ExternalLink,
  Code,
  FileText,
  Zap
} from 'lucide-react';

interface CodeBlockProps {
  code: string;
  title?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, title }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="relative group">
      {title && (
        <div className="text-sm text-blue-200 mb-2 font-medium">{title}</div>
      )}
      <div className="relative bg-gray-900/80 backdrop-blur-sm border border-white/10 rounded-lg p-4">
        <pre className="text-green-300 text-sm overflow-x-auto">
          <code>{code}</code>
        </pre>
        <Button
          size="sm"
          variant="outline"
          className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/5 border-white/10 hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          onClick={copyToClipboard}
        >
          {copied ? (
            <Check className="h-3 w-3 text-green-400" />
          ) : (
            <Copy className="h-3 w-3 text-white" />
          )}
        </Button>
      </div>
    </div>
  );
};

interface StepCardProps {
  stepNumber: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  children?: React.ReactNode;
}

const StepCard: React.FC<StepCardProps> = ({ stepNumber, icon, title, description, children }) => (
  <Card className="group hover:shadow-xl transition-all duration-300 hover:bg-white/10 border-white/10 bg-white/5 backdrop-blur-sm">
    <CardHeader>
      <div className="flex items-center gap-3 mb-2">
        <div className="flex items-center justify-center w-8 h-8 bg-blue-600/30 rounded-full text-blue-200 font-bold text-sm">
          {stepNumber}
        </div>
        <div className="p-2 bg-blue-600/20 rounded-lg">
          {icon}
        </div>
      </div>
      <CardTitle className="text-xl font-bold text-white tracking-tight group-hover:text-blue-200 transition-colors duration-200">
        {title}
      </CardTitle>
      <CardDescription className="text-gray-300 text-base leading-relaxed">
        {description}
      </CardDescription>
    </CardHeader>
    {children && (
      <CardContent className="pt-0">
        {children}
      </CardContent>
    )}
  </Card>
);

const CLIdash: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/10 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600/30 rounded-lg">
                <Terminal className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight">
                  CLI Tools Setup
                </h1>
                <p className="text-blue-200 text-sm">
                  Get the latest stock prices with our CLI tools
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-600/20 text-green-200 border-green-500/30">
              <Zap className="w-3 h-3 mr-1" />
              Quick Start
            </Badge>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Get the latest stock prices with our
            <span className="bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent"> CLI tools</span>
          </h2>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
            Follow these simple steps to set up and run our powerful command-line interface for real-time stock data
          </p>
        </div>

        {/* Quick Overview Alert */}
        <Alert className="mb-12 bg-blue-900/20 border-blue-500/30 text-blue-200">
          <TrendingUp className="h-4 w-4" />
          <AlertDescription className="text-base">
            <strong>Quick Overview:</strong> You'll need a FINHUB API key and either Rust/Cargo installed or our shell script. The entire setup takes less than 5 minutes!
          </AlertDescription>
        </Alert>

        {/* Steps Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 mb-12">
          {/* Step 1 */}
          <StepCard
            stepNumber={1}
            icon={<Github className="w-5 h-5 text-blue-200" />}
            title="Visit Quantamental GitHub"
            description="Navigate to our official GitHub repository to access the CLI tools and documentation."
          >
            <Button
              variant="outline"
              className="w-full bg-transparent border-blue-500/30 text-blue-200 hover:bg-blue-700/20 hover:border-blue-400/50 transition-all duration-200"
              onClick={() => window.open('https://github.com/chitresh99/quantamental', '_blank')}
            >
              <Github className="w-4 h-4 mr-2" />
              Go to Quantamental GitHub Repo
              <ExternalLink className="w-3 h-3 ml-2" />
            </Button>
          </StepCard>

          {/* Step 2 */}
          <StepCard
            stepNumber={2}
            icon={<FileText className="w-5 h-5 text-blue-200" />}
            title="Navigate to CLI Repository"
            description="Find and access the CLI-specific repository within our GitHub organization."
          >
            <div className="space-y-3">
              <div className="text-sm text-gray-300">
                Look for the CLI folder in the Quantamental Repository
              </div>
              <Badge variant="secondary" className="bg-yellow-600/20 text-yellow-200 border-yellow-500/30">
                <Code className="w-3 h-3 mr-1" />
                Repository: Quantamental
              </Badge>
            </div>
          </StepCard>

          {/* Step 3 */}
          <StepCard
            stepNumber={3}
            icon={<Key className="w-5 h-5 text-blue-200" />}
            title="Get FINHUB API Key"
            description="Ensure you have a valid FINHUB API key for accessing real-time stock market data."
          >
            <div className="space-y-4">
              <Alert className="bg-yellow-900/20 border-yellow-500/30 text-yellow-200">
                <Key className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  You'll need this API key to authenticate your requests to the stock data service
                </AlertDescription>
              </Alert>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent border-yellow-500/30 text-yellow-200 hover:bg-yellow-700/20"
                onClick={() => window.open('https://finnhub.io/', '_blank')}
              >
                Get FINHUB API Key
                <ExternalLink className="w-3 h-3 ml-2" />
              </Button>
            </div>
          </StepCard>

          {/* Step 4 */}
          <StepCard
            stepNumber={4}
            icon={<Play className="w-5 h-5 text-blue-200" />}
            title="Run the CLI Tool"
            description="Execute the CLI using either our shell script or directly with Cargo."
          />
        </div>

        {/* Execution Methods */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Method 1: Shell Script */}
          <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white font-bold flex items-center gap-2">
                <Terminal className="w-5 h-5 text-green-400" />
                Method 1: Shell Script (Recommended)
              </CardTitle>
              <CardDescription className="text-gray-300">
                Quick and easy setup using our provided shell script
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <CodeBlock
                title="Make script executable"
                code="chmod +x clistart.sh"
              />
              <CodeBlock
                title="Run the CLI"
                code="./clistart"
              />
              <Badge variant="secondary" className="bg-green-600/20 text-green-200 border-green-500/30">
                ✓ Easiest method
              </Badge>
            </CardContent>
          </Card>

          {/* Method 2: Cargo */}
          <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white font-bold flex items-center gap-2">
                <Code className="w-5 h-5 text-orange-400" />
                Method 2: Direct Cargo Run
              </CardTitle>
              <CardDescription className="text-gray-300">
                Run directly with Rust's Cargo package manager
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <CodeBlock
                title="Run with custom parameters"
                code='cargo run -- --token "$FINHUB_API_KEY" --symbols "AAPL,GOOGL,TSLA"'
              />
              <div className="space-y-2">
                <Badge variant="secondary" className="bg-blue-600/20 text-blue-200 border-blue-500/30 mr-2">
                  More control
                </Badge>
                <Badge variant="secondary" className="bg-purple-600/20 text-purple-200 border-purple-500/30">
                  Custom symbols
                </Badge>
              </div>
              <Alert className="bg-orange-900/20 border-orange-500/30 text-orange-200">
                <AlertDescription className="text-sm">
                  <strong>Note:</strong> Replace <code>$FINHUB_API_KEY</code> with your actual API key
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>

        {/* Success Message */}
        <div className="mt-12 text-center">
          <Card className="inline-block border-green-500/30 bg-green-900/20 backdrop-blur-sm">
            <CardContent className="px-8 py-6">
              <div className="flex items-center gap-3 text-green-200">
                <Check className="w-6 h-6" />
                <span className="text-lg font-semibold">
                  You're all set! Start getting real-time stock prices with our CLI tools.
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-16 border-t border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="text-center text-blue-200 text-sm">
            <p>Powered by Quantamental</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CLIdash;

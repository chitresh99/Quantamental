"use client";
import React, { useState } from "react";
import {
  TrendingUp,
  DollarSign,
  Target,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  BarChart3,
  PieChart,
  Wallet,
  Brain,
  Shield,
  Calendar,
  Download,
} from "lucide-react";

// Markdown Component
const MarkdownRenderer = ({ content }: { content: string }) => {
  const renderMarkdown = (text: string) => {
    // Split by lines
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let inList = false;
    let listItems: string[] = [];

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="list-disc list-inside space-y-2 mb-4 text-blue-100">
            {listItems.map((item, i) => (
              <li key={i} className="ml-4">{processInlineMarkdown(item)}</li>
            ))}
          </ul>
        );
        listItems = [];
        inList = false;
      }
    };

    const processInlineMarkdown = (line: string) => {
      // Bold text
      line = line.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-white">$1</strong>');
      line = line.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>');
      
      return <span dangerouslySetInnerHTML={{ __html: line }} />;
    };

    lines.forEach((line, index) => {
      // Headers
      if (line.startsWith('###')) {
        flushList();
        elements.push(
          <h3 key={index} className="text-xl font-bold text-white mt-6 mb-3">
            {line.replace(/^###\s*/, '')}
          </h3>
        );
      } else if (line.startsWith('##')) {
        flushList();
        elements.push(
          <h2 key={index} className="text-2xl font-bold text-white mt-8 mb-4">
            {line.replace(/^##\s*/, '')}
          </h2>
        );
      } else if (line.startsWith('#')) {
        flushList();
        elements.push(
          <h1 key={index} className="text-3xl font-bold text-white mt-8 mb-4">
            {line.replace(/^#\s*/, '')}
          </h1>
        );
      }
      // Horizontal rule
      else if (line.trim() === '---') {
        flushList();
        elements.push(
          <hr key={index} className="border-blue-500/30 my-6" />
        );
      }
      // List items
      else if (line.match(/^[-*]\s/)) {
        if (!inList) {
          inList = true;
        }
        listItems.push(line.replace(/^[-*]\s/, ''));
      }
      // Table detection
      else if (line.includes('|')) {
        flushList();
        // Skip table rendering for now, just show as text
        elements.push(
          <p key={index} className="text-blue-200 mb-2 font-mono text-sm">
            {line}
          </p>
        );
      }
      // Regular paragraphs
      else if (line.trim()) {
        flushList();
        elements.push(
          <p key={index} className="text-blue-100 mb-4 leading-relaxed">
            {processInlineMarkdown(line)}
          </p>
        );
      }
      // Empty lines
      else {
        flushList();
      }
    });

    flushList(); // Flush any remaining list items
    return elements;
  };

  return <div className="markdown-content">{renderMarkdown(content)}</div>;
};

interface UserData {
  age: string;
  annual_income: string;
  investment_experience: string;
  risk_tolerance: string;
  investment_goals: string[];
  time_horizon: string;
  liquidity_needs: string;
  additional_context: string;
}

interface Holding {
  symbol: string;
  name: string;
  asset_type: string;
  quantity: string;
  current_price: string;
  purchase_price: string;
  purchase_date: string;
}

interface AnalysisResult {
  analysis: string;
  recommendations: string[];
  risk_assessment: string;
  diversification_score: number;
  suggested_allocations: {
    stocks: number;
    bonds: number;
    alternatives: number;
  };
  next_steps: string[];
  confidence_score: number;
  timestamp: string;
}

// Header Component
const Header = ({ onNewAnalysis }: { onNewAnalysis?: () => void }) => (
  <div className="sticky top-0 z-50 bg-white/10 backdrop-blur-sm border-b border-blue-500/30">
    <div className="max-w-7xl mx-auto px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-200 to-white rounded-lg flex items-center justify-center">
            <Brain className="w-6 h-6 text-blue-900" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
              Lysa AI
            </h1>
            <p className="text-blue-200 text-sm">Investment Advisor</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-blue-200">
            <Shield className="w-5 h-5" />
            <span className="text-sm">Secure & Private</span>
          </div>
          {onNewAnalysis && (
            <button
              onClick={onNewAnalysis}
              className="px-6 py-2 bg-white/15 hover:bg-white/25 text-white rounded-lg transition-all duration-300 font-semibold"
            >
              New Analysis
            </button>
          )}
        </div>
      </div>
    </div>
  </div>
);

// Custom Select Component
const CustomSelect = ({
  value,
  onChange,
  options,
  placeholder,
  className = "",
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  className?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-white/10 border border-blue-500/30 rounded-xl text-white text-left focus:outline-none focus:border-blue-400 transition-colors duration-200 flex justify-between items-center"
      >
        <span className={value ? "text-white" : "text-blue-300"}>
          {value
            ? options.find((opt) => opt.value === value)?.label
            : placeholder}
        </span>
        <ArrowRight
          className={`w-4 h-4 text-blue-300 transform transition-transform duration-200 ${
            isOpen ? "rotate-90" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800/95 backdrop-blur-sm border border-blue-500/30 rounded-xl shadow-xl z-10">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className="w-full px-4 py-3 text-left text-white hover:bg-blue-500/20 transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Hero Section Component
const HeroSection = () => (
  <div className="text-center mb-16">
    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
      AI-Powered Investment
      <span className="bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent block">
        Advisory
      </span>
    </h2>
    <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
      Get personalized investment recommendations based on your profile, goals,
      and current holdings. Our AI analyzes your portfolio and provides
      actionable insights for wealth building.
    </p>
  </div>
);

// User Profile Form Component
const UserProfileForm = ({
  userData,
  setUserData,
}: {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
}) => {
  const goalOptions = [
    "wealth_building",
    "retirement",
    "education_fund",
    "home_purchase",
    "emergency_fund",
    "passive_income",
  ];

  const handleGoalChange = (goal: string, checked: boolean) => {
    if (checked) {
      setUserData({
        ...userData,
        investment_goals: [...userData.investment_goals, goal],
      });
    } else {
      setUserData({
        ...userData,
        investment_goals: userData.investment_goals.filter((g) => g !== goal),
      });
    }
  };

  const experienceOptions = [
    { value: "", label: "Select experience level" },
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
  ];

  const riskOptions = [
    { value: "", label: "Select risk tolerance" },
    { value: "conservative", label: "Conservative" },
    { value: "moderate", label: "Moderate" },
    { value: "aggressive", label: "Aggressive" },
  ];

  return (
    <div className="mb-8">
      <h4 className="text-xl font-semibold text-blue-200 mb-6">
        Personal Information
      </h4>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label className="block text-blue-200 text-sm font-semibold mb-2">
            Age
          </label>
          <input
            type="number"
            value={userData.age}
            onChange={(e) => setUserData({ ...userData, age: e.target.value })}
            className="w-full px-4 py-3 bg-white/10 border border-blue-500/30 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:border-blue-400 transition-colors duration-200"
            placeholder="28"
          />
        </div>

        <div>
          <label className="block text-blue-200 text-sm font-semibold mb-2">
            Annual Income ($)
          </label>
          <input
            type="number"
            value={userData.annual_income}
            onChange={(e) =>
              setUserData({ ...userData, annual_income: e.target.value })
            }
            className="w-full px-4 py-3 bg-white/10 border border-blue-500/30 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:border-blue-400 transition-colors duration-200"
            placeholder="75000"
          />
        </div>

        <div>
          <label className="block text-blue-200 text-sm font-semibold mb-2">
            Investment Experience
          </label>
          <CustomSelect
            value={userData.investment_experience}
            onChange={(value) =>
              setUserData({ ...userData, investment_experience: value })
            }
            options={experienceOptions}
            placeholder="Select experience level"
          />
        </div>

        <div>
          <label className="block text-blue-200 text-sm font-semibold mb-2">
            Risk Tolerance
          </label>
          <CustomSelect
            value={userData.risk_tolerance}
            onChange={(value) =>
              setUserData({ ...userData, risk_tolerance: value })
            }
            options={riskOptions}
            placeholder="Select risk tolerance"
          />
        </div>

        <div>
          <label className="block text-blue-200 text-sm font-semibold mb-2">
            Time Horizon (years)
          </label>
          <input
            type="number"
            value={userData.time_horizon}
            onChange={(e) =>
              setUserData({ ...userData, time_horizon: e.target.value })
            }
            className="w-full px-4 py-3 bg-white/10 border border-blue-500/30 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:border-blue-400 transition-colors duration-200"
            placeholder="35"
          />
        </div>

        <div>
          <label className="block text-blue-200 text-sm font-semibold mb-2">
            Liquidity Needs (%)
          </label>
          <input
            type="number"
            step="0.1"
            value={userData.liquidity_needs}
            onChange={(e) =>
              setUserData({ ...userData, liquidity_needs: e.target.value })
            }
            className="w-full px-4 py-3 bg-white/10 border border-blue-500/30 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:border-blue-400 transition-colors duration-200"
            placeholder="5.0"
          />
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-blue-200 text-sm font-semibold mb-2">
          Investment Goals
        </label>
        <div className="grid md:grid-cols-3 gap-3">
          {goalOptions.map((goal) => (
            <label
              key={goal}
              className="flex items-center gap-2 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors duration-200 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={userData.investment_goals.includes(goal)}
                onChange={(e) => handleGoalChange(goal, e.target.checked)}
                className="rounded border-blue-500/30 bg-white/10 text-blue-500"
              />
              <span className="text-blue-200 capitalize">
                {goal.replace("_", " ")}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-blue-200 text-sm font-semibold mb-2">
          Additional Context
        </label>
        <textarea
          value={userData.additional_context}
          onChange={(e) =>
            setUserData({ ...userData, additional_context: e.target.value })
          }
          className="w-full px-4 py-3 bg-white/10 border border-blue-500/30 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:border-blue-400 transition-colors duration-200 h-24 resize-none"
          placeholder="Tell us more about your investment goals and situation..."
        />
      </div>
    </div>
  );
};

// Holdings Component
const HoldingsForm = ({
  holdings,
  setHoldings,
}: {
  holdings: Holding[];
  setHoldings: React.Dispatch<React.SetStateAction<Holding[]>>;
}) => {
  const addHolding = () => {
    setHoldings([
      ...holdings,
      {
        symbol: "",
        name: "",
        asset_type: "stock",
        quantity: "",
        current_price: "",
        purchase_price: "",
        purchase_date: "",
      },
    ]);
  };

  const updateHolding = (
    index: number,
    field: keyof Holding,
    value: string
  ) => {
    const updated = holdings.map((holding, i) =>
      i === index ? { ...holding, [field]: value } : holding
    );
    setHoldings(updated);
  };

  const removeHolding = (index: number) => {
    setHoldings(holdings.filter((_, i) => i !== index));
  };

  const assetTypeOptions = [
    { value: "stock", label: "Stock" },
    { value: "crypto", label: "Crypto" },
    { value: "bond", label: "Bond" },
    { value: "etf", label: "ETF" },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-xl font-semibold text-blue-200">
          Current Holdings
        </h4>
        <button
          onClick={addHolding}
          className="px-6 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg transition-all duration-300 font-semibold border border-green-500/30"
        >
          + Add Holding
        </button>
      </div>

      {holdings.length === 0 ? (
        <div className="text-center py-12 text-blue-300">
          <Wallet className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg">
            No holdings added yet. Click "Add Holding" to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {holdings.map((holding, index) => (
            <div
              key={index}
              className="bg-white/5 rounded-xl p-6 border border-blue-500/20"
            >
              <div className="grid md:grid-cols-4 lg:grid-cols-8 gap-4">
                <div>
                  <label className="block text-blue-200 text-sm font-semibold mb-2">
                    Symbol
                  </label>
                  <input
                    type="text"
                    value={holding.symbol}
                    onChange={(e) =>
                      updateHolding(
                        index,
                        "symbol",
                        e.target.value.toUpperCase()
                      )
                    }
                    className="w-full px-3 py-2 bg-white/10 border border-blue-500/30 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:border-blue-400 transition-colors duration-200"
                    placeholder="TSLA"
                  />
                </div>

                <div>
                  <label className="block text-blue-200 text-sm font-semibold mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={holding.name}
                    onChange={(e) =>
                      updateHolding(index, "name", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-white/10 border border-blue-500/30 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:border-blue-400 transition-colors duration-200"
                    placeholder="Tesla Inc"
                  />
                </div>

                <div>
                  <label className="block text-blue-200 text-sm font-semibold mb-2">
                    Type
                  </label>
                  <CustomSelect
                    value={holding.asset_type}
                    onChange={(value) =>
                      updateHolding(index, "asset_type", value)
                    }
                    options={assetTypeOptions}
                    placeholder="Select type"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-blue-200 text-sm font-semibold mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={holding.quantity}
                    onChange={(e) =>
                      updateHolding(index, "quantity", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-white/10 border border-blue-500/30 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:border-blue-400 transition-colors duration-200"
                    placeholder="10"
                  />
                </div>

                <div>
                  <label className="block text-blue-200 text-sm font-semibold mb-2">
                    Current Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={holding.current_price}
                    onChange={(e) =>
                      updateHolding(index, "current_price", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-white/10 border border-blue-500/30 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:border-blue-400 transition-colors duration-200"
                    placeholder="210.00"
                  />
                </div>

                <div>
                  <label className="block text-blue-200 text-sm font-semibold mb-2">
                    Purchase Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={holding.purchase_price}
                    onChange={(e) =>
                      updateHolding(index, "purchase_price", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-white/10 border border-blue-500/30 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:border-blue-400 transition-colors duration-200"
                    placeholder="180.00"
                  />
                </div>

                <div>
                  <label className="block text-blue-200 text-sm font-semibold mb-2">
                    Purchase Date
                  </label>
                  <input
                    type="date"
                    value={holding.purchase_date}
                    onChange={(e) =>
                      updateHolding(index, "purchase_date", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-white/10 border border-blue-500/30 rounded-lg text-white focus:outline-none focus:border-blue-400 transition-colors duration-200 [color-scheme:dark]"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => removeHolding(index)}
                    className="w-full px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-all duration-300 font-semibold border border-red-500/30"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Features Section Component
const FeaturesSection = () => (
  <div className="mt-20">
    <h3 className="text-3xl font-bold text-white text-center mb-12">
      Why Choose Lysa AI?
    </h3>

    <div className="grid md:grid-cols-3 gap-8">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-blue-500/30 p-8 text-center shadow-lg hover:shadow-xl hover:bg-white/15 transition-all duration-300 group">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <h4 className="text-xl font-bold text-white mb-4">
          AI-Powered Analysis
        </h4>
        <p className="text-blue-200 leading-relaxed">
          Advanced algorithms analyze your portfolio against market data and
          risk factors to provide personalized recommendations.
        </p>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-blue-500/30 p-8 text-center shadow-lg hover:shadow-xl hover:bg-white/15 transition-all duration-300 group">
        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h4 className="text-xl font-bold text-white mb-4">Risk Management</h4>
        <p className="text-blue-200 leading-relaxed">
          Comprehensive risk assessment including diversification scoring,
          volatility analysis, and concentration risk evaluation.
        </p>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-blue-500/30 p-8 text-center shadow-lg hover:shadow-xl hover:bg-white/15 transition-all duration-300 group">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
          <Target className="w-8 h-8 text-white" />
        </div>
        <h4 className="text-xl font-bold text-white mb-4">
          Goal-Oriented Strategy
        </h4>
        <p className="text-blue-200 leading-relaxed">
          Tailored recommendations based on your specific goals, timeline, and
          financial situation for optimal wealth building.
        </p>
      </div>
    </div>
  </div>
);

// Results Dashboard Component
const ResultsDashboard = ({
  analysisResult,
  holdings,
  onNewAnalysis,
}: {
  analysisResult: AnalysisResult;
  holdings: Holding[];
  onNewAnalysis: () => void;
}) => {
  // Calculate portfolio metrics from actual holdings
  const calculatePortfolioMetrics = () => {
    const totalValue = holdings.reduce((sum, h) => {
      return sum + (parseFloat(h.quantity) * parseFloat(h.current_price));
    }, 0);

    const totalCost = holdings.reduce((sum, h) => {
      return sum + (parseFloat(h.quantity) * parseFloat(h.purchase_price));
    }, 0);

    const totalReturn = totalCost > 0 ? ((totalValue - totalCost) / totalCost) * 100 : 0;

    // Calculate allocation by asset type
    const allocation: { [key: string]: number } = {};
    holdings.forEach(h => {
      const value = parseFloat(h.quantity) * parseFloat(h.current_price);
      allocation[h.asset_type] = (allocation[h.asset_type] || 0) + value;
    });

    const allocationPercentages: { [key: string]: number } = {};
    Object.keys(allocation).forEach(type => {
      allocationPercentages[type] = totalValue > 0 ? (allocation[type] / totalValue) * 100 : 0;
    });

    return {
      totalValue,
      totalReturn,
      allocationPercentages
    };
  };

  const metrics = calculatePortfolioMetrics();

  const downloadReport = () => {
    const reportContent = `
LYSA AI INVESTMENT ADVISORY REPORT
Generated: ${new Date().toLocaleDateString()}

${analysisResult.analysis}

KEY RECOMMENDATIONS:
${analysisResult.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join("\n")}

RISK ASSESSMENT:
${analysisResult.risk_assessment}

SUGGESTED ALLOCATION:
- Stocks: ${analysisResult.suggested_allocations.stocks}%
- Bonds: ${analysisResult.suggested_allocations.bonds}%
- Alternatives: ${analysisResult.suggested_allocations.alternatives}%

NEXT STEPS:
${analysisResult.next_steps.map((step, i) => `${i + 1}. ${step}`).join("\n")}

Confidence Score: ${Math.round(analysisResult.confidence_score * 100)}%
Diversification Score: ${analysisResult.diversification_score}/10
`;

    const blob = new Blob([reportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lysa-investment-report-${
      new Date().toISOString().split("T")[0]
    }.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Executive Summary Card */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-blue-500/30 p-8 mb-8 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-8 h-8 text-blue-200" />
          <h2 className="text-3xl font-bold text-white">
            Investment Analysis Report
          </h2>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white/5 rounded-xl p-4 border border-blue-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="w-5 h-5 text-blue-200" />
              <span className="text-blue-200 text-sm">Total Value</span>
            </div>
            <span className="text-2xl font-bold text-white">
              ${metrics.totalValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </span>
          </div>

          <div className="bg-white/5 rounded-xl p-4 border border-blue-500/20">
            <div className="flex items-center gap-2 mb-2">
              <PieChart className="w-5 h-5 text-blue-200" />
              <span className="text-blue-200 text-sm">Diversification</span>
            </div>
            <span className="text-2xl font-bold text-white">
              {analysisResult.diversification_score.toFixed(1)}/10
            </span>
          </div>

          <div className="bg-white/5 rounded-xl p-4 border border-blue-500/20">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-5 h-5 text-blue-200" />
              <span className="text-blue-200 text-sm">Total Return</span>
            </div>
            <span className={`text-2xl font-bold ${metrics.totalReturn >= 0 ? 'text-green-300' : 'text-red-300'}`}>
              {metrics.totalReturn >= 0 ? '+' : ''}{metrics.totalReturn.toFixed(1)}%
            </span>
          </div>

          <div className="bg-white/5 rounded-xl p-4 border border-blue-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-blue-200" />
              <span className="text-blue-200 text-sm">Confidence</span>
            </div>
            <span className="text-2xl font-bold text-white">
              {Math.round((analysisResult.confidence_score || 0) * 100)}%
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl p-6 border border-yellow-500/30">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-yellow-300 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold text-yellow-300 mb-2">
                Key Insight
              </h3>
              <p className="text-yellow-100 leading-relaxed">
                {analysisResult.risk_assessment}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Analysis Section */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-blue-500/30 p-8 mb-8 shadow-lg">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <Brain className="w-6 h-6 text-purple-300" />
          Detailed Analysis
        </h3>
        <div className="bg-white/5 rounded-xl p-6 border border-blue-500/20">
          <MarkdownRenderer content={analysisResult.analysis} />
        </div>
      </div>

      {/* Current vs Recommended Allocation */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-blue-500/30 p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <PieChart className="w-6 h-6 text-blue-200" />
            Current Allocation
          </h3>

          <div className="space-y-4">
            {Object.entries(metrics.allocationPercentages)
              .sort((a, b) => b[1] - a[1])
              .map(([type, percentage]) => (
                <div key={type} className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
                  <span className="text-blue-200 capitalize">{type}</span>
                  <span className="text-white font-bold">{percentage.toFixed(0)}%</span>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-blue-500/30 p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Target className="w-6 h-6 text-green-300" />
            Recommended Allocation
          </h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
              <span className="text-blue-200">Stocks</span>
              <span className="text-green-300 font-bold">
                {analysisResult.suggested_allocations.stocks}%
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
              <span className="text-blue-200">Bonds</span>
              <span className="text-green-300 font-bold">
                {analysisResult.suggested_allocations.bonds}%
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
              <span className="text-blue-200">Alternatives</span>
              <span className="text-green-300 font-bold">
                {analysisResult.suggested_allocations.alternatives}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-blue-500/30 p-8 mb-8 shadow-lg">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-300" />
          Key Recommendations
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          {analysisResult.recommendations.map((rec, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors duration-200"
            >
              <ArrowRight className="w-5 h-5 text-green-300 mt-1 flex-shrink-0" />
              <span className="text-blue-100 leading-relaxed">{rec}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-blue-500/30 p-8 shadow-lg">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <Calendar className="w-6 h-6 text-purple-300" />
          Action Plan
        </h3>

        <div className="space-y-4">
          {analysisResult.next_steps.map((step, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors duration-200 group"
            >
              <div className="w-8 h-8 bg-purple-500/30 rounded-full flex items-center justify-center text-purple-300 font-bold">
                {index + 1}
              </div>
              <span className="text-blue-100 flex-1">{step}</span>
              <CheckCircle className="w-5 h-5 text-green-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </div>
          ))}
        </div>

        <div className="mt-8 flex gap-4">
          <button
            onClick={onNewAnalysis}
            className="flex-1 px-8 py-3 bg-white/15 hover:bg-white/25 text-white rounded-xl transition-all duration-300 font-semibold"
          >
            Analyze Another Portfolio
          </button>
          <button
            onClick={downloadReport}
            className="flex-1 px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-xl transition-all duration-300 font-semibold flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Component
const LysaInvestmentAdvisor = () => {
  const [currentPage, setCurrentPage] = useState<"input" | "results">("input");
  const [userData, setUserData] = useState<UserData>({
    age: "",
    annual_income: "",
    investment_experience: "",
    risk_tolerance: "",
    investment_goals: [],
    time_horizon: "",
    liquidity_needs: "",
    additional_context: "",
  });
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sample analysis data for demonstration
  const sampleAnalysis: AnalysisResult = {
    analysis:
      "**Lysa Wealth Advisor – Investment Advisory Report**\n**Client:** 28‑year‑old young professional\n**Date:** 24 Aug 2025\n\n---\n\n## Executive Summary\n\nYour current portfolio is heavily tilted toward high-growth tech stocks and crypto, creating significant concentration risk. While this aggressive approach aligns with your risk tolerance and 35-year horizon, diversification improvements are needed to optimize long-term wealth building.\n\n**Key Findings:**\n- Total Portfolio Value: $8,850\n- Current Allocation: 49% stocks, 51% crypto\n- Diversification Score: 5.0/10\n- Annualized Return: 10.6%\n- Risk Level: High\n\n**Bottom Line:** Reduce crypto exposure to 10-15%, diversify equity holdings across sectors and geographies, and add a modest bond allocation for volatility management.",
    recommendations: [
      "Reduce Bitcoin allocation from 51% to 10-15% of total portfolio",
      "Diversify equity holdings beyond tech sector concentration",
      "Add broad market index funds for better diversification",
      "Consider adding 10-20% bond allocation for volatility dampening",
      "Implement systematic rebalancing schedule (quarterly)",
    ],
    risk_assessment:
      "High concentration risk due to 51% crypto allocation and tech sector focus. While aggressive approach suits your profile, current structure creates unnecessary volatility.",
    diversification_score: 5.0,
    suggested_allocations: {
      stocks: 70,
      bonds: 20,
      alternatives: 10,
    },
    next_steps: [
      "Rebalance portfolio within 30 days",
      "Open tax-advantaged accounts (401k, IRA)",
      "Set up automated investing schedule",
      "Review portfolio quarterly",
      "Build 3-6 month emergency fund",
    ],
    confidence_score: 0.85,
    timestamp: "2025-08-24T16:56:20.509811",
  };

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (
        !userData.age ||
        !userData.annual_income ||
        !userData.investment_experience ||
        !userData.risk_tolerance ||
        !userData.time_horizon ||
        !userData.liquidity_needs
      ) {
        throw new Error("Please fill in all required fields");
      }

      if (holdings.length === 0) {
        throw new Error("Please add at least one holding");
      }

      // Validate holdings data
      for (const holding of holdings) {
        if (
          !holding.symbol ||
          !holding.quantity ||
          !holding.current_price ||
          !holding.purchase_price
        ) {
          throw new Error(
            "Please fill in all holding fields (symbol, quantity, current price, purchase price)"
          );
        }
      }

      // Prepare the request data with proper validation
      const requestData = {
        user_profile: {
          age: parseInt(userData.age),
          annual_income: parseInt(userData.annual_income),
          investment_experience: userData.investment_experience,
          risk_tolerance: userData.risk_tolerance,
          investment_goals:
            userData.investment_goals.length > 0
              ? userData.investment_goals
              : ["wealth_building"],
          time_horizon: parseInt(userData.time_horizon),
          liquidity_needs: parseFloat(userData.liquidity_needs),
        },
        holdings: holdings.map((holding) => ({
          symbol: holding.symbol.trim().toUpperCase(),
          name: holding.name.trim() || holding.symbol.trim().toUpperCase(),
          asset_type: holding.asset_type,
          quantity: parseFloat(holding.quantity),
          current_price: parseFloat(holding.current_price),
          purchase_price: parseFloat(holding.purchase_price),
          purchase_date:
            holding.purchase_date || new Date().toISOString().split("T")[0],
        })),
        additional_context: userData.additional_context || "",
      };

      // Validate parsed numbers
      if (
        isNaN(requestData.user_profile.age) ||
        requestData.user_profile.age < 18 ||
        requestData.user_profile.age > 100
      ) {
        throw new Error("Please enter a valid age between 18 and 100");
      }

      if (
        isNaN(requestData.user_profile.annual_income) ||
        requestData.user_profile.annual_income < 0
      ) {
        throw new Error("Please enter a valid annual income");
      }

      if (
        isNaN(requestData.user_profile.time_horizon) ||
        requestData.user_profile.time_horizon < 1
      ) {
        throw new Error("Please enter a valid time horizon (at least 1 year)");
      }

      if (
        isNaN(requestData.user_profile.liquidity_needs) ||
        requestData.user_profile.liquidity_needs < 0 ||
        requestData.user_profile.liquidity_needs > 100
      ) {
        throw new Error(
          "Please enter a valid liquidity needs percentage (0-100)"
        );
      }

      // Validate holdings
      for (const holding of requestData.holdings) {
        if (isNaN(holding.quantity) || holding.quantity <= 0) {
          throw new Error(`Invalid quantity for ${holding.symbol}`);
        }
        if (isNaN(holding.current_price) || holding.current_price <= 0) {
          throw new Error(`Invalid current price for ${holding.symbol}`);
        }
        if (isNaN(holding.purchase_price) || holding.purchase_price <= 0) {
          throw new Error(`Invalid purchase price for ${holding.symbol}`);
        }
      }

      console.log(
        "Sending request data:",
        JSON.stringify(requestData, null, 2)
      );

      // Call the backend API
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_AI_URL}/analyze-portfolio`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      if (!response.ok) {
        // Try to get more detailed error information
        let errorMessage = `API Error: ${response.status} ${response.statusText}`;
        try {
          const errorData = await response.json();
          if (errorData.error || errorData.message || errorData.detail) {
            errorMessage += ` - ${
              errorData.error || errorData.message || errorData.detail
            }`;
          }
        } catch (parseErr) {
          // If we can't parse the error response, use the original message
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      setAnalysisResult(result);
      setCurrentPage("results");
    } catch (err) {
      console.error("Analysis error:", err);
      // For demo purposes, use sample data when API is not available
      if (
        err instanceof Error &&
        (err.message.includes("fetch") ||
          err.message.includes("Failed to fetch"))
      ) {
        console.log("API not available, using sample data for demo");
        setAnalysisResult(sampleAnalysis);
        setCurrentPage("results");
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to analyze portfolio. Please check your connection and try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadSampleData = () => {
    setUserData({
      age: "28",
      annual_income: "75000",
      investment_experience: "beginner",
      risk_tolerance: "aggressive",
      investment_goals: ["wealth_building"],
      time_horizon: "35",
      liquidity_needs: "5.0",
      additional_context:
        "Young professional looking to build wealth aggressively over the long term.",
    });
    setHoldings([
      {
        symbol: "TSLA",
        name: "Tesla Inc",
        asset_type: "stock",
        quantity: "10",
        current_price: "210.0",
        purchase_price: "180.0",
        purchase_date: "2024-03-01",
      },
      {
        symbol: "BTC",
        name: "Bitcoin",
        asset_type: "crypto",
        quantity: "0.15",
        current_price: "43500.0",
        purchase_price: "38000.0",
        purchase_date: "2024-01-15",
      },
    ]);
  };

  if (currentPage === "results" && analysisResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600">
        <Header onNewAnalysis={() => setCurrentPage("input")} />
        <ResultsDashboard
          analysisResult={analysisResult}
          holdings={holdings}
          onNewAnalysis={() => setCurrentPage("input")}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600">
      <Header />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <HeroSection />

        {/* Input Form */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-blue-500/30 p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
            <DollarSign className="w-6 h-6 text-green-300" />
            Investment Profile & Holdings
          </h3>

          {/* User Profile Section */}
          <UserProfileForm userData={userData} setUserData={setUserData} />

          {/* Holdings Section */}
          <HoldingsForm holdings={holdings} setHoldings={setHoldings} />

          {/* Sample Data Button */}
          <div className="text-center mb-8">
            <button
              onClick={loadSampleData}
              className="px-8 py-3 bg-white/15 hover:bg-white/25 text-white rounded-xl transition-all duration-300 font-semibold border border-blue-500/30"
            >
              Load Sample Data
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-8 bg-red-500/20 backdrop-blur-sm rounded-xl border border-red-500/30 p-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-red-300" />
                <div>
                  <h4 className="text-lg font-semibold text-red-300">
                    Analysis Error
                  </h4>
                  <p className="text-red-200">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Analyze Button */}
          <div className="text-center">
            <button
              onClick={handleAnalyze}
              disabled={!userData.age || holdings.length === 0 || isLoading}
              className="px-12 py-4 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
            >
              <div className="flex items-center gap-3">
                {isLoading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Analyzing Portfolio...
                  </>
                ) : (
                  <>
                    <Brain className="w-6 h-6" />
                    Analyze My Portfolio
                    <ArrowRight className="w-6 h-6" />
                  </>
                )}
              </div>
            </button>

            {(!userData.age || holdings.length === 0) && (
              <p className="text-blue-300 text-sm mt-3">
                Please fill in your age and add at least one holding to continue
              </p>
            )}
          </div>
        </div>

        <FeaturesSection />
      </div>
    </div>
  );
};

export default LysaInvestmentAdvisor;
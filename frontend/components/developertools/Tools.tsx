"use client"

import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, BarChart3, Zap, Brain, Target, ChevronRight, Copy, Check } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

// Type definitions
interface ApiResult {
  result?: any;
  error?: string;
  call_price?: number;
  put_price?: number;
}

interface ResultsState {
  [key: string]: ApiResult;
}

interface LoadingState {
  [key: string]: boolean;
}

interface Category {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const Tools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('linear');
  const [results, setResults] = useState<ResultsState>({});
  const [loading, setLoading] = useState<LoadingState>({});
  const [copied, setCopied] = useState<string>('');

  const copyToClipboard = (text: string, id: string): void => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(''), 2000);
  };

  const apiCall = async (endpoint: string, data: any, resultKey: string): Promise<void> => {
    setLoading(prev => ({ ...prev, [resultKey]: true }));
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      setResults(prev => ({ ...prev, [resultKey]: result }));
    } catch (error) {
      console.error('API Error:', error);
      setResults(prev => ({ ...prev, [resultKey]: { error: 'Failed to fetch data' } }));
    } finally {
      setLoading(prev => ({ ...prev, [resultKey]: false }));
    }
  };

  const formatMatrix = (matrix: any): string => {
    if (!Array.isArray(matrix)) return JSON.stringify(matrix);
    return matrix.map(row => `[${row.map((val: number) => val.toFixed(3)).join(', ')}]`).join('\n');
  };

  const getInputValue = (id: string): string => {
    const element = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    return element?.value || '';
  };

  const categories: Category[] = [
    { id: 'linear', name: 'Linear Algebra', icon: Calculator, color: 'from-blue-500 to-cyan-500' },
    { id: 'stats', name: 'Statistics', icon: BarChart3, color: 'from-purple-500 to-pink-500' },
    { id: 'dist', name: 'Distributions', icon: TrendingUp, color: 'from-green-500 to-emerald-500' },
    { id: 'timeseries', name: 'Time Series', icon: Zap, color: 'from-orange-500 to-red-500' },
    { id: 'opt', name: 'Optimization', icon: Target, color: 'from-indigo-500 to-blue-500' },
    { id: 'finmath', name: 'Financial Math', icon: Brain, color: 'from-yellow-500 to-orange-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/10 backdrop-blur-sm border-b border-blue-500/30">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
                Quantamental
              </h1>
            </div>
            <div className="text-sm text-blue-200">
              Advanced Mathematical & Financial Computing
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6">
            Mathematical Computing
            <span className="bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
              {' '}Made Simple
            </span>
          </h2>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto mb-8">
            Powerful APIs for linear algebra, statistics, financial mathematics, and more. 
            Built for researchers, analysts, and developers who need reliable mathematical computing.
          </p>
        </div>
      </section>

      {/* Navigation */}
      <div className="px-6 mb-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map(category => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveTab(category.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${
                    activeTab === category.id 
                      ? 'bg-white/20 text-white shadow-lg' 
                      : 'bg-white/10 text-blue-200 hover:bg-white/15 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="px-6 pb-20">
        <div className="mx-auto max-w-7xl">
          
          {/* Linear Algebra */}
          {activeTab === 'linear' && (
            <div className="grid gap-8 md:grid-cols-2">
              {/* Matrix Multiplication */}
              <div className="bg-white/10 backdrop-blur-sm border border-blue-500/30 rounded-xl p-6 shadow-lg hover:shadow-xl hover:bg-white/15 transition-all duration-300">
                <h3 className="text-xl font-bold text-white mb-4">Matrix Multiplication</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-blue-200 mb-2">Matrix A</label>
                    <textarea
                      className="w-full p-3 bg-white/5 border border-blue-500/30 rounded-lg text-white placeholder-blue-300"
                      placeholder="[[1, 2, 3], [4, 5, 6]]"
                      rows={3}
                      id="matrixA"
                    />
                  </div>
                  <div>
                    <label className="block text-blue-200 mb-2">Matrix B</label>
                    <textarea
                      className="w-full p-3 bg-white/5 border border-blue-500/30 rounded-lg text-white placeholder-blue-300"
                      placeholder="[[7, 8], [9, 10], [11, 12]]"
                      rows={3}
                      id="matrixB"
                    />
                  </div>
                  <button
                    onClick={() => {
                      try {
                        const matrixA = JSON.parse(getInputValue('matrixA') || '[[1, 2, 3], [4, 5, 6]]');
                        const matrixB = JSON.parse(getInputValue('matrixB') || '[[7, 8], [9, 10], [11, 12]]');
                        apiCall('/api/linear/matrix-multiply', { matrix_a: matrixA, matrix_b: matrixB }, 'matrixMult');
                      } catch (e) {
                        setResults(prev => ({ ...prev, matrixMult: { error: 'Invalid matrix format' } }));
                      }
                    }}
                    disabled={loading.matrixMult}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-300 disabled:opacity-50"
                  >
                    {loading.matrixMult ? 'Computing...' : 'Multiply Matrices'}
                  </button>
                  {results.matrixMult && (
                    <div className="bg-white/5 border border-blue-500/20 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-blue-200 font-medium">Result:</span>
                        <button
                          onClick={() => copyToClipboard(JSON.stringify(results.matrixMult.result || results.matrixMult.error), 'matrixMult')}
                          className="text-blue-300 hover:text-white transition-colors"
                        >
                          {copied === 'matrixMult' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      <pre className="text-white text-sm font-mono whitespace-pre-wrap">
                        {results.matrixMult.error || formatMatrix(results.matrixMult.result)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>

              {/* Matrix Inverse */}
              <div className="bg-white/10 backdrop-blur-sm border border-blue-500/30 rounded-xl p-6 shadow-lg hover:shadow-xl hover:bg-white/15 transition-all duration-300">
                <h3 className="text-xl font-bold text-white mb-4">Matrix Inverse</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-blue-200 mb-2">Square Matrix</label>
                    <textarea
                      className="w-full p-3 bg-white/5 border border-blue-500/30 rounded-lg text-white placeholder-blue-300"
                      placeholder="[[4, 7], [2, 6]]"
                      rows={3}
                      id="matrixInv"
                    />
                  </div>
                  <button
                    onClick={() => {
                      try {
                        const matrix = JSON.parse(getInputValue('matrixInv') || '[[4, 7], [2, 6]]');
                        apiCall('/api/linear/matrix-inverse', { matrix }, 'matrixInv');
                      } catch (e) {
                        setResults(prev => ({ ...prev, matrixInv: { error: 'Invalid matrix format' } }));
                      }
                    }}
                    disabled={loading.matrixInv}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-300 disabled:opacity-50"
                  >
                    {loading.matrixInv ? 'Computing...' : 'Calculate Inverse'}
                  </button>
                  {results.matrixInv && (
                    <div className="bg-white/5 border border-blue-500/20 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-blue-200 font-medium">Result:</span>
                        <button
                          onClick={() => copyToClipboard(JSON.stringify(results.matrixInv.result || results.matrixInv.error), 'matrixInv')}
                          className="text-blue-300 hover:text-white transition-colors"
                        >
                          {copied === 'matrixInv' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      <pre className="text-white text-sm font-mono whitespace-pre-wrap">
                        {results.matrixInv.error || formatMatrix(results.matrixInv.result)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Statistics */}
          {activeTab === 'stats' && (
            <div className="grid gap-8 md:grid-cols-2">
              {/* Descriptive Statistics */}
              <div className="bg-white/10 backdrop-blur-sm border border-blue-500/30 rounded-xl p-6 shadow-lg hover:shadow-xl hover:bg-white/15 transition-all duration-300">
                <h3 className="text-xl font-bold text-white mb-4">Descriptive Statistics</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-blue-200 mb-2">Data Array</label>
                    <textarea
                      className="w-full p-3 bg-white/5 border border-blue-500/30 rounded-lg text-white placeholder-blue-300"
                      placeholder="[1.2, 2.3, 3.4, 4.5, 5.6, 6.7, 7.8, 8.9, 9.1, 10.2]"
                      rows={3}
                      id="statsData"
                    />
                  </div>
                  <button
                    onClick={() => {
                      try {
                        const data = JSON.parse(getInputValue('statsData') || '[1.2, 2.3, 3.4, 4.5, 5.6, 6.7, 7.8, 8.9, 9.1, 10.2]');
                        apiCall('/api/stats/descriptive', { data }, 'descriptiveStats');
                      } catch (e) {
                        setResults(prev => ({ ...prev, descriptiveStats: { error: 'Invalid data format' } }));
                      }
                    }}
                    disabled={loading.descriptiveStats}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all duration-300 disabled:opacity-50"
                  >
                    {loading.descriptiveStats ? 'Computing...' : 'Calculate Statistics'}
                  </button>
                  {results.descriptiveStats && (
                    <div className="bg-white/5 border border-blue-500/20 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-blue-200 font-medium">Result:</span>
                        <button
                          onClick={() => copyToClipboard(JSON.stringify(results.descriptiveStats.result || results.descriptiveStats.error), 'descriptiveStats')}
                          className="text-blue-300 hover:text-white transition-colors"
                        >
                          {copied === 'descriptiveStats' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      <div className="text-white text-sm space-y-1">
                        {results.descriptiveStats.error ? (
                          <div className="text-red-300">{results.descriptiveStats.error}</div>
                        ) : (
                          results.descriptiveStats.result && Object.entries(results.descriptiveStats.result).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="capitalize text-blue-200">{key.replace('_', ' ')}:</span>
                              <span>{typeof value === 'number' ? value.toFixed(4) : String(value)}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Correlation */}
              <div className="bg-white/10 backdrop-blur-sm border border-blue-500/30 rounded-xl p-6 shadow-lg hover:shadow-xl hover:bg-white/15 transition-all duration-300">
                <h3 className="text-xl font-bold text-white mb-4">Correlation Analysis</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-blue-200 mb-2">Data X</label>
                    <textarea
                      className="w-full p-3 bg-white/5 border border-blue-500/30 rounded-lg text-white placeholder-blue-300"
                      placeholder="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
                      rows={2}
                      id="dataX"
                    />
                  </div>
                  <div>
                    <label className="block text-blue-200 mb-2">Data Y</label>
                    <textarea
                      className="w-full p-3 bg-white/5 border border-blue-500/30 rounded-lg text-white placeholder-blue-300"
                      placeholder="[2.1, 3.9, 6.2, 7.8, 10.1, 12.3, 13.9, 16.2, 18.1, 20.3]"
                      rows={2}
                      id="dataY"
                    />
                  </div>
                  <button
                    onClick={() => {
                      try {
                        const data_x = JSON.parse(getInputValue('dataX') || '[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]');
                        const data_y = JSON.parse(getInputValue('dataY') || '[2.1, 3.9, 6.2, 7.8, 10.1, 12.3, 13.9, 16.2, 18.1, 20.3]');
                        apiCall('/api/stats/correlation', { data_x, data_y }, 'correlation');
                      } catch (e) {
                        setResults(prev => ({ ...prev, correlation: { error: 'Invalid data format' } }));
                      }
                    }}
                    disabled={loading.correlation}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all duration-300 disabled:opacity-50"
                  >
                    {loading.correlation ? 'Computing...' : 'Calculate Correlation'}
                  </button>
                  {results.correlation && (
                    <div className="bg-white/5 border border-blue-500/20 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-blue-200 font-medium">Correlation Coefficient:</span>
                        <button
                          onClick={() => copyToClipboard(JSON.stringify(results.correlation.result || results.correlation.error), 'correlation')}
                          className="text-blue-300 hover:text-white transition-colors"
                        >
                          {copied === 'correlation' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      <div className="text-white text-lg font-mono">
                        {results.correlation.error || (typeof results.correlation.result === 'number' ? results.correlation.result.toFixed(6) : String(results.correlation.result))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Distributions */}
          {activeTab === 'dist' && (
            <div className="grid gap-8 md:grid-cols-2">
              {/* Normal PDF */}
              <div className="bg-white/10 backdrop-blur-sm border border-blue-500/30 rounded-xl p-6 shadow-lg hover:shadow-xl hover:bg-white/15 transition-all duration-300">
                <h3 className="text-xl font-bold text-white mb-4">Normal Distribution PDF</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-blue-200 mb-2">X Value</label>
                      <input
                        type="number"
                        step="0.01"
                        defaultValue="1.5"
                        className="w-full p-3 bg-white/5 border border-blue-500/30 rounded-lg text-white placeholder-blue-300"
                        id="normalX"
                      />
                    </div>
                    <div>
                      <label className="block text-blue-200 mb-2">Mean</label>
                      <input
                        type="number"
                        step="0.01"
                        defaultValue="0"
                        className="w-full p-3 bg-white/5 border border-blue-500/30 rounded-lg text-white placeholder-blue-300"
                        id="normalMean"
                      />
                    </div>
                    <div>
                      <label className="block text-blue-200 mb-2">Std Dev</label>
                      <input
                        type="number"
                        step="0.01"
                        defaultValue="1"
                        className="w-full p-3 bg-white/5 border border-blue-500/30 rounded-lg text-white placeholder-blue-300"
                        id="normalStd"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const x = parseFloat(getInputValue('normalX') || '1.5');
                      const mean = parseFloat(getInputValue('normalMean') || '0');
                      const std = parseFloat(getInputValue('normalStd') || '1');
                      apiCall('/api/dist/normal-pdf', { x, mean, std }, 'normalPDF');
                    }}
                    disabled={loading.normalPDF}
                    className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition-all duration-300 disabled:opacity-50"
                  >
                    {loading.normalPDF ? 'Computing...' : 'Calculate PDF'}
                  </button>
                  {results.normalPDF && (
                    <div className="bg-white/5 border border-blue-500/20 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-blue-200 font-medium">PDF Result:</span>
                        <button
                          onClick={() => copyToClipboard(JSON.stringify(results.normalPDF.result || results.normalPDF.error), 'normalPDF')}
                          className="text-blue-300 hover:text-white transition-colors"
                        >
                          {copied === 'normalPDF' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      <div className="text-white text-lg font-mono">
                        {results.normalPDF.error || (typeof results.normalPDF.result === 'number' ? results.normalPDF.result.toFixed(8) : String(results.normalPDF.result))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Normal CDF */}
              <div className="bg-white/10 backdrop-blur-sm border border-blue-500/30 rounded-xl p-6 shadow-lg hover:shadow-xl hover:bg-white/15 transition-all duration-300">
                <h3 className="text-xl font-bold text-white mb-4">Normal Distribution CDF</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-blue-200 mb-2">X Value</label>
                      <input
                        type="number"
                        step="0.01"
                        defaultValue="1.96"
                        className="w-full p-3 bg-white/5 border border-blue-500/30 rounded-lg text-white placeholder-blue-300"
                        id="normalCDFX"
                      />
                    </div>
                    <div>
                      <label className="block text-blue-200 mb-2">Mean</label>
                      <input
                        type="number"
                        step="0.01"
                        defaultValue="0"
                        className="w-full p-3 bg-white/5 border border-blue-500/30 rounded-lg text-white placeholder-blue-300"
                        id="normalCDFMean"
                      />
                    </div>
                    <div>
                      <label className="block text-blue-200 mb-2">Std Dev</label>
                      <input
                        type="number"
                        step="0.01"
                        defaultValue="1"
                        className="w-full p-3 bg-white/5 border border-blue-500/30 rounded-lg text-white placeholder-blue-300"
                        id="normalCDFStd"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const x = parseFloat(getInputValue('normalCDFX') || '1.96');
                      const mean = parseFloat(getInputValue('normalCDFMean') || '0');
                      const std = parseFloat(getInputValue('normalCDFStd') || '1');
                      apiCall('/api/dist/normal-cdf', { x, mean, std }, 'normalCDF');
                    }}
                    disabled={loading.normalCDF}
                    className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition-all duration-300 disabled:opacity-50"
                  >
                    {loading.normalCDF ? 'Computing...' : 'Calculate CDF'}
                  </button>
                  {results.normalCDF && (
                    <div className="bg-white/5 border border-blue-500/20 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-blue-200 font-medium">CDF Result:</span>
                        <button
                          onClick={() => copyToClipboard(JSON.stringify(results.normalCDF.result || results.normalCDF.error), 'normalCDF')}
                          className="text-blue-300 hover:text-white transition-colors"
                        >
                          {copied === 'normalCDF' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      <div className="text-white text-lg font-mono">
                        {results.normalCDF.error || (typeof results.normalCDF.result === 'number' ? results.normalCDF.result.toFixed(8) : String(results.normalCDF.result))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Time Series */}
          {activeTab === 'timeseries' && (
            <div className="grid gap-8 md:grid-cols-2">
              {/* Moving Average */}
              <div className="bg-white/10 backdrop-blur-sm border border-blue-500/30 rounded-xl p-6 shadow-lg hover:shadow-xl hover:bg-white/15 transition-all duration-300">
                <h3 className="text-xl font-bold text-white mb-4">Moving Average</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-blue-200 mb-2">Time Series Data</label>
                    <textarea
                      className="w-full p-3 bg-white/5 border border-blue-500/30 rounded-lg text-white placeholder-blue-300"
                      placeholder="[100, 102, 98, 105, 107, 103, 99, 101, 104, 106, 108, 102]"
                      rows={3}
                      id="tsData"
                    />
                  </div>
                  <div>
                    <label className="block text-blue-200 mb-2">Window Size</label>
                    <input
                      type="number"
                      defaultValue="3"
                      className="w-full p-3 bg-white/5 border border-blue-500/30 rounded-lg text-white placeholder-blue-300"
                      id="tsWindow"
                    />
                  </div>
                  <button
                    onClick={() => {
                      try {
                        const data = JSON.parse(getInputValue('tsData') || '[100, 102, 98, 105, 107, 103, 99, 101, 104, 106, 108, 102]');
                        const window = parseInt(getInputValue('tsWindow') || '3');
                        apiCall('/api/timeseries/moving-average', { data, window }, 'movingAvg');
                      } catch (e) {
                        setResults(prev => ({ ...prev, movingAvg: { error: 'Invalid data format' } }));
                      }
                    }}
                    disabled={loading.movingAvg}
                    className="w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-lg transition-all duration-300 disabled:opacity-50"
                  >
                    {loading.movingAvg ? 'Computing...' : 'Calculate Moving Average'}
                  </button>
                  {results.movingAvg && (
                    <div className="bg-white/5 border border-blue-500/20 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-blue-200 font-medium">Moving Average:</span>
                        <button
                          onClick={() => copyToClipboard(JSON.stringify(results.movingAvg.result || results.movingAvg.error), 'movingAvg')}
                          className="text-blue-300 hover:text-white transition-colors"
                        >
                          {copied === 'movingAvg' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      <div className="text-white text-sm font-mono max-h-40 overflow-y-auto">
                        {results.movingAvg.error || 
                         (Array.isArray(results.movingAvg.result) ? 
                          results.movingAvg.result.map((val: number) => val.toFixed(3)).join(', ') : 
                          JSON.stringify(results.movingAvg.result))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Exponential Moving Average */}
              <div className="bg-white/10 backdrop-blur-sm border border-blue-500/30 rounded-xl p-6 shadow-lg hover:shadow-xl hover:bg-white/15 transition-all duration-300">
                <h3 className="text-xl font-bold text-white mb-4">Exponential Moving Average</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-blue-200 mb-2">Time Series Data</label>
                    <textarea
                      className="w-full p-3 bg-white/5 border border-blue-500/30 rounded-lg text-white placeholder-blue-300"
                      placeholder="[100, 102, 98, 105, 107, 103, 99, 101, 104, 106, 108, 102]"
                      rows={3}
                      id="emaData"
                    />
                  </div>
                  <div>
                    <label className="block text-blue-200 mb-2">Alpha (Smoothing Factor)</label>
                    <input
                      type="number"
                      step="0.01"
                      defaultValue="0.3"
                      className="w-full p-3 bg-white/5 border border-blue-500/30 rounded-lg text-white placeholder-blue-300"
                      id="emaAlpha"
                    />
                  </div>
                  <button
                    onClick={() => {
                      try {
                        const data = JSON.parse(getInputValue('emaData') || '[100, 102, 98, 105, 107, 103, 99, 101, 104, 106, 108, 102]');
                        const alpha = parseFloat(getInputValue('emaAlpha') || '0.3');
                        apiCall('/api/timeseries/exponential-average', { data, alpha }, 'expMovingAvg');
                      } catch (e) {
                        setResults(prev => ({ ...prev, expMovingAvg: { error: 'Invalid data format' } }));
                      }
                    }}
                    disabled={loading.expMovingAvg}
                    className="w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-lg transition-all duration-300 disabled:opacity-50"
                  >
                    {loading.expMovingAvg ? 'Computing...' : 'Calculate EMA'}
                  </button>
                  {results.expMovingAvg && (
                    <div className="bg-white/5 border border-blue-500/20 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-blue-200 font-medium">EMA Result:</span>
                        <button
                          onClick={() => copyToClipboard(JSON.stringify(results.expMovingAvg.result || results.expMovingAvg.error), 'expMovingAvg')}
                          className="text-blue-300 hover:text-white transition-colors"
                        >
                          {copied === 'expMovingAvg' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      <div className="text-white text-sm font-mono max-h-40 overflow-y-auto">
                        {results.expMovingAvg.error || 
                         (Array.isArray(results.expMovingAvg.result) ? 
                          results.expMovingAvg.result.map((val: number) => val.toFixed(3)).join(', ') : 
                          JSON.stringify(results.expMovingAvg.result))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Optimization */}
          {activeTab === 'opt' && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm border border-blue-500/30 rounded-xl p-6 shadow-lg hover:shadow-xl hover:bg-white/15 transition-all duration-300">
                <h3 className="text-xl font-bold text-white mb-4">Golden Section Optimization</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-blue-200 mb-2">Function Type</label>
                    <select
                      className="w-full p-3 bg-white/5 border border-blue-500/30 rounded-lg text-white"
                      id="optFunction"
                    >
                      <option value="quadratic">Quadratic Function</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-blue-200 mb-2">Lower Bound</label>
                      <input
                        type="number"
                        step="0.001"
                        defaultValue="0"
                        className="w-full p-3 bg-white/5 border border-blue-500/30 rounded-lg text-white"
                        id="optLower"
                      />
                    </div>
                    <div>
                      <label className="block text-blue-200 mb-2">Upper Bound</label>
                      <input
                        type="number"
                        step="0.001"
                        defaultValue="5"
                        className="w-full p-3 bg-white/5 border border-blue-500/30 rounded-lg text-white"
                        id="optUpper"
                      />
                    </div>
                    <div>
                      <label className="block text-blue-200 mb-2">Tolerance</label>
                      <input
                        type="number"
                        step="0.0001"
                        defaultValue="0.001"
                        className="w-full p-3 bg-white/5 border border-blue-500/30 rounded-lg text-white"
                        id="optTolerance"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const func = getInputValue('optFunction');
                      const lower = parseFloat(getInputValue('optLower') || '0');
                      const upper = parseFloat(getInputValue('optUpper') || '5');
                      const tolerance = parseFloat(getInputValue('optTolerance') || '0.001');
                      apiCall('/api/opt/golden-section', { function: func, lower, upper, tolerance }, 'optimization');
                    }}
                    disabled={loading.optimization}
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-lg transition-all duration-300 disabled:opacity-50"
                  >
                    {loading.optimization ? 'Computing...' : 'Optimize Function'}
                  </button>
                  {results.optimization && (
                    <div className="bg-white/5 border border-blue-500/20 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-blue-200 font-medium">Optimal Value:</span>
                        <button
                          onClick={() => copyToClipboard(JSON.stringify(results.optimization.result || results.optimization.error), 'optimization')}
                          className="text-blue-300 hover:text-white transition-colors"
                        >
                          {copied === 'optimization' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      <div className="text-white text-lg font-mono">
                        {results.optimization.error || (typeof results.optimization.result === 'number' ? results.optimization.result.toFixed(8) : String(results.optimization.result))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Financial Mathematics */}
          {activeTab === 'finmath' && (
            <div className="grid gap-8 md:grid-cols-2">
              {/* Black-Scholes */}
              <div className="bg-white/10 backdrop-blur-sm border border-blue-500/30 rounded-xl p-6 shadow-lg hover:shadow-xl hover:bg-white/15 transition-all duration-300">
                <h3 className="text-xl font-bold text-white mb-4">Black-Scholes Option Pricing</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-blue-200 mb-2">Spot Price</label>
                      <input
                        type="number"
                        step="0.01"
                        defaultValue="100"
                        className="w-full p-3 bg-white/5 border border-blue-500/30 rounded-lg text-white"
                        id="bsSpot"
                      />
                    </div>
                    <div>
                      <label className="block text-blue-200 mb-2">Strike Price</label>
                      <input
                        type="number"
                        step="0.01"
                        defaultValue="105"
                        className="w-full p-3 bg-white/5 border border-blue-500/30 rounded-lg text-white"
                        id="bsStrike"
                      />
                    </div>
                    <div>
                      <label className="block text-blue-200 mb-2">Time to Expiry</label>
                      <input
                        type="number"
                        step="0.01"
                        defaultValue="0.25"
                        className="w-full p-3 bg-white/5 border border-blue-500/30 rounded-lg text-white"
                        id="bsTime"
                      />
                    </div>
                    <div>
                      <label className="block text-blue-200 mb-2">Risk-Free Rate</label>
                      <input
                        type="number"
                        step="0.001"
                        defaultValue="0.05"
                        className="w-full p-3 bg-white/5 border border-blue-500/30 rounded-lg text-white"
                        id="bsRate"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-blue-200 mb-2">Volatility</label>
                    <input
                      type="number"
                      step="0.01"
                      defaultValue="0.2"
                      className="w-full p-3 bg-white/5 border border-blue-500/30 rounded-lg text-white"
                      id="bsVolatility"
                    />
                  </div>
                  <button
                    onClick={() => {
                      const spot_price = parseFloat(getInputValue('bsSpot') || '100');
                      const strike_price = parseFloat(getInputValue('bsStrike') || '105');
                      const time_to_expiry = parseFloat(getInputValue('bsTime') || '0.25');
                      const risk_free_rate = parseFloat(getInputValue('bsRate') || '0.05');
                      const volatility = parseFloat(getInputValue('bsVolatility') || '0.2');
                      apiCall('/api/finmath/black-scholes', { 
                        spot_price, strike_price, time_to_expiry, risk_free_rate, volatility 
                      }, 'blackScholes');
                    }}
                    disabled={loading.blackScholes}
                    className="w-full py-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white rounded-lg transition-all duration-300 disabled:opacity-50"
                  >
                    {loading.blackScholes ? 'Computing...' : 'Calculate Option Prices'}
                  </button>
                  {results.blackScholes && (
                    <div className="bg-white/5 border border-blue-500/20 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-blue-200 font-medium">Option Prices:</span>
                        <button
                          onClick={() => copyToClipboard(JSON.stringify(results.blackScholes), 'blackScholes')}
                          className="text-blue-300 hover:text-white transition-colors"
                        >
                          {copied === 'blackScholes' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      <div className="text-white text-sm space-y-1">
                        {results.blackScholes.error ? (
                          <div className="text-red-300">{results.blackScholes.error}</div>
                        ) : (
                          <>
                            <div className="flex justify-between">
                              <span className="text-blue-200">Call Price:</span>
                              <span>{results.blackScholes.call_price?.toFixed(6)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-blue-200">Put Price:</span>
                              <span>{results.blackScholes.put_price?.toFixed(6)}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Implied Volatility */}
              <div className="bg-white/10 backdrop-blur-sm border border-blue-500/30 rounded-xl p-6 shadow-lg hover:shadow-xl hover:bg-white/15 transition-all duration-300">
                <h3 className="text-xl font-bold text-white mb-4">Implied Volatility</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-blue-200 mb-2">Spot Price</label>
                      <input
                        type="number"
                        step="0.01"
                        defaultValue="100"
                        className="w-full p-3 bg-white/5 border border-blue-500/30 rounded-lg text-white"
                        id="ivSpot"
                      />
                    </div>
                    <div>
                      <label className="block text-blue-200 mb-2">Strike Price</label>
                      <input
                        type="number"
                        step="0.01"
                        defaultValue="105"
                        className="w-full p-3 bg-white/5 border border-blue-500/30 rounded-lg text-white"
                        id="ivStrike"
                      />
                    </div>
                    <div>
                      <label className="block text-blue-200 mb-2">Time to Expiry</label>
                      <input
                        type="number"
                        step="0.01"
                        defaultValue="0.25"
                        className="w-full p-3 bg-white/5 border border-blue-500/30 rounded-lg text-white"
                        id="ivTime"
                      />
                    </div>
                    <div>
                      <label className="block text-blue-200 mb-2">Risk-Free Rate</label>
                      <input
                        type="number"
                        step="0.001"
                        defaultValue="0.05"
                        className="w-full p-3 bg-white/5 border border-blue-500/30 rounded-lg text-white"
                        id="ivRate"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-blue-200 mb-2">Market Price</label>
                      <input
                        type="number"
                        step="0.01"
                        defaultValue="2.5"
                        className="w-full p-3 bg-white/5 border border-blue-500/30 rounded-lg text-white"
                        id="ivMarketPrice"
                      />
                    </div>
                    <div>
                      <label className="block text-blue-200 mb-2">Option Type</label>
                      <select
                        className="w-full p-3 bg-white/5 border border-blue-500/30 rounded-lg text-white"
                        id="ivIsCall"
                      >
                        <option value="true">Call Option</option>
                        <option value="false">Put Option</option>
                      </select>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const spot_price = parseFloat(getInputValue('ivSpot') || '100');
                      const strike_price = parseFloat(getInputValue('ivStrike') || '105');
                      const time_to_expiry = parseFloat(getInputValue('ivTime') || '0.25');
                      const risk_free_rate = parseFloat(getInputValue('ivRate') || '0.05');
                      const market_price = parseFloat(getInputValue('ivMarketPrice') || '2.5');
                      const is_call = getInputValue('ivIsCall') === 'true';
                      apiCall('/api/finmath/implied-volatility', { 
                        spot_price, strike_price, time_to_expiry, risk_free_rate, market_price, is_call
                      }, 'impliedVol');
                    }}
                    disabled={loading.impliedVol}
                    className="w-full py-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white rounded-lg transition-all duration-300 disabled:opacity-50"
                  >
                    {loading.impliedVol ? 'Computing...' : 'Calculate Implied Volatility'}
                  </button>
                  {results.impliedVol && (
                    <div className="bg-white/5 border border-blue-500/20 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-blue-200 font-medium">Implied Volatility:</span>
                        <button
                          onClick={() => copyToClipboard(JSON.stringify(results.impliedVol.result || results.impliedVol.error), 'impliedVol')}
                          className="text-blue-300 hover:text-white transition-colors"
                        >
                          {copied === 'impliedVol' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      <div className="text-white text-lg font-mono">
                        {results.impliedVol.error || (typeof results.impliedVol.result === 'number' ? 
                         (results.impliedVol.result * 100).toFixed(4) + '%' : String(results.impliedVol.result))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/5 border-t border-blue-500/30 py-8">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-blue-200">
            Powered by Quantamental
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Tools;
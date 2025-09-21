"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AIService, ProductivityInsight } from "@/lib/ai-service";
import { Todo } from "@/components/todo/todo-item";
import { Brain, TrendingUp, AlertTriangle, Lightbulb, RefreshCw, Loader2 } from "lucide-react";

interface AIInsightsProps {
  todos: Todo[];
}

export function AIInsights({ todos }: AIInsightsProps) {
  const [insights, setInsights] = useState<ProductivityInsight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const generateInsights = useCallback(async () => {
    setIsLoading(true);
    try {
      const newInsights = await AIService.generateProductivityInsights(todos);
      setInsights(newInsights);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to generate insights:", error);
    } finally {
      setIsLoading(false);
    }
  }, [todos]);

  // Auto-generate insights when todos change significantly
  useEffect(() => {
    if (todos.length > 0 && todos.length % 5 === 0) {
      generateInsights();
    }
  }, [todos.length, generateInsights]);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />;
      case 'tip':
        return <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
      default:
        return <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'tip':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      default:
        return 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800';
    }
  };

  const getInsightTextColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-green-800 dark:text-green-200';
      case 'warning':
        return 'text-yellow-800 dark:text-yellow-200';
      case 'tip':
        return 'text-blue-800 dark:text-blue-200';
      default:
        return 'text-purple-800 dark:text-purple-200';
    }
  };

  if (todos.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* AI Insights Header */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-300"></div>
        
        <Card className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-3xl shadow-xl">
          <CardHeader className="pb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg">
                  <Brain className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                    AI Productivity Insights
                  </CardTitle>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Intelligent analysis of your work patterns
                  </p>
                </div>
              </div>
              
              <Button
                onClick={generateInsights}
                disabled={isLoading}
                size="sm"
                className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-xl px-4 py-2 font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            {lastUpdated && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </CardHeader>
        </Card>
      </div>

      {/* Insights List */}
      {insights.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-500" />
            Your Productivity Analysis
          </h3>
          
          <div className="grid gap-4">
            {insights.map((insight, index) => (
              <div 
                key={index}
                className="group relative animate-in slide-in-from-bottom-4 fade-in duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`relative rounded-2xl border p-6 shadow-lg hover:shadow-xl transition-all duration-300 ${getInsightColor(insight.type)}`}>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getInsightIcon(insight.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className={`font-semibold ${getInsightTextColor(insight.type)}`}>
                          {insight.title}
                        </h4>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            insight.type === 'success' ? 'border-green-300 text-green-700 dark:border-green-700 dark:text-green-300' :
                            insight.type === 'warning' ? 'border-yellow-300 text-yellow-700 dark:border-yellow-700 dark:text-yellow-300' :
                            insight.type === 'tip' ? 'border-blue-300 text-blue-700 dark:border-blue-700 dark:text-blue-300' :
                            'border-purple-300 text-purple-700 dark:border-purple-700 dark:text-purple-300'
                          }`}
                        >
                          {insight.type.charAt(0).toUpperCase() + insight.type.slice(1)}
                        </Badge>
                      </div>
                      
                      <p className={`text-sm leading-relaxed ${getInsightTextColor(insight.type)} opacity-90`}>
                        {insight.message}
                      </p>
                      
                      {insight.action && (
                        <div className="mt-3 p-3 bg-white/50 dark:bg-black/20 rounded-xl">
                          <p className={`text-sm font-medium ${getInsightTextColor(insight.type)}`}>
                            💡 Action: {insight.action}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="flex items-center justify-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            <span className="text-slate-600 dark:text-slate-400">
              Analyzing your productivity patterns...
            </span>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && insights.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-600 flex items-center justify-center">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">
            Ready for AI Insights
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Complete a few more tasks to get personalized productivity insights
          </p>
          <Button
            onClick={generateInsights}
            className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-xl px-6 py-2 font-medium shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Generate Insights Now
          </Button>
        </div>
      )}
    </div>
  );
}

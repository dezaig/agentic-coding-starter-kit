"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AIService, ProductivityInsight, SmartSchedule } from "@/lib/ai-service";
import { Todo } from "@/components/todo/todo-item";
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb, 
  RefreshCw, 
  Loader2,
  Clock,
  Target,
  Zap
} from "lucide-react";

interface AIDashboardInsightsProps {
  todos: Todo[];
}

export function AIDashboardInsights({ todos }: AIDashboardInsightsProps) {
  const [insights, setInsights] = useState<ProductivityInsight[]>([]);
  const [schedules, setSchedules] = useState<SmartSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'insights' | 'scheduling'>('insights');

  const generateInsights = useCallback(async () => {
    setIsLoading(true);
    try {
      const [newInsights, newSchedules] = await Promise.all([
        AIService.generateProductivityInsights(todos),
        AIService.suggestSmartScheduling(todos)
      ]);
      setInsights(newInsights);
      setSchedules(newSchedules);
    } catch (error) {
      console.error("Failed to generate insights:", error);
    } finally {
      setIsLoading(false);
    }
  }, [todos]);

  // Auto-generate insights when todos change significantly
  useEffect(() => {
    if (todos.length > 0 && todos.length % 3 === 0) {
      generateInsights();
    }
  }, [todos.length, generateInsights]);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />;
      case 'tip':
        return <Lightbulb className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
      default:
        return <Brain className="h-4 w-4 text-purple-600 dark:text-purple-400" />;
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

  if (todos.length === 0) {
    return null;
  }

  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-300"></div>
      
      <Card className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-3xl shadow-xl">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg">
                <Brain className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                  AI Dashboard Assistant
                </CardTitle>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Intelligent insights and scheduling recommendations
                </p>
              </div>
            </div>
            
            <Button
              onClick={generateInsights}
              disabled={isLoading}
              size="sm"
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl px-4 py-2 font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex gap-2 mt-4">
            <Button
              onClick={() => setActiveTab('insights')}
              variant={activeTab === 'insights' ? 'default' : 'outline'}
              size="sm"
              className={`rounded-xl px-4 py-2 font-medium transition-all duration-200 ${
                activeTab === 'insights' 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg' 
                  : 'border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <Target className="h-4 w-4 mr-2" />
              Insights
            </Button>
            <Button
              onClick={() => setActiveTab('scheduling')}
              variant={activeTab === 'scheduling' ? 'default' : 'outline'}
              size="sm"
              className={`rounded-xl px-4 py-2 font-medium transition-all duration-200 ${
                activeTab === 'scheduling' 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg' 
                  : 'border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <Clock className="h-4 w-4 mr-2" />
              Scheduling
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Insights Tab */}
          {activeTab === 'insights' && (
            <div className="space-y-4">
              {insights.length > 0 ? (
                <div className="space-y-3">
                  {insights.slice(0, 3).map((insight, index) => (
                    <div 
                      key={index}
                      className={`p-4 rounded-xl border ${getInsightColor(insight.type)} animate-in slide-in-from-bottom-4 fade-in duration-300`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getInsightIcon(insight.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
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
                          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                            {insight.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Generate AI insights to get personalized productivity recommendations
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Scheduling Tab */}
          {activeTab === 'scheduling' && (
            <div className="space-y-4">
              {schedules.length > 0 ? (
                <div className="space-y-3">
                  {schedules.map((schedule, index) => (
                    <div 
                      key={index}
                      className="p-4 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 animate-in slide-in-from-bottom-4 fade-in duration-300"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                              {schedule.suggestedTime}
                            </h4>
                            <Badge variant="outline" className="text-xs border-blue-300 text-blue-700 dark:border-blue-700 dark:text-blue-300">
                              <Zap className="h-3 w-3 mr-1" />
                              AI Suggestion
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                            {schedule.reasoning}
                          </p>
                          {schedule.conflicts && schedule.conflicts.length > 0 && (
                            <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                              <p className="text-xs text-yellow-700 dark:text-yellow-300">
                                ⚠️ Potential conflicts: {schedule.conflicts.join(', ')}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Generate smart scheduling recommendations based on your tasks
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-6">
              <div className="flex items-center justify-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
                <span className="text-slate-600 dark:text-slate-400">
                  Analyzing your productivity patterns...
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

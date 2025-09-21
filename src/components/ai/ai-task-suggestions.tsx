"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AIService, TaskSuggestion } from "@/lib/ai-service";
import { Todo } from "@/components/todo/todo-item";
import { Sparkles, Plus, Clock, Tag, Loader2 } from "lucide-react";

interface AITaskSuggestionsProps {
  todos: Todo[];
  onAddSuggestion: (suggestion: TaskSuggestion) => void;
}

export function AITaskSuggestions({ todos, onAddSuggestion }: AITaskSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<TaskSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userContext, setUserContext] = useState("");

  const generateSuggestions = async () => {
    setIsLoading(true);
    try {
      const newSuggestions = await AIService.generateTaskSuggestions(todos, userContext);
      setSuggestions(newSuggestions);
    } catch (error) {
      console.error("Failed to generate suggestions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 2: return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
      case 1: return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300";
      default: return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
    }
  };

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 2: return "High";
      case 1: return "Medium";
      default: return "Low";
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Suggestions Header */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-600 rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-300"></div>
        
        <Card className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-3xl shadow-xl">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-2xl font-bold">
              <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg">
                <Sparkles className="h-6 w-6" />
              </div>
              <span className="bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                AI Task Suggestions
              </span>
            </CardTitle>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Let AI analyze your tasks and suggest relevant new ones
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Context Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                What are you working on today?
              </label>
              <Input
                type="text"
                placeholder="e.g., preparing for a presentation, organizing my workspace..."
                value={userContext}
                onChange={(e) => setUserContext(e.target.value)}
                className="h-12 bg-white/80 dark:bg-slate-700/80 border-slate-200 dark:border-slate-600 rounded-xl text-base placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
              />
            </div>

            {/* Generate Button */}
            <Button
              onClick={generateSuggestions}
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Generating AI Suggestions...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Generate Smart Suggestions
                </div>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Suggestions List */}
      {suggestions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            Suggested Tasks
          </h3>
          
          <div className="grid gap-4">
            {suggestions.map((suggestion, index) => (
              <div 
                key={index}
                className="group relative animate-in slide-in-from-bottom-4 fade-in duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
                
                <Card className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">
                          {suggestion.title}
                        </h4>
                        <p className="text-slate-600 dark:text-slate-300 text-sm mb-3">
                          {suggestion.description}
                        </p>
                        
                        <div className="flex items-center gap-3">
                          <Badge className={`text-xs font-medium px-3 py-1 rounded-full ${getPriorityColor(suggestion.priority)}`}>
                            {getPriorityLabel(suggestion.priority)} Priority
                          </Badge>
                          
                          {suggestion.estimatedDuration && (
                            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                              <Clock className="h-3 w-3" />
                              {suggestion.estimatedDuration}
                            </div>
                          )}
                          
                          {suggestion.category && (
                            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                              <Tag className="h-3 w-3" />
                              {suggestion.category}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => onAddSuggestion(suggestion)}
                        size="sm"
                        className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-xl px-4 py-2 font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Task
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

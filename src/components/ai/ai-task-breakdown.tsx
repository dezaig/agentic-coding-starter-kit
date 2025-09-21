"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AIService } from "@/lib/ai-service";
import { Todo } from "@/components/todo/todo-item";
import { 
  Wand2, 
  Plus, 
  Clock, 
  Loader2, 
  ArrowRight,
  Sparkles 
} from "lucide-react";

interface AITaskBreakdownProps {
  todo: Todo;
  onAddSubtasks: (subtasks: Array<{ title: string; description: string; estimatedDuration: string }>) => void;
}

export function AITaskBreakdown({ todo, onAddSubtasks }: AITaskBreakdownProps) {
  const [subtasks, setSubtasks] = useState<Array<{ title: string; description: string; estimatedDuration: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const generateBreakdown = async () => {
    setIsLoading(true);
    try {
      const newSubtasks = await AIService.breakDownTask(todo.title, todo.description);
      setSubtasks(newSubtasks);
      setIsExpanded(true);
    } catch (error) {
      console.error("Failed to generate task breakdown:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAllSubtasks = () => {
    onAddSubtasks(subtasks);
    setSubtasks([]);
    setIsExpanded(false);
  };

  const handleAddSubtask = (subtask: { title: string; description: string; estimatedDuration: string }) => {
    onAddSubtasks([subtask]);
    setSubtasks(prev => prev.filter(s => s.title !== subtask.title));
  };

  return (
    <div className="space-y-4">
      {/* Breakdown Trigger */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg">
            <Wand2 className="h-4 w-4" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 dark:text-slate-100">
              AI Task Breakdown
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Break this complex task into smaller, manageable steps
            </p>
          </div>
        </div>
        
        <Button
          onClick={generateBreakdown}
          disabled={isLoading}
          size="sm"
          className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-xl px-4 py-2 font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Subtasks List */}
      {isExpanded && subtasks.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <ArrowRight className="h-4 w-4 text-purple-500" />
              Suggested Subtasks
            </h4>
            <Button
              onClick={handleAddAllSubtasks}
              size="sm"
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl px-4 py-2 font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add All
            </Button>
          </div>
          
          <div className="space-y-3">
            {subtasks.map((subtask, index) => (
              <div 
                key={index}
                className="group relative animate-in slide-in-from-bottom-4 fade-in duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
                
                <Card className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center text-white text-xs font-bold">
                            {index + 1}
                          </div>
                          <h5 className="font-semibold text-slate-800 dark:text-slate-100">
                            {subtask.title}
                          </h5>
                        </div>
                        
                        <p className="text-slate-600 dark:text-slate-300 text-sm mb-3">
                          {subtask.description}
                        </p>
                        
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                            <Clock className="h-3 w-3" />
                            {subtask.estimatedDuration}
                          </div>
                          <Badge variant="outline" className="text-xs border-purple-200 text-purple-700 dark:border-purple-700 dark:text-purple-300">
                            Subtask
                          </Badge>
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => handleAddSubtask(subtask)}
                        size="sm"
                        className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-lg px-3 py-2 font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-6">
          <div className="flex items-center justify-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-purple-500" />
            <span className="text-slate-600 dark:text-slate-400">
              Analyzing task complexity and generating subtasks...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

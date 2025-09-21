"use client";

import { TodoItem, Todo } from "./todo-item";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";

interface TodoListProps {
  todos: Todo[];
  onUpdate: (id: string, updates: Partial<Todo>) => void;
  onDelete: (id: string) => void;
  onAddSubtasks?: (subtasks: Array<{ title: string; description: string; estimatedDuration: string }>) => void;
  isLoading?: boolean;
  filter?: "all" | "pending" | "completed";
}

export function TodoList({ todos, onUpdate, onDelete, onAddSubtasks, isLoading = false, filter = "all" }: TodoListProps) {
  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case "pending":
        return !todo.completed;
      case "completed":
        return todo.completed;
      default:
        return true;
    }
  });

  const completedCount = todos.filter(todo => todo.completed).length;
  const pendingCount = todos.filter(todo => !todo.completed).length;
  const highPriorityCount = todos.filter(todo => !todo.completed && todo.priority === 2).length;

  const getFilterIcon = () => {
    switch (filter) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "completed":
        return <CheckCircle2 className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getFilterLabel = () => {
    switch (filter) {
      case "pending":
        return "Pending";
      case "completed":
        return "Completed";
      default:
        return "All";
    }
  };

  if (todos.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="space-y-2">
            <CheckCircle2 className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="text-lg font-medium">No todos yet</h3>
            <p className="text-muted-foreground">
              Create your first todo to get started!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="group relative overflow-hidden rounded-2xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg">
              {getFilterIcon()}
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{filteredTodos.length}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">{getFilterLabel()} Tasks</p>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{pendingCount}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Pending</p>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{completedCount}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Completed</p>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{highPriorityCount}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">High Priority</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Todo List */}
      <div className="relative group">
        {/* Glow Effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-300"></div>
        
        <Card className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-3xl shadow-xl">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg">
                  {getFilterIcon()}
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                  {getFilterLabel()} Tasks
                </span>
              </div>
              <Badge 
                variant="outline" 
                className="px-4 py-2 rounded-full border-slate-200 dark:border-slate-600 bg-white/80 dark:bg-slate-700/80 text-slate-700 dark:text-slate-300 font-medium"
              >
                {filteredTodos.length} {filteredTodos.length === 1 ? "item" : "items"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {filteredTodos.length === 0 ? (
              <div className="p-12 text-center">
                <div className="space-y-4">
                  <div className="relative mx-auto w-24 h-24">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-lg opacity-20"></div>
                    <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl">
                      <CheckCircle2 className="h-12 w-12" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                      {filter === "pending" ? "No pending tasks" : 
                       filter === "completed" ? "No completed tasks" : 
                       "No tasks found"}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                      {filter === "pending" ? "All tasks are completed! Great job!" : 
                       filter === "completed" ? "Complete some tasks to see them here." : 
                       "Create your first task to get started with TaskFlow."}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 p-6">
                {filteredTodos.map((todo, index) => (
                  <div 
                    key={todo.id}
                    className="animate-in slide-in-from-bottom-4 fade-in duration-300"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <TodoItem
                      todo={todo}
                      onUpdate={onUpdate}
                      onDelete={onDelete}
                      onAddSubtasks={onAddSubtasks}
                      isLoading={isLoading}
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { UserProfile } from "@/components/auth/user-profile";
import { TodoForm } from "@/components/todo/todo-form";
import { TodoList } from "@/components/todo/todo-list";
import { Todo } from "@/components/todo/todo-item";
import { useTodos } from "@/hooks/use-todos";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckSquare, Square, Filter, Clock, AlertCircle } from "lucide-react";
import { AITaskSuggestions } from "@/components/ai/ai-task-suggestions";
import { AIInsights } from "@/components/ai/ai-insights";
import { TestInput } from "@/components/debug/test-input";
import { SimpleForm } from "@/components/debug/simple-form";

export default function Home() {
  const { data: session, isPending } = useSession();
  const { todos, isLoading, error, createTodo, updateTodo, deleteTodo } = useTodos();
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-8">
            <CheckSquare className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h1 className="text-3xl font-bold mb-2">Todo App</h1>
            <p className="text-muted-foreground mb-6">
              Sign in to start managing your todos
            </p>
          </div>
          <UserProfile />
        </div>
      </div>
    );
  }

  const handleCreateTodo = async (data: {
    title: string;
    description?: string;
    priority: number;
    dueDate?: string;
  }) => {
    try {
      await createTodo(data);
    } catch (error) {
      console.error("Failed to create todo:", error);
    }
  };

  const handleUpdateTodo = async (id: string, updates: Partial<Todo>) => {
    try {
      await updateTodo(id, updates);
    } catch (error) {
      console.error("Failed to update todo:", error);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await deleteTodo(id);
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  const handleAddAISuggestion = async (suggestion: {
    title: string;
    description?: string;
    priority: number;
    dueDate?: string;
  }) => {
    try {
      await createTodo({
        title: suggestion.title,
        description: suggestion.description,
        priority: suggestion.priority,
        dueDate: suggestion.dueDate,
      });
    } catch (error) {
      console.error("Failed to add AI suggestion:", error);
    }
  };

  const handleAddSubtasks = async (subtasks: Array<{ title: string; description: string; estimatedDuration: string }>) => {
    try {
      for (const subtask of subtasks) {
        await createTodo({
          title: subtask.title,
          description: subtask.description,
          priority: 1, // Default to medium priority for subtasks
        });
      }
    } catch (error) {
      console.error("Failed to add subtasks:", error);
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-slate-900">
      {/* Simplified background for debugging */}
      <div className="absolute inset-0 bg-gray-50 dark:bg-slate-800 opacity-50"></div>
      
      <div className="relative container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Hero Header */}
          <div className="text-center space-y-8">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-30 animate-pulse"></div>
                <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 shadow-xl">
                  <CheckSquare className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="text-left">
                <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  TaskFlow
                </h1>
                <p className="text-xl text-slate-600 dark:text-slate-300 font-medium">
                  Premium Todo Management
                </p>
              </div>
            </div>
            
            <div className="max-w-2xl mx-auto">
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                Transform your productivity with our beautiful, intelligent task management system. 
                Stay organized, focused, and achieve your goals with style.
              </p>
            </div>

            {/* User Welcome Card */}
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {session.user.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-slate-700 dark:text-slate-200 font-medium">
                Welcome back, {session.user.name}!
              </span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="group relative overflow-hidden rounded-2xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg">
                  <CheckSquare className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{todos.length}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Total Tasks</p>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                    {todos.filter(t => !t.completed).length}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Pending</p>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg">
                  <CheckSquare className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                    {todos.filter(t => t.completed).length}
                  </p>
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
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                    {todos.filter(t => !t.completed && t.priority === 2).length}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">High Priority</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="flex items-center justify-between bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-6 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <Filter className="h-4 w-4" />
              </div>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Filter Tasks:</span>
              <Select value={filter} onValueChange={(value: "all" | "pending" | "completed") => setFilter(value)}>
                <SelectTrigger className="w-40 bg-white/80 dark:bg-slate-700/80 border-slate-200 dark:border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <div className="flex items-center gap-2">
                      <Square className="h-4 w-4" />
                      All Tasks
                    </div>
                  </SelectItem>
                  <SelectItem value="pending">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Pending
                    </div>
                  </SelectItem>
                  <SelectItem value="completed">
                    <div className="flex items-center gap-2">
                      <CheckSquare className="h-4 w-4" />
                      Completed
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm text-slate-600 dark:text-slate-400">Live Updates</span>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                <p className="text-red-700 dark:text-red-300 font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Debug Test Input */}
          <TestInput />
          
          {/* Debug Simple Form */}
          <SimpleForm />

          {/* AI Task Suggestions */}
          <AITaskSuggestions 
            todos={todos} 
            onAddSuggestion={handleAddAISuggestion} 
          />

          {/* Todo Form */}
          <TodoForm onSubmit={handleCreateTodo} isLoading={isLoading} />

          {/* Todo List */}
          <TodoList
            todos={todos}
            onUpdate={handleUpdateTodo}
            onDelete={handleDeleteTodo}
            onAddSubtasks={handleAddSubtasks}
            isLoading={isLoading}
            filter={filter}
          />

          {/* AI Insights */}
          <AIInsights todos={todos} />
        </div>
      </div>
    </main>
  );
}

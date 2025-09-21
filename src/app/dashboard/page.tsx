"use client";

import { useSession } from "@/lib/auth-client";
import { UserProfile } from "@/components/auth/user-profile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTodos } from "@/hooks/use-todos";
import { CheckSquare, Clock, AlertCircle, Calendar, TrendingUp } from "lucide-react";
import Link from "next/link";
import { AIDashboardInsights } from "@/components/ai/ai-dashboard-insights";

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const { todos } = useTodos();

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
            <CheckSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground mb-6">
              You need to sign in to access the dashboard
            </p>
          </div>
          <UserProfile />
        </div>
      </div>
    );
  }

  const completedTodos = todos.filter(todo => todo.completed);
  const pendingTodos = todos.filter(todo => !todo.completed);
  const highPriorityTodos = todos.filter(todo => !todo.completed && todo.priority === 2);
  const overdueTodos = todos.filter(todo => 
    todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed
  );

  const completionRate = todos.length > 0 ? Math.round((completedTodos.length / todos.length) * 100) : 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>
      
      <div className="relative container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-slate-600 dark:text-slate-300 text-lg mt-2">
                Welcome back, {session.user.name}! Here&apos;s your productivity overview.
              </p>
            </div>
            <Button 
              asChild
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Link href="/">View All Tasks</Link>
            </Button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group relative overflow-hidden rounded-2xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg">
                  <CheckSquare className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Total Tasks</p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{todos.length}</p>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Pending</p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{pendingTodos.length}</p>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Completed</p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{completedTodos.length}</p>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">High Priority</p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{highPriorityTodos.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Dashboard Insights */}
          <AIDashboardInsights todos={todos} />

          {/* Quick Actions and Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-300"></div>
              <Card className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-3xl shadow-xl">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3 text-xl font-bold">
                    <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <span className="bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                      Recent Activity
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {todos.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                        <CheckSquare className="h-8 w-8 text-white" />
                      </div>
                      <p className="text-slate-600 dark:text-slate-400">
                        No tasks yet. Create your first task to get started!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {todos.slice(0, 5).map((todo) => (
                        <div key={todo.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            todo.completed ? 'bg-green-100 dark:bg-green-900/30' : 'bg-slate-100 dark:bg-slate-700'
                          }`}>
                            <CheckSquare className={`h-4 w-4 ${todo.completed ? 'text-green-600 dark:text-green-400' : 'text-slate-400'}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium ${todo.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-100'}`}>
                              {todo.title}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {new Date(todo.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          {todo.priority === 2 && (
                            <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 text-xs px-2 py-1 rounded-full">
                              High
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-blue-600 rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-300"></div>
              <Card className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-3xl shadow-xl">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3 text-xl font-bold">
                    <div className="p-2 rounded-xl bg-gradient-to-r from-green-500 to-blue-600 text-white shadow-lg">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <span className="bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                      Progress Overview
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm mb-3">
                        <span className="font-medium text-slate-700 dark:text-slate-300">Completion Rate</span>
                        <span className="font-bold text-slate-800 dark:text-slate-100">{completionRate}%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-blue-600 h-3 rounded-full transition-all duration-500 shadow-sm" 
                          style={{ width: `${completionRate}%` }}
                        ></div>
                      </div>
                    </div>

                    {overdueTodos.length > 0 && (
                      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                        <div className="flex items-center gap-3 text-red-700 dark:text-red-400">
                          <AlertCircle className="h-5 w-5" />
                          <span className="font-medium">
                            {overdueTodos.length} overdue task{overdueTodos.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                        <span>{pendingTodos.length} tasks remaining</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        <span>{highPriorityTodos.length} high priority items</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span>{completedTodos.length} tasks completed</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

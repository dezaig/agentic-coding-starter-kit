"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

interface TodoFormProps {
  onSubmit: (data: {
    title: string;
    description?: string;
    priority: number;
    dueDate?: string;
  }) => void;
  isLoading?: boolean;
}

export function TodoForm({ onSubmit, isLoading = false }: TodoFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<number>(0);
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      dueDate: dueDate || undefined,
    });

    // Reset form
    setTitle("");
    setDescription("");
    setPriority(0);
    setDueDate("");
  };

  return (
    <div className="relative group">
      {/* Glow Effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
      
      <Card className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-3xl shadow-xl">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-3 text-2xl font-bold">
            <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg">
              <Plus className="h-6 w-6" />
            </div>
            <span className="bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
              Create New Task
            </span>
          </CardTitle>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Add a new task to your productivity workflow
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Task Title
              </label>
              <Input
                placeholder="What needs to be done?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="h-12 bg-white/80 dark:bg-slate-700/80 border-slate-200 dark:border-slate-600 rounded-xl text-base placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Description
              </label>
              <Textarea
                placeholder="Add more details about this task..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="bg-white/80 dark:bg-slate-700/80 border-slate-200 dark:border-slate-600 rounded-xl resize-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Priority Level
                </label>
                <Select value={priority.toString()} onValueChange={(value) => setPriority(parseInt(value))}>
                  <SelectTrigger className="h-12 bg-white/80 dark:bg-slate-700/80 border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        Low Priority
                      </div>
                    </SelectItem>
                    <SelectItem value="1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                        Medium Priority
                      </div>
                    </SelectItem>
                    <SelectItem value="2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        High Priority
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Due Date
                </label>
                <Input
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="h-12 bg-white/80 dark:bg-slate-700/80 border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                />
              </div>
            </div>

            <div className="pt-4">
              <Button 
                type="submit" 
                disabled={isLoading || !title.trim()}
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating Task...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Create Task
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


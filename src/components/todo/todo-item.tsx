"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock
} from "lucide-react";
import { AITaskBreakdown } from "@/components/ai/ai-task-breakdown";

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: number;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface TodoItemProps {
  todo: Todo;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
  onDelete: (id: string) => void;
  onAddSubtasks?: (subtasks: Array<{ title: string; description: string; estimatedDuration: string }>) => void;
  isLoading?: boolean;
}

export function TodoItem({ todo, onUpdate, onDelete, onAddSubtasks, isLoading = false }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: todo.title,
    description: todo.description || "",
    priority: todo.priority,
    dueDate: todo.dueDate ? new Date(todo.dueDate).toISOString().slice(0, 16) : "",
  });

  const handleSave = () => {
    onUpdate(todo.id, {
      title: editData.title.trim(),
      description: editData.description.trim() || undefined,
      priority: editData.priority,
      dueDate: editData.dueDate || undefined,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      title: todo.title,
      description: todo.description || "",
      priority: todo.priority,
      dueDate: todo.dueDate ? new Date(todo.dueDate).toISOString().slice(0, 16) : "",
    });
    setIsEditing(false);
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 2: return "destructive";
      case 1: return "default";
      default: return "secondary";
    }
  };

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 2: return "High";
      case 1: return "Medium";
      default: return "Low";
    }
  };

  const getPriorityIcon = (priority: number) => {
    switch (priority) {
      case 2: return <AlertCircle className="h-3 w-3" />;
      case 1: return <Clock className="h-3 w-3" />;
      default: return <CheckCircle2 className="h-3 w-3" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed;

  return (
    <div className="group relative">
      {/* Subtle glow effect */}
      <div className={`absolute -inset-0.5 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-300 ${
        todo.priority === 2 ? 'bg-gradient-to-r from-red-500 to-red-600' :
        todo.priority === 1 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
        'bg-gradient-to-r from-green-500 to-green-600'
      }`}></div>
      
      <Card className={`relative transition-all duration-300 hover:shadow-xl ${
        todo.completed ? "opacity-70 bg-slate-50/50 dark:bg-slate-800/30" : "bg-white/80 dark:bg-slate-800/80"
      } backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl shadow-lg group-hover:shadow-xl`}>
        <CardContent className="p-6">
          {isEditing ? (
            <div className="space-y-4">
              <Input
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                placeholder="Task title..."
                className="h-12 bg-white/80 dark:bg-slate-700/80 border-slate-200 dark:border-slate-600 rounded-xl text-base focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
              />
              
              <Textarea
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                placeholder="Task description..."
                rows={2}
                className="bg-white/80 dark:bg-slate-700/80 border-slate-200 dark:border-slate-600 rounded-xl resize-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
              />

              <div className="grid grid-cols-2 gap-3">
                <Select 
                  value={editData.priority.toString()} 
                  onValueChange={(value) => setEditData({ ...editData, priority: parseInt(value) })}
                >
                  <SelectTrigger className="h-10 bg-white/80 dark:bg-slate-700/80 border-slate-200 dark:border-slate-600 rounded-xl">
                    <SelectValue />
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

                <Input
                  type="datetime-local"
                  value={editData.dueDate}
                  onChange={(e) => setEditData({ ...editData, dueDate: e.target.value })}
                  className="h-10 bg-white/80 dark:bg-slate-700/80 border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button 
                  size="sm" 
                  onClick={handleSave} 
                  disabled={isLoading || !editData.title.trim()}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl px-4 py-2"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleCancel}
                  className="border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 pt-1">
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={(checked) => onUpdate(todo.id, { completed: !!checked })}
                    disabled={isLoading}
                    className="w-5 h-5 rounded-lg border-2 border-slate-300 dark:border-slate-600 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-purple-600 data-[state=checked]:border-transparent"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className={`text-lg font-semibold leading-tight ${
                    todo.completed 
                      ? "line-through text-slate-400 dark:text-slate-500" 
                      : "text-slate-800 dark:text-slate-100"
                  }`}>
                    {todo.title}
                  </h3>
                  {todo.description && (
                    <p className={`text-sm mt-2 leading-relaxed ${
                      todo.completed 
                        ? "line-through text-slate-400 dark:text-slate-500" 
                        : "text-slate-600 dark:text-slate-300"
                    }`}>
                      {todo.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <Badge 
                    variant={getPriorityColor(todo.priority)} 
                    className={`text-xs font-medium px-3 py-1 rounded-full ${
                      todo.priority === 2 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                      todo.priority === 1 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                    }`}
                  >
                    {getPriorityIcon(todo.priority)}
                    <span className="ml-1">{getPriorityLabel(todo.priority)}</span>
                  </Badge>
                  
                  {todo.dueDate && (
                    <div className={`flex items-center gap-2 text-xs px-3 py-1 rounded-full ${
                      isOverdue 
                        ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" 
                        : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                    }`}>
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(todo.dueDate)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  disabled={isLoading}
                  className="border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl px-3 py-2"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDelete(todo.id)}
                  disabled={isLoading}
                  className="border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl px-3 py-2"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          
          {/* AI Task Breakdown */}
          {!isEditing && onAddSubtasks && (
            <div className="mt-4">
              <AITaskBreakdown 
                todo={todo} 
                onAddSubtasks={onAddSubtasks} 
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


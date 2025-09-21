import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

// Validate model name
const validModels = ["gpt-4o-mini", "gpt-4o", "gpt-3.5-turbo"];
const finalModel = validModels.includes(model) ? model : "gpt-4o-mini";

export interface TaskSuggestion {
  title: string;
  description: string;
  priority: number;
  estimatedDuration?: string;
  category?: string;
}

export interface ProductivityInsight {
  type: 'success' | 'warning' | 'tip';
  title: string;
  message: string;
  action?: string;
}

export interface SmartSchedule {
  suggestedTime: string;
  reasoning: string;
  conflicts?: string[];
}

export class AIService {
  static async generateTaskSuggestions(
    userTodos: Array<{ title: string; description?: string; priority: number; completed: boolean }>,
    userContext?: string
  ): Promise<TaskSuggestion[]> {
    try {
      const completedTasks = userTodos.filter(t => t.completed);
      const pendingTasks = userTodos.filter(t => !t.completed);
      
      const prompt = `
        Based on the user's task history and current context, suggest 3-5 relevant tasks they might want to add.
        
        User Context: ${userContext || 'General productivity'}
        
        Completed Tasks (${completedTasks.length}):
        ${completedTasks.map(t => `- ${t.title} (Priority: ${t.priority})`).join('\n')}
        
        Pending Tasks (${pendingTasks.length}):
        ${pendingTasks.map(t => `- ${t.title} (Priority: ${t.priority})`).join('\n')}
        
        Please suggest tasks that:
        1. Are relevant to their work patterns
        2. Help complete their current goals
        3. Are actionable and specific
        4. Include appropriate priority levels (0=low, 1=medium, 2=high)
        
        Return as JSON array with: title, description, priority, estimatedDuration, category
      `;

      const result = await generateText({
        model: openai(finalModel),
        prompt,
        temperature: 0.7,
      });

      const suggestions = JSON.parse(result.text);
      return suggestions.slice(0, 5); // Limit to 5 suggestions
    } catch (error) {
      console.error("Error generating task suggestions:", error);
      return [];
    }
  }

  static async optimizeTaskPriorities(
    todos: Array<{ title: string; description?: string; priority: number; dueDate?: string; completed: boolean }>
  ): Promise<Array<{ id: string; suggestedPriority: number; reasoning: string }>> {
    try {
      const pendingTasks = todos.filter(t => !t.completed);
      
      const prompt = `
        Analyze these tasks and suggest optimal priority levels based on urgency, importance, and deadlines.
        
        Tasks:
        ${pendingTasks.map((t, i) => `${i + 1}. ${t.title}${t.description ? ` - ${t.description}` : ''} (Current Priority: ${t.priority})${t.dueDate ? ` (Due: ${t.dueDate})` : ''}`).join('\n')}
        
        Priority levels: 0=Low, 1=Medium, 2=High
        
        For each task, suggest:
        1. Optimal priority level
        2. Brief reasoning for the suggestion
        
        Return as JSON array with: id (index+1), suggestedPriority, reasoning
      `;

      const result = await generateText({
        model: openai(finalModel),
        prompt,
        temperature: 0.3,
      });

      const optimizations = JSON.parse(result.text);
      return optimizations;
    } catch (error) {
      console.error("Error optimizing task priorities:", error);
      return [];
    }
  }

  static async generateProductivityInsights(
    todos: Array<{ title: string; completed: boolean; createdAt: string; priority: number }>
  ): Promise<ProductivityInsight[]> {
    try {
      const completedTasks = todos.filter(t => t.completed);
      const pendingTasks = todos.filter(t => !t.completed);
      const highPriorityPending = pendingTasks.filter(t => t.priority === 2);
      
      const completionRate = todos.length > 0 ? (completedTasks.length / todos.length) * 100 : 0;
      
      const prompt = `
        Analyze this user's productivity data and provide 3-5 actionable insights.
        
        Stats:
        - Total tasks: ${todos.length}
        - Completed: ${completedTasks.length} (${completionRate.toFixed(1)}%)
        - Pending: ${pendingTasks.length}
        - High priority pending: ${highPriorityPending.length}
        
        Recent completed tasks:
        ${completedTasks.slice(-5).map(t => `- ${t.title}`).join('\n')}
        
        Current high priority tasks:
        ${highPriorityPending.map(t => `- ${t.title}`).join('\n')}
        
        Provide insights that are:
        1. Actionable and specific
        2. Based on their actual data
        3. Helpful for improving productivity
        4. Include success celebrations when appropriate
        
        Return as JSON array with: type ('success', 'warning', 'tip'), title, message, action (optional)
      `;

      const result = await generateText({
        model: openai(finalModel),
        prompt,
        temperature: 0.5,
      });

      const insights = JSON.parse(result.text);
      return insights.slice(0, 5);
    } catch (error) {
      console.error("Error generating productivity insights:", error);
      return [];
    }
  }

  static async suggestSmartScheduling(
    todos: Array<{ title: string; description?: string; priority: number; dueDate?: string }>,
    userPreferences?: { workingHours?: string; timezone?: string }
  ): Promise<SmartSchedule[]> {
    try {
      const highPriorityTasks = todos.filter(t => t.priority === 2);
      const tasksWithDeadlines = todos.filter(t => t.dueDate);
      
      const prompt = `
        Suggest optimal scheduling for these tasks based on priority, deadlines, and best practices.
        
        High Priority Tasks:
        ${highPriorityTasks.map(t => `- ${t.title}${t.dueDate ? ` (Due: ${t.dueDate})` : ''}`).join('\n')}
        
        Tasks with Deadlines:
        ${tasksWithDeadlines.map(t => `- ${t.title} (Due: ${t.dueDate})`).join('\n')}
        
        User Preferences:
        - Working Hours: ${userPreferences?.workingHours || '9 AM - 5 PM'}
        - Timezone: ${userPreferences?.timezone || 'Local time'}
        
        Suggest:
        1. When to tackle high priority tasks
        2. How to schedule deadline-driven tasks
        3. Optimal work patterns
        
        Return as JSON array with: suggestedTime, reasoning, conflicts (optional array)
      `;

      const result = await generateText({
        model: openai(finalModel),
        prompt,
        temperature: 0.4,
      });

      const schedules = JSON.parse(result.text);
      return schedules.slice(0, 3);
    } catch (error) {
      console.error("Error suggesting smart scheduling:", error);
      return [];
    }
  }

  static async breakDownTask(
    taskTitle: string,
    taskDescription?: string
  ): Promise<Array<{ title: string; description: string; estimatedDuration: string }>> {
    try {
      const prompt = `
        Break down this complex task into smaller, actionable subtasks.
        
        Main Task: ${taskTitle}
        Description: ${taskDescription || 'No description provided'}
        
        Create 3-7 specific, actionable subtasks that:
        1. Are clear and specific
        2. Can be completed independently
        3. Have logical sequence
        4. Include estimated time for each
        
        Return as JSON array with: title, description, estimatedDuration
      `;

      const result = await generateText({
        model: openai(finalModel),
        prompt,
        temperature: 0.6,
      });

      const subtasks = JSON.parse(result.text);
      return subtasks.slice(0, 7);
    } catch (error) {
      console.error("Error breaking down task:", error);
      return [];
    }
  }
}

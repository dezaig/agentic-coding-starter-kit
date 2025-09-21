"use client";

import { useState, useEffect, useCallback } from "react";
import { Todo } from "@/components/todo/todo-item";

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/todos");
      
      if (!response.ok) {
        throw new Error("Failed to fetch todos");
      }
      
      const data = await response.json();
      setTodos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createTodo = useCallback(async (todoData: {
    title: string;
    description?: string;
    priority: number;
    dueDate?: string;
  }) => {
    try {
      setError(null);
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(todoData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create todo");
      }

      const newTodo = await response.json();
      setTodos(prev => [...prev, newTodo]);
      return newTodo;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    }
  }, []);

  const updateTodo = useCallback(async (id: string, updates: Partial<Todo>) => {
    try {
      setError(null);
      const response = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("Failed to update todo");
      }

      const updatedTodo = await response.json();
      setTodos(prev => prev.map(todo => 
        todo.id === id ? updatedTodo : todo
      ));
      return updatedTodo;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    }
  }, []);

  const deleteTodo = useCallback(async (id: string) => {
    try {
      setError(null);
      const response = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete todo");
      }

      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  return {
    todos,
    isLoading,
    error,
    createTodo,
    updateTodo,
    deleteTodo,
    refetch: fetchTodos,
  };
}

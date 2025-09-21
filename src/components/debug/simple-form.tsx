"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function SimpleForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", { title, description });
    alert(`Form submitted!\nTitle: ${title}\nDescription: ${description}`);
  };

  return (
    <div className="p-6 border border-blue-500 bg-blue-50 rounded-lg">
      <h3 className="text-lg font-bold mb-4">Debug: Simple Form</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Title:</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title..."
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Description:</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description..."
            rows={3}
            className="w-full"
          />
        </div>
        
        <Button type="submit" className="w-full">
          Submit Form
        </Button>
        
        <div className="text-sm text-gray-600">
          <p>Title: "{title}"</p>
          <p>Description: "{description}"</p>
        </div>
      </form>
    </div>
  );
}

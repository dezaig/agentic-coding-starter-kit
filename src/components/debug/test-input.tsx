"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";

export function TestInput() {
  const [value, setValue] = useState("");

  return (
    <div className="p-4 border border-red-500 bg-red-50">
      <h3 className="text-lg font-bold mb-4">Debug: Test Input</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Regular HTML Input:</label>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Type here..."
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Shadcn Input Component:</label>
          <Input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Type here..."
          />
        </div>
        
        <div>
          <p className="text-sm">Current value: "{value}"</p>
        </div>
      </div>
    </div>
  );
}

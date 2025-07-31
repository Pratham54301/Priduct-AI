'use client';

import { Button } from "@/components/ui/button";

export default function FeedbackSupport() {
  return (
    <div className="bg-card rounded-lg shadow p-6 dark:bg-[#18181b]">
      <h2 className="text-lg font-semibold mb-4 text-white">Feedback & Support</h2>
      <textarea
        className="w-full mb-4 p-2 rounded border border-gray-700 bg-[#232323] text-white"
        rows={3}
        placeholder="Your feedback..."
      />
      <div className="flex items-center gap-2">
        <Button variant="secondary">Submit Feedback</Button>
        <a href="mailto:support@product.ai" className="text-blue-400 underline">Contact Support</a>
      </div>
    </div>
  );
} 

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Phone, Copy, Check } from "lucide-react";
import { Task } from "@/pages/Index";
import { useToast } from "@/hooks/use-toast";

interface SettingsProps {
  onTaskReceived: (task: Omit<Task, 'id' | 'createdAt'>) => void;
}

export const Settings = ({ onTaskReceived }: SettingsProps) => {
  const [phoneNumber] = useState("+1 (555) 123-TODO");
  const [copied, setCopied] = useState(false);
  const [simulateText, setSimulateText] = useState("");
  const { toast } = useToast();

  const copyPhoneNumber = async () => {
    try {
      await navigator.clipboard.writeText(phoneNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Phone number copied!",
        description: "You can now save this number in your contacts.",
      });
    } catch (err) {
      console.error("Failed to copy phone number:", err);
    }
  };

  const simulateSMS = () => {
    if (!simulateText.trim()) return;

    // Simple parsing logic for demo
    const text = simulateText.trim();
    let category: 'work' | 'life' = 'work';
    let priority: 'low' | 'medium' | 'high' = 'medium';
    let title = text;
    let dueDate: Date | undefined;

    // Check for category keywords
    if (text.toLowerCase().includes('life') || text.toLowerCase().includes('personal') || text.toLowerCase().includes('home')) {
      category = 'life';
    }

    // Check for priority keywords
    if (text.toLowerCase().includes('urgent') || text.toLowerCase().includes('important') || text.toLowerCase().includes('asap')) {
      priority = 'high';
    } else if (text.toLowerCase().includes('low') || text.toLowerCase().includes('whenever')) {
      priority = 'low';
    }

    // Check for date keywords
    const today = new Date();
    if (text.toLowerCase().includes('today')) {
      dueDate = today;
    } else if (text.toLowerCase().includes('tomorrow')) {
      dueDate = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    }

    // Clean up the title by removing category, priority, and date keywords
    title = title
      .replace(/\b(work|life|personal|home|urgent|important|asap|low|high|medium|whenever|today|tomorrow)\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (title) {
      onTaskReceived({
        title,
        category,
        priority,
        completed: false,
        dueDate,
      });

      setSimulateText("");
      toast({
        title: "Task received via SMS!",
        description: `"${title}" has been added to your ${category} list.`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Settings</h2>
        <p className="text-muted-foreground">Configure your task management preferences</p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="h-6 w-6" />
            <h3 className="text-xl font-semibold">SMS Integration</h3>
            <Badge variant="secondary">Beta</Badge>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Phone Number Display */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5" />
                <span className="font-medium">SMS Number</span>
              </div>
              <div className="flex items-center gap-2">
                <code className="bg-muted px-2 py-1 rounded text-sm font-mono flex-1">
                  {phoneNumber}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyPhoneNumber}
                  className="h-8 w-8 p-0"
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Text this number to add tasks instantly!
              </p>
            </div>

            {/* SMS Simulator */}
            <div className="space-y-3">
              <div>
                <span className="font-medium">Try it now (Simulator)</span>
              </div>
              <div className="flex gap-2">
                <Input
                  value={simulateText}
                  onChange={(e) => setSimulateText(e.target.value)}
                  placeholder="e.g., 'Urgent: Buy groceries today'"
                  onKeyDown={(e) => e.key === 'Enter' && simulateSMS()}
                />
                <Button
                  onClick={simulateSMS}
                  disabled={!simulateText.trim()}
                >
                  Send
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Keywords: "work", "life", "urgent", "low priority", "today", "tomorrow"
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

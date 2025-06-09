
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Phone, Copy, Check } from "lucide-react";
import { Task } from "@/pages/Index";
import { useToast } from "@/hooks/use-toast";

interface SMSIntegrationProps {
  onTaskReceived: (task: Omit<Task, 'id' | 'createdAt'>) => void;
}

export const SMSIntegration = ({ onTaskReceived }: SMSIntegrationProps) => {
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

    // Clean up the title by removing category and priority keywords
    title = title
      .replace(/\b(work|life|personal|home|urgent|important|asap|low|high|medium|whenever)\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (title) {
      onTaskReceived({
        title,
        category,
        priority,
        completed: false,
      });

      setSimulateText("");
      toast({
        title: "Task received via SMS!",
        description: `"${title}" has been added to your ${category} list.`,
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <MessageSquare className="h-6 w-6" />
        <h3 className="text-xl font-semibold">Add Tasks via SMS</h3>
        <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
          Beta
        </Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Phone Number Display */}
        <Card className="p-4 bg-white/10 backdrop-blur-sm border-white/20">
          <div className="flex items-center gap-3 mb-2">
            <Phone className="h-5 w-5" />
            <span className="font-medium">SMS Number</span>
          </div>
          <div className="flex items-center gap-2">
            <code className="bg-white/20 px-2 py-1 rounded text-sm font-mono flex-1">
              {phoneNumber}
            </code>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyPhoneNumber}
              className="h-8 w-8 p-0 hover:bg-white/20"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-sm text-white/80 mt-2">
            Text this number to add tasks instantly!
          </p>
        </Card>

        {/* SMS Simulator */}
        <Card className="p-4 bg-white/10 backdrop-blur-sm border-white/20">
          <div className="mb-2">
            <span className="font-medium">Try it now (Simulator)</span>
          </div>
          <div className="flex gap-2">
            <Input
              value={simulateText}
              onChange={(e) => setSimulateText(e.target.value)}
              placeholder="e.g., 'Urgent: Buy groceries for dinner'"
              className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
              onKeyDown={(e) => e.key === 'Enter' && simulateSMS()}
            />
            <Button
              onClick={simulateSMS}
              disabled={!simulateText.trim()}
              variant="secondary"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              Send
            </Button>
          </div>
          <p className="text-xs text-white/70 mt-2">
            Keywords: "work", "life", "urgent", "low priority"
          </p>
        </Card>
      </div>
    </div>
  );
};

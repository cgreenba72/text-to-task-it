
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Task } from "@/pages/Index";
import { cn } from "@/lib/utils";

interface AddTaskFormProps {
  onAddTask: (task: Omit<Task, 'id' | 'created_at' | 'user_id'>) => void;
  onCancel: () => void;
  defaultCategory?: 'work' | 'life';
}

export const AddTaskForm = ({ onAddTask, onCancel, defaultCategory = 'work' }: AddTaskFormProps) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<'work' | 'life'>(defaultCategory);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState<Date | undefined>();

  // Update category when defaultCategory changes
  useEffect(() => {
    setCategory(defaultCategory);
  }, [defaultCategory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title: title.trim(),
      category,
      priority,
      completed: false,
      due_date: dueDate ? dueDate.toISOString() : undefined,
    });

    setTitle("");
    setCategory(defaultCategory);
    setPriority('medium');
    setDueDate(undefined);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Task Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your task..."
            className="mt-1"
            autoFocus
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={(value: 'work' | 'life') => setCategory(value)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="work">💼 Work</SelectItem>
                <SelectItem value="life">🏠 Life</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={(value: 'low' | 'medium' | 'high') => setPriority(value)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">🟢 Low</SelectItem>
                <SelectItem value="medium">🟡 Medium</SelectItem>
                <SelectItem value="high">🔴 High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="dueDate">Due Date (Optional)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full mt-1 justify-start text-left font-normal",
                  !dueDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dueDate ? format(dueDate, "PPP") : <span>Pick a due date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={setDueDate}
                disabled={(date) => date < new Date()}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex gap-2 pt-4">
          <Button 
            type="submit" 
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            disabled={!title.trim()}
          >
            Add Task
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

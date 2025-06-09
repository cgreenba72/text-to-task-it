
import { Task } from "@/pages/Index";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X, CalendarIcon, Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, isToday, isTomorrow, isPast } from "date-fns";

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

export const TaskItem = ({ task, onToggle, onDelete, onEdit }: TaskItemProps) => {
  const priorityColors = {
    low: "bg-green-100 text-green-800 hover:bg-green-200",
    medium: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    high: "bg-red-100 text-red-800 hover:bg-red-200"
  };

  const categoryEmoji = task.category === 'work' ? '💼' : '🏠';

  const getDueDateDisplay = () => {
    if (!task.due_date) return null;

    const dueDate = new Date(task.due_date);
    const isOverdue = isPast(dueDate) && !isToday(dueDate);
    const dueDateText = isToday(dueDate) 
      ? "Today" 
      : isTomorrow(dueDate) 
        ? "Tomorrow" 
        : format(dueDate, "MMM d");

    return (
      <div className={cn(
        "flex items-center gap-1 text-xs px-2 py-1 rounded-full",
        isOverdue && !task.completed 
          ? "bg-red-100 text-red-800" 
          : "bg-blue-100 text-blue-800"
      )}>
        <CalendarIcon className="h-3 w-3" />
        {dueDateText}
      </div>
    );
  };

  return (
    <Card className={cn(
      "p-4 transition-all duration-200 hover:shadow-md border-l-4",
      task.completed ? "opacity-60 bg-muted/30" : "bg-white hover:bg-gray-50",
      task.category === 'work' ? "border-l-blue-500" : "border-l-purple-500"
    )}>
      <div className="flex items-center gap-3">
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => onToggle(task.id)}
          className="h-5 w-5"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{categoryEmoji}</span>
            <span className={cn(
              "font-medium",
              task.completed ? "line-through text-muted-foreground" : "text-foreground"
            )}>
              {task.title}
            </span>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={priorityColors[task.priority]}>
              {task.priority} priority
            </Badge>
            {getDueDateDisplay()}
            <span className="text-xs text-muted-foreground">
              {new Date(task.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(task.id)}
            className="text-muted-foreground hover:text-primary h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(task.id)}
            className="text-muted-foreground hover:text-destructive h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

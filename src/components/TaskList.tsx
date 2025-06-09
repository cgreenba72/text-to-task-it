
import { Task } from "@/pages/Index";
import { TaskItem } from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  category: 'work' | 'life';
}

export const TaskList = ({ tasks, onToggleTask, onDeleteTask, category }: TaskListProps) => {
  const completedTasks = tasks.filter(task => task.completed);
  const incompleteTasks = tasks.filter(task => !task.completed);

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">
          {category === 'work' ? '💼' : '🏠'}
        </div>
        <h3 className="text-xl font-semibold text-muted-foreground mb-2">
          No {category} tasks yet
        </h3>
        <p className="text-muted-foreground">
          Add your first task to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Incomplete Tasks */}
      {incompleteTasks.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 text-foreground">
            Active Tasks ({incompleteTasks.length})
          </h3>
          <div className="space-y-3">
            {incompleteTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={onToggleTask}
                onDelete={onDeleteTask}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 text-muted-foreground">
            Completed ({completedTasks.length})
          </h3>
          <div className="space-y-3">
            {completedTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={onToggleTask}
                onDelete={onDeleteTask}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

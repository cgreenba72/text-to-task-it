
import { useState } from "react";
import { TaskList } from "@/components/TaskList";
import { AddTaskForm } from "@/components/AddTaskForm";
import { Settings } from "@/components/Settings";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Plus, Settings as SettingsIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface Task {
  id: string;
  title: string;
  category: 'work' | 'life';
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  createdAt: Date;
  dueDate?: Date;
}

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setTasks(prev => [...prev, newTask]);
    setShowAddForm(false);
    toast({
      title: "Task added successfully!",
      description: `"${newTask.title}" has been added to your ${newTask.category} list.`,
    });
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    toast({
      title: "Task deleted",
      description: "The task has been removed from your list.",
    });
  };

  const workTasks = tasks.filter(task => task.category === 'work');
  const lifeTasks = tasks.filter(task => task.category === 'life');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              My Tasks
            </h1>
            <p className="text-muted-foreground text-lg">
              Organize your work and life with ease
            </p>
          </div>
          
          {/* Settings Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <SettingsIcon className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px]">
              <Settings onTaskReceived={addTask} />
            </SheetContent>
          </Sheet>
        </div>

        {/* Add Task Button */}
        <div className="flex justify-center mb-8">
          <Button 
            onClick={() => setShowAddForm(true)}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add New Task
          </Button>
        </div>

        {/* Add Task Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md p-6 bg-white">
              <AddTaskForm 
                onAddTask={addTask}
                onCancel={() => setShowAddForm(false)}
              />
            </Card>
          </div>
        )}

        {/* Task Categories */}
        <Tabs defaultValue="work" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/60 backdrop-blur-sm">
            <TabsTrigger 
              value="work" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              Work ({workTasks.length})
            </TabsTrigger>
            <TabsTrigger 
              value="life"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              Life ({lifeTasks.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="work">
            <TaskList 
              tasks={workTasks}
              onToggleTask={toggleTask}
              onDeleteTask={deleteTask}
              category="work"
            />
          </TabsContent>
          
          <TabsContent value="life">
            <TaskList 
              tasks={lifeTasks}
              onToggleTask={toggleTask}
              onDeleteTask={deleteTask}
              category="life"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;

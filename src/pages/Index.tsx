import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { TaskList } from "@/components/TaskList";
import { AddTaskForm } from "@/components/AddTaskForm";
import { EditTaskForm } from "@/components/EditTaskForm";
import { Settings } from "@/components/Settings";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Plus, Settings as SettingsIcon, LogOut, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface Task {
  id: string;
  title: string;
  category: 'work' | 'life';
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  created_at: string;
  due_date?: string;
  user_id: string;
}

const Index = () => {
  const { user, signOut } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('work');
  const { toast } = useToast();

  // Fetch tasks from Supabase
  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tasks:', error);
        toast({
          title: "Error loading tasks",
          description: error.message,
          variant: "destructive",
        });
      } else {
        // Type assertion to ensure proper types from database
        const typedTasks = (data || []).map(task => ({
          ...task,
          category: task.category as 'work' | 'life',
          priority: task.priority as 'low' | 'medium' | 'high'
        }));
        setTasks(typedTasks);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (taskData: Omit<Task, 'id' | 'created_at' | 'user_id'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([
          {
            ...taskData,
            due_date: taskData.due_date || null,
            user_id: user.id,
          }
        ])
        .select()
        .single();

      if (error) {
        toast({
          title: "Error adding task",
          description: error.message,
          variant: "destructive",
        });
      } else {
        // Type assertion for the new task
        const typedTask = {
          ...data,
          category: data.category as 'work' | 'life',
          priority: data.priority as 'low' | 'medium' | 'high'
        };
        setTasks(prev => [typedTask, ...prev]);
        setShowAddForm(false);
        toast({
          title: "Task added successfully!",
          description: `"${data.title}" has been added to your ${data.category} list.`,
        });
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const updateTask = async (id: string, updatedTask: Omit<Task, 'id' | 'created_at' | 'user_id'>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({
          ...updatedTask,
          due_date: updatedTask.due_date || null,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        toast({
          title: "Error updating task",
          description: error.message,
          variant: "destructive",
        });
      } else {
        // Type assertion for the updated task
        const typedTask = {
          ...data,
          category: data.category as 'work' | 'life',
          priority: data.priority as 'low' | 'medium' | 'high'
        };
        setTasks(prev => prev.map(task => 
          task.id === id ? typedTask : task
        ));
        setEditingTask(null);
        toast({
          title: "Task updated successfully!",
          description: `"${data.title}" has been updated.`,
        });
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .update({ completed: !task.completed })
        .eq('id', id);

      if (error) {
        toast({
          title: "Error updating task",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setTasks(prev => prev.map(task => 
          task.id === id ? { ...task, completed: !task.completed } : task
        ));
      }
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) {
        toast({
          title: "Error deleting task",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setTasks(prev => prev.filter(task => task.id !== id));
        toast({
          title: "Task deleted",
          description: "The task has been removed from your list.",
        });
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const editTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      setEditingTask(task);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
  };

  const workTasks = tasks.filter(task => task.category === 'work');
  const lifeTasks = tasks.filter(task => task.category === 'life');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading your tasks...</div>
      </div>
    );
  }

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
          
          <div className="flex gap-2">
            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem disabled>
                  {user?.email}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Settings Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <SettingsIcon className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[400px] sm:w-[540px]">
                <Settings onTaskReceived={addTask} />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Add Task Button */}
        <div className="flex justify-center mb-8">
          <Button 
            onClick={() => setShowAddForm(!showAddForm)}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <Plus className="mr-2 h-5 w-5" />
            {showAddForm ? 'Cancel' : 'Add New Task'}
          </Button>
        </div>

        {/* Inline Add Task Form */}
        {showAddForm && (
          <div className="mb-8 flex justify-center">
            <Card className="w-full max-w-md p-6 bg-white shadow-lg">
              <AddTaskForm 
                onAddTask={addTask}
                onCancel={() => setShowAddForm(false)}
              />
            </Card>
          </div>
        )}

        {/* Edit Task Form Modal */}
        {editingTask && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md p-6 bg-white">
              <EditTaskForm 
                task={editingTask}
                onUpdateTask={updateTask}
                onCancel={() => setEditingTask(null)}
              />
            </Card>
          </div>
        )}

        {/* Task Categories */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
              onEditTask={editTask}
              category="work"
            />
          </TabsContent>
          
          <TabsContent value="life">
            <TaskList 
              tasks={lifeTasks}
              onToggleTask={toggleTask}
              onDeleteTask={deleteTask}
              onEditTask={editTask}
              category="life"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;

'use client'
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation"; // Correct usage for App Router

// Define Task type for better type safety
interface Task {
     id: string;
     title: string;
}

const Dashboard = () => {
     const { data: session, status } = useSession();
     const router = useRouter();
     const [tasks, setTasks] = useState<Task[]>([]); // Typing the tasks state
     const [newTaskTitle, setNewTaskTitle] = useState('');

     // Redirect user if not authenticated
     useEffect(() => {
          if (status === 'unauthenticated') {
               router.push("/"); // Redirect to home if user is not authenticated
          } else if (status === 'authenticated' && session) {
               fetchTasks(); // Fetch tasks if the user is authenticated
          }
     }, [status, session, router]);

     // Fetch tasks for the authenticated user
     const fetchTasks = async () => {
          try {
               const response = await fetch("/api/tasks");
               if (response.ok) {
                    const data = await response.json();
                    setTasks(data);
               } else {
                    console.error("Failed to fetch tasks.");
               }
          } catch (error) {
               console.error("Error fetching tasks:", error);
          }
     };

     // Add a new task
     const addTask = async () => {
          if (newTaskTitle.trim()) {
               try {
                    const res = await fetch("/api/tasks/create", {
                         method: "POST",
                         headers: { "Content-Type": "application/json" },
                         body: JSON.stringify({ title: newTaskTitle }),
                    });
                    if (res.ok) {
                         const data = await res.json();
                         setTasks([data, ...tasks]);
                         setNewTaskTitle(""); // Clear input after adding the task
                    } else {
                         console.error("Failed to add task.");
                    }
               } catch (error) {
                    console.error("Error adding task:", error);
               }
          }
     };

     // Delete a task
     const deleteTask = async (id: string) => {
          try {
               const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
               if (res.ok) {
                    const deletedTask = await res.json();
                    setTasks(tasks.filter(task => task.id !== deletedTask.id));
               } else {
                    console.error("Failed to delete task.");
               }
          } catch (error) {
               console.error("Error deleting task:", error);
          }
     };

     return (
          <div className="p-6 bg-gray-100 min-h-screen">
               <h1 className="text-3xl font-semibold mb-4">Dashboard</h1>
               <div className="space-y-4">
                    <input
                         type="text"
                         value={newTaskTitle}
                         onChange={(e) => setNewTaskTitle(e.target.value)}
                         placeholder="Enter new task"
                         className="p-2 border border-gray-300 rounded-md w-full"
                    />
                    <button
                         onClick={addTask}
                         className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 w-full"
                    >
                         Add Task
                    </button>
                    <div className="mt-4">
                         <h2 className="text-xl font-semibold mb-2">Your Tasks</h2>
                         {tasks.length === 0 ? (
                              <p>No tasks found.</p>
                         ) : (
                              tasks.map((task) => (
                                   <div key={task.id} className="flex justify-between items-center p-2 border-b border-gray-300">
                                        <span>{task.title}</span>
                                        <button
                                             onClick={() => deleteTask(task.id)}
                                             className="text-red-500 hover:text-red-700"
                                        >
                                             Delete
                                        </button>
                                   </div>
                              ))
                         )}
                    </div>
               </div>
          </div>
     );
};

export default Dashboard;

'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation'; // Correct hook for App Router

const EditTask = () => {
     const searchParams = useSearchParams(); // Use useSearchParams to access the query params
     const id = searchParams.get('id'); // Get the task ID from the query parameters

     const [task, setTask] = useState<{ title: string }>({ title: '' });

     useEffect(() => {
          if (id) {
               // Fetch task data based on the ID
               fetch(`/api/tasks/${id}`)
                    .then((res) => res.json())
                    .then((data) => setTask(data))
                    .catch((err) => console.error('Error fetching task:', err));
          }
     }, [id]);

     const updateTask = async () => {
          if (id) {
               const res = await fetch(`/api/tasks/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title: task.title }),
               });
               const updatedTask = await res.json();
               // Optionally redirect after successful update
               window.location.href = '/dashboard'; // This will redirect to the dashboard
          }
     };

     return (
          <div className="p-6 bg-gray-100 min-h-screen">
               <h1 className="text-3xl font-semibold mb-4">Edit Task</h1>
               <div className="space-y-4">
                    <input
                         type="text"
                         value={task.title}
                         onChange={(e) => setTask({ ...task, title: e.target.value })}
                         className="p-2 border border-gray-300 rounded-md w-full"
                    />
                    <button
                         onClick={updateTask}
                         className="py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 w-full"
                    >
                         Update Task
                    </button>
               </div>
          </div>
     );
};

export default EditTask;

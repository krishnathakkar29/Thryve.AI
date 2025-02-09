import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calendar, ListTodo, ClipboardList } from 'lucide-react';
import GoogleCalendar from "@/components/dashboard/GoogleCalendar";

const Dashboard = () => {
  const tasks = [
    { id: 1, title: "Complete project proposal", status: "In Progress" },
    { id: 2, title: "Review documentation", status: "Pending" },
    { id: 3, title: "Team meeting", status: "Complete" },
    { id: 4, title: "Client presentation", status: "Pending" },
    { id: 5, title: "Bug fixes", status: "In Progress" },
    { id: 6, title: "Code review", status: "Complete" }
  ];

  const todoItems = [
    { id: 1, text: "Prepare presentation", completed: false },
    { id: 2, text: "Send weekly report", completed: false },
    { id: 3, text: "Update timeline", completed: true },
    { id: 4, text: "Follow up with clients", completed: false },
    { id: 5, text: "Schedule team meeting", completed: false },
    { id: 6, text: "Review pull requests", completed: true }
  ];

  return (
    <div className='h-full overflow-y-auto scrollbar-hide'>
      <h1 className="text-4xl font-semibold text-[#0D578C] px-4 py-2">Home</h1>
      
      {/* Tasks and Todo Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 m-4">
        {/* Tasks Section */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-6 w-6" />
              Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[400px] overflow-auto scrollbar-hide">
            <div className="space-y-4">
              {tasks.map(task => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                  <span>{task.title}</span>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    task.status === 'Complete' ? 'bg-green-100 text-green-800' :
                    task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Todo List Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListTodo className="h-6 w-6" />
              Todo List
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[400px] overflow-auto scrollbar-hide">
            <div className="space-y-3">
              {todoItems.map(item => (
                <div key={item.id} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <span className={item.completed ? 'line-through text-gray-500' : ''}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mx-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            Tasks Calendar
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[550px] overflow-hidden">
          <GoogleCalendar />
        </CardContent>
      </Card>
    </div>
  );
};

// CSS to hide scrollbars while maintaining functionality
const style = document.createElement('style');
style.textContent = `
  .scrollbar-hide {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;  /* Chrome, Safari and Opera */
  }
`;
document.head.appendChild(style);

export default Dashboard;
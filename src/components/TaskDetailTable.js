import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronRight,
  UserIcon,
  Clock,
  Filter,
  Plus
} from 'lucide-react';

const TaskDetailTable = ({ tasks }) => {
  const [expandedTasks, setExpandedTasks] = useState(new Set());

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case '1':
        return 'High';
      case '2':
        return 'Normal';
      case '3':
        return 'Low';
      default:
        return 'Normal';
    }
  };

  const toggleTask = (taskId) => {
    setExpandedTasks(prev => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  };

  const organizeTasksHierarchy = (tasks) => {
    const taskMap = {};
    const rootTasks = [];

    // Create a map of all tasks
    tasks.forEach(task => {
      taskMap[task.id] = { ...task, subtasks: [] };
    });

    // Organize tasks into hierarchy
    tasks.forEach(task => {
      if (task.parent_id) {
        taskMap[task.parent_id]?.subtasks.push(taskMap[task.id]);
      } else {
        rootTasks.push(taskMap[task.id]);
      }
    });

    return rootTasks;
  };

  const getPriorityStyles = (priority) => {
    switch (priority) {
      case '1':
        return "text-red-600 bg-red-50 border border-red-100";
      case '2':
        return "text-yellow-600 bg-yellow-50 border border-yellow-100";
      case '3':
        return "text-green-600 bg-green-50 border border-green-100";
      default:
        return "text-gray-600 bg-gray-50 border border-gray-100";
    }
  };

  const getProgressStyles = (progress) => {
    const percentage = progress * 100;
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const renderTaskRow = (task, level = 0) => {
    const hasSubtasks = task.subtasks && task.subtasks.length > 0;
    const isExpanded = expandedTasks.has(task.id);

    return (
      <React.Fragment key={task.id}>
        <tr className={`hover:bg-gray-50 transition-colors ${level > 0 ? 'bg-gray-50/50' : ''}`}>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
              <div style={{ marginLeft: `${level * 20}px` }} className="flex items-center">
                {hasSubtasks && (
                  <button 
                    onClick={() => toggleTask(task.id)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    {isExpanded ? 
                      <ChevronDown className="h-4 w-4 text-gray-500" /> : 
                      <ChevronRight className="h-4 w-4 text-gray-500" />
                    }
                  </button>
                )}
                <span className="font-medium text-gray-900 ml-2">{task.text}</span>
              </div>
            </div>
          </td>
          
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                <UserIcon className="h-4 w-4 text-gray-500" />
              </div>
              <span className="ml-2 text-sm text-gray-600">
                {task.assigned_to_name || "Unassigned"}
              </span>
            </div>
          </td>
          
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-1" />
              {task.duration} days
            </div>
          </td>
          
          <td className="px-6 py-4 whitespace-nowrap">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityStyles(task.priority)}`}>
              {getPriorityLabel(task.priority)}
            </span>
          </td>
          
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getProgressStyles(task.progress)} transition-all duration-300`}
                  style={{ width: `${Math.round(task.progress * 100)}%` }}
                ></div>
              </div>
              <span className="ml-2 text-sm text-gray-600">{Math.round(task.progress * 100)}%</span>
            </div>
          </td>
        </tr>
        {hasSubtasks && isExpanded && task.subtasks.map(subtask => 
          renderTaskRow(subtask, level + 1)
        )}
      </React.Fragment>
    );
  };

  return (
    <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Task Detail</h2>
          <div className="flex items-center space-x-2">
            <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </button>
            <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </button>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Task Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assigned To
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progress
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {organizeTasksHierarchy(tasks).map(task => renderTaskRow(task))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskDetailTable;
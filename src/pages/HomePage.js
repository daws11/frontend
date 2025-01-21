import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Search,
  Bell,
} from 'lucide-react';
import ChartSection from '../components/ChartSection';
import TaskDetailTable from '../components/TaskDetailTable';
import StatsSection from '../components/StatsSection';

const HomePage = () => {
  const [projectNames, setProjectNames] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [projectDetails, setProjectDetails] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchProjectNames = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/home/project-names');
        setProjectNames(response.data);
        if (response.data.length > 0) {
          setSelectedProject(response.data[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch project names:', error);
      }
    };

    fetchProjectNames();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      const fetchProjectDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/projects/${selectedProject}`);
          setProjectDetails(response.data);
        } catch (error) {
          console.error('Failed to fetch project details:', error);
        }
      };

      const fetchTasks = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/home/projects/${selectedProject}/tasks`);
          setTasks(response.data);
        } catch (error) {
          console.error('Failed to fetch tasks:', error);
        }
      };

      fetchProjectDetails();
      fetchTasks();
    }
  }, [selectedProject]);

  const handleProjectChange = (event) => {
    setSelectedProject(event.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div>
        {/* Top Navigation */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="relative">
              <select
                value={selectedProject || ''}
                onChange={handleProjectChange}
                className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              >
                {projectNames.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M7 10l5 5 5-5H7z"/></svg>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-64 pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              
              <button className="relative p-2">
                <Bell className="h-6 w-6 text-gray-500" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-6">
          <StatsSection projectDetails={projectDetails} />
          <ChartSection tasks={tasks} />
          <TaskDetailTable tasks={tasks} />
        </main>
      </div>
    </div>
  );
};

export default HomePage;
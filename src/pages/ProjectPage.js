import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import GanttChart from '../components/GanttChart';
import ChatPopup from '../components/ChatPopup'; // Tambahkan ini
import {
  ChevronUpIcon,
  ChevronDownIcon,
  OfficeBuildingIcon,
  ClockIcon,
  CashIcon,
  CurrencyDollarIcon,
  TagIcon,
  UserGroupIcon,
  UserIcon,
  CalendarIcon,
  ChatIcon // Tambahkan ini
} from '@heroicons/react/outline';

const ProjectPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [projectLeaderName, setProjectLeaderName] = useState('');
  const [teamMembers, setTeamMembers] = useState([]);
  const [isProjectInfoCollapsed, setIsProjectInfoCollapsed] = useState(true);
  const [isTeamInfoCollapsed, setIsTeamInfoCollapsed] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false); // Tambahkan ini

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/projects/${id}`);
        setProject(response.data);

        const leaderResponse = await axios.get(`http://localhost:5000/api/users/${response.data.project_leader}`);
        setProjectLeaderName(leaderResponse.data.name);
      } catch (error) {
        console.error('Failed to fetch project:', error);
      }
    };

    const fetchTasks = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/projects/${id}/tasks`);
        setTasks(response.data);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      }
    };

    const fetchTeamMembers = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/projects/${id}/team-members`);
        setTeamMembers(response.data);
      } catch (error) {
        console.error('Failed to fetch team members:', error);
      }
    };

    fetchProject();
    fetchTasks();
    fetchTeamMembers();
  }, [id]);

  if (!project) {
    return (
      <div className="container mx-auto px-4">
        <div className="flex justify-center mt-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="mt-8 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
        <p className="text-gray-600 mt-2">Project Details</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Project Information</h2>
            <button 
              onClick={() => setIsProjectInfoCollapsed(!isProjectInfoCollapsed)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              {isProjectInfoCollapsed ? 
                <ChevronDownIcon className="h-6 w-6 text-gray-600" /> : 
                <ChevronUpIcon className="h-6 w-6 text-gray-600" />
              }
            </button>
          </div>

          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isProjectInfoCollapsed ? 'max-h-0' : 'max-h-[1000px]'}`}>
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="space-y-4">
                <div className="group p-4 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                  <div className="flex items-start space-x-4">
                    <OfficeBuildingIcon className="h-6 w-6 text-blue mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Job Owner</p>
                      <p className="font-medium text-gray-900">{project.job_owner}</p>
                    </div>
                  </div>
                </div>

                <div className="group p-4 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                  <div className="flex items-start space-x-4">
                    <ClockIcon className="h-6 w-6 text-blue mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Contract Duration</p>
                      <p className="font-medium text-gray-900">
                        {new Date(project.start_date).toLocaleDateString()} - 
                        {new Date(project.end_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group p-4 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                  <div className="flex items-start space-x-4">
                    <CashIcon className="h-6 w-6 text-blue mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Contract Value</p>
                      <p className="font-medium text-gray-900">
                        {new Intl.NumberFormat('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                        }).format(project.contract_value)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="group p-4 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                  <div className="flex items-start space-x-4">
                    <CurrencyDollarIcon className="h-6 w-6 text-blue mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Source of Funds</p>
                      <p className="font-medium text-gray-900">{project.source_of_funds}</p>
                    </div>
                  </div>
                </div>

                <div className="group p-4 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                  <div className="flex items-start space-x-4">
                    <TagIcon className="h-6 w-6 text-blue mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Line of Business</p>
                      <p className="font-medium text-gray-900">{project.line_of_business}</p>
                    </div>
                  </div>
                </div>

                {project.has_project_warranty && (
                  <div className="group p-4 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                    <div className="flex items-start space-x-4">
                      <CalendarIcon className="h-6 w-6 text-blue mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Project Warranty Duration</p>
                        <p className="font-medium text-gray-900">{project.project_warranty_duration}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 mt-8">
        <div className="p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Team Information</h2>
            <button 
              onClick={() => setIsTeamInfoCollapsed(!isTeamInfoCollapsed)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              {isTeamInfoCollapsed ? 
                <ChevronDownIcon className="h-6 w-6 text-gray-600" /> : 
                <ChevronUpIcon className="h-6 w-6 text-gray-600" />
              }
            </button>
          </div>

          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isTeamInfoCollapsed ? 'max-h-0' : 'max-h-[1000px]'}`}>
            <div className="mt-6 space-y-4">
              <div className="border-t border-gray-200 pt-4">
                <div className="group p-4 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                  <div className="flex items-start space-x-4">
                    <UserIcon className="h-6 w-6 text-blue mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Project Leader</p>
                      <p className="font-medium text-gray-900">{projectLeaderName}</p>
                    </div>
                  </div>
                </div>

                <div className="group p-4 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                  <div className="flex items-start space-x-4">
                    <UserGroupIcon className="h-6 w-6 text-blue mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Team Members</p>
                      <div className="flex items-center mt-3">
                        <p className="ml-4 text-sm text-gray-600">
                          {teamMembers.map(member => member.name).join(', ')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <GanttChart tasks={tasks} projectId={id} teamMembers={teamMembers} />
      </div>

      <button 
        onClick={() => setIsChatOpen(true)} // Tambahkan ini
        className="fixed bottom-8 right-8 p-4 bg-[#008069] text-white rounded-full shadow-lg hover:bg-[#015e4e] transition-colors"
      >
        <ChatIcon className="h-6 w-6" />
      </button>

      {isChatOpen && (
        <ChatPopup 
          projectId={id} 
          projectName={project.name} 
          teamMembers={teamMembers} 
          projectLeaderName={projectLeaderName} 
          onClose={() => setIsChatOpen(false)} 
        />
      )}
    </div>
  );
};

export default ProjectPage;
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../config';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/api/projects`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setProjects(response.data);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      }
    };

    fetchProjects();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BASE_URL}/api/projects/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setProjects(projects.filter((project) => project.id !== id));
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Projects</h1>
          <Link to="/create-project" className="bg-blue text-white px-4 py-2 rounded hover:bg-light-blue transition-colors">
            Create Project
          </Link>
        </div>
        <div className= "rounded-lg shadow-lg">
          <ul>
            {projects.map((project) => (
              <li key={project.id} className="bg-white p-4 mb-4 rounded-lg shadow-md flex justify-between items-center">
                <Link to={`/projects/${project.id}`} className="flex-grow">
                  <h2 className="text-xl font-semibold">{project.name}</h2>
                  <p className="text-gray-600">Job Owner: {project.job_owner}</p>
                </Link>
                <div className="flex space-x-2">
                  <Link to={`/projects/edit/${project.id}`} className="text-blue hover:text-light-blue transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536M9 11l3.536-3.536m0 0L20.485 2.05a2.121 2.121 0 113 3L15.232 8.768m-3.536 3.536L9 21H3v-6l8.768-8.768z" />
                    </svg>
                  </Link>
                  <button onClick={() => handleDelete(project.id)} className="text-red hover:text-light-red transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProjectList;
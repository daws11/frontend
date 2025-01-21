import React from 'react';
import { Briefcase, Calendar, DollarSign, User, Users } from 'lucide-react';
import { TagIcon } from '@heroicons/react/outline';

const calculateDuration = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const months = Math.floor(diffDays / 30);
  const days = diffDays % 30;

  if (months > 0) {
    return `${months} Months, ${days} Days`;
  } else {
    return `${days} Days`;
  }
};

const StatsSection = ({ projectDetails }) => {
  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const stats = projectDetails ? [
    { title: "Job Owner", value: projectDetails.job_owner || "N/A", icon: <Briefcase className="h-6 w-6 text-gray-500" /> },
    { title: "Contract Duration", value: calculateDuration(projectDetails.start_date, projectDetails.end_date), change: `${formatDate(projectDetails.start_date)} to ${formatDate(projectDetails.end_date)}`, icon: <Calendar className="h-6 w-6 text-gray-500" /> },
    { title: "Contract Value", value: `Rp. ${projectDetails.contract_value ? projectDetails.contract_value.toLocaleString() : "N/A"}`, change: `Source: ${projectDetails.source_of_funds || "N/A"}`, icon: <DollarSign className="h-6 w-6 text-gray-500" /> },
    { title: "Project Leader", value: projectDetails.project_leader_name || "N/A", icon: <User className="h-6 w-6 text-gray-500" /> },
    { title: "Project Member", value: `${projectDetails.teamMembers ? projectDetails.teamMembers.length : 0} Members`, icon: <Users className="h-6 w-6 text-gray-500" /> },
    { title: "Line of Business", value: projectDetails.line_of_business || "N/A", icon: <TagIcon className="h-6 w-6 text-gray-500" /> },
  ] : [];

  return (
    <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-3">
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className="bg-white rounded-lg p-6 shadow-sm transition-transform transform hover:scale-105 hover:shadow-lg"
        >
          <div className="flex items-center">
            {stat.icon}
            <h3 className="text-gray-500 text-sm font-medium ml-2">{stat.title}</h3>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-2xl font-semibold">{stat.value}</p>
            <span className="text-green-500 text-sm font-medium">
              {stat.change}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsSection;
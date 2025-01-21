import React, { useEffect, useState } from 'react';
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    ComposedChart,
    CartesianGrid,
    Line,
    Area,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    BarChart
} from 'recharts';

const ChartSection = ({ tasks }) => {
    const [overallTask, setOverallTask] = useState([
        { name: 'Completed', value: 0 },
        { name: 'Remaining', value: 100 },
    ]);
    const [taskProgress, setTaskProgress] = useState([]);
    const [teamTaskCount, setTeamTaskCount] = useState([]);

    useEffect(() => {
        if (tasks.length > 0) {
            const mainTasks = tasks.filter(task => task.parent_id === null);
            const subTasks = tasks.filter(task => task.parent_id !== null);

            const overallCompleted = mainTasks.length > 0 
                ? mainTasks.reduce((acc, task) => acc + (task.progress * 100), 0) / mainTasks.length 
                : 0;
            const overallRemaining = 100 - overallCompleted;

            setOverallTask([
                { name: 'Completed', value: parseFloat(overallCompleted.toFixed(1)) },
                { name: 'Remaining', value: parseFloat(overallRemaining.toFixed(1)) },
            ]);

            const taskProgressData = mainTasks.map(task => ({
                name: task.text,
                subtask: subTasks.filter(subtask => subtask.parent_id === task.id).length,
                progress: parseFloat((task.progress * 100).toFixed(1)),
                remaining: parseFloat((100 - (task.progress * 100)).toFixed(1)),
            }));

            setTaskProgress(taskProgressData);

            const teamTaskCountData = tasks.reduce((acc, task) => {
                const assignee = task.assigned_to_name || 'Unassigned';
                if (!acc[assignee]) {
                    acc[assignee] = 0;
                }
                acc[assignee]++;
                return acc;
            }, {});

            const teamTaskCountArray = Object.keys(teamTaskCountData).map(assignee => ({
                name: assignee,
                taskCount: teamTaskCountData[assignee],
            }));

            console.log('Team Task Count Data:', teamTaskCountArray); // Log data to check

            setTeamTaskCount(teamTaskCountArray);
        }
    }, [tasks]);

    const COLORS = ['#0088FE', '#FF8042'];

    const tooltipFormatter = (value, name) => {
        if (name === 'progress' || name === 'remaining') {
            return `${parseFloat(value.toFixed(1))}%`;
        }
        return value;
    };

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Overall Progress Pie Chart */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Overall Progress</h2>
                </div>
                <div className="h-80 relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={overallTask}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {overallTask.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                    {/* Centered percentage label */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <span className="text-2xl font-bold">{Math.round(overallTask[0].value)}%</span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Team Task Count</h2>
                </div>
                <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            width={500}
                            height={300}
                            data={teamTaskCount}
                            margin={{
                                top: 20,
                                right: 20,
                                bottom: 20,
                                left: 20,
                            }}
                            layout="vertical"
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis type="category" dataKey="name" />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="taskCount" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 col-span-2">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Task Progress</h2>
                </div>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart
                            layout="horizontal"
                            width={500}
                            height={400}
                            data={taskProgress}
                            margin={{
                                top: 20,
                                right: 20,
                                bottom: 20,
                                left: 20,
                            }}
                        >
                            <CartesianGrid stroke="#f5f5f5" />
                            <XAxis dataKey="name" type="category" scale="band" />
                            <YAxis type="number" />
                            <Tooltip formatter={tooltipFormatter} />
                            <Legend />
                            <Bar dataKey="progress" barSize={20} fill="#413ea0" />
                            <Area dataKey="remaining" fill="#8884d8" stroke="#8884d8" fillOpacity={0.4} />
                            <Line dataKey="subtask" stroke="#ff7300" />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default ChartSection;